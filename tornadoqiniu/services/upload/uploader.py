# -*- coding: utf-8 -*-

import os
import time
import tornado.gen
import tornado.web

from tornadoqiniu import config
from tornadoqiniu.utils import urlsafe_base64_encode, crc32, file_crc32, _file_iter
from tornadoqiniu.http import QiniuHttp
from .upload_progress_recorder import UploadProgressRecorder


@tornado.gen.engine
def put_data(
        up_token, key, data, params=None, mime_type='application/octet-stream', check_crc=False, progress_handler=None, callback=None):
    """上传二进制流到七牛

    Args:
        up_token:         上传凭证
        key:              上传文件名
        data:             上传二进制流
        params:           自定义变量，规格参考 http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html#xvar
        mime_type:        上传数据的mimeType
        check_crc:        是否校验crc32
        progress_handler: 上传进度

    Returns:
        一个dict变量，类似 {"hash": "<Hash string>", "key": "<Key string>"}
        一个ResponseInfo对象
    """
    crc = crc32(data) if check_crc else None
    [ret, info] = yield tornado.gen.Task(_form_put, up_token, key, data, params, mime_type, crc, progress_handler)
    callback([ret, info])


@tornado.gen.engine
def put_file(up_token, key, file_path, params=None,
             mime_type='application/octet-stream', check_crc=False,
             progress_handler=None, upload_progress_recorder=None, http_proxy={}, callback=None):
    """上传文件到七牛

    Args:
        up_token:         上传凭证
        key:              上传文件名
        file_path:        上传文件的路径
        params:           自定义变量，规格参考 http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html#xvar
        mime_type:        上传数据的mimeType
        check_crc:        是否校验crc32
        progress_handler: 上传进度
        upload_progress_recorder: 记录上传进度，用于断点续传

    Returns:
        一个dict变量，类似 {"hash": "<Hash string>", "key": "<Key string>"}
        一个ResponseInfo对象
    """
    ret = {}
    size = os.stat(file_path).st_size
    # fname = os.path.basename(file_path)
    with open(file_path, 'rb') as input_stream:
        file_name = os.path.basename(file_path)
        if size > config._BLOCK_SIZE * 2:
            [ret, info] = yield tornado.gen.Task(put_stream, up_token, key, input_stream, file_name, size, params,
                                                 mime_type, progress_handler,
                                                 upload_progress_recorder=upload_progress_recorder,
                                                 modify_time=(int)(os.path.getmtime(file_path)),
                                                 http_proxy=http_proxy)

        else:
            crc = file_crc32(file_path) if check_crc else None
            [ret, info] = yield tornado.gen.Task(_form_put, up_token, key, input_stream, params, mime_type, crc,
                                                 progress_handler, file_name, http_proxy=http_proxy)
    callback([ret, info])


@tornado.gen.engine
def _form_put(up_token, key, data, params, mime_type, crc, progress_handler=None, file_name=None, http_proxy={}, callback=None):
    fields = {}
    if params:
        for k, v in params.items():
            fields[k] = str(v)
    if crc:
        fields['crc32'] = crc
    if key is not None:
        fields['key'] = key

    fields['token'] = up_token
    url = 'http://' + config.get_default('default_up_host') + '/'
    # name = key if key else file_name

    http = QiniuHttp(http_proxy)

    fname = file_name
    [r, info] = yield tornado.gen.Task(http.post_file, url, data=fields, files={'file': (fname, data, mime_type)})
    if r is None and info.need_retry():
        if info.connect_failed:
            url = 'http://' + config.get_default('default_up_host_backup') + '/'
        if hasattr(data, 'read') is False:
            pass
        elif hasattr(data, 'seek') and (not hasattr(data, 'seekable') or data.seekable()):
            data.seek(0)
        else:
            callback([r, info])
        [r, info] = yield tornado.gen.Task(http.post_file, url, data=fields, files={'file': (fname, data, mime_type)})

    # return r, info
    callback([r, info])


@tornado.gen.engine
def put_stream(up_token, key, input_stream, file_name, data_size, params=None,
               mime_type=None, progress_handler=None,
               upload_progress_recorder=None, modify_time=None, http_proxy={}, callback=None):

    task = _Resume(up_token, key, input_stream, data_size, params, mime_type,
                   progress_handler, upload_progress_recorder, modify_time, file_name,
                   http_proxy=http_proxy)

    [ret, info] = yield tornado.gen.Task(task.upload)
    callback([ret, info])


class _Resume(object):
    """断点续上传类

    该类主要实现了分块上传，断点续上，以及相应地创建块和创建文件过程，详细规格参考：
    http://developer.qiniu.com/docs/v6/api/reference/up/mkblk.html
    http://developer.qiniu.com/docs/v6/api/reference/up/mkfile.html

    Attributes:
        up_token:         上传凭证
        key:              上传文件名
        input_stream:     上传二进制流
        data_size:        上传流大小
        params:           自定义变量，规格参考 http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html#xvar
        mime_type:        上传数据的mimeType
        progress_handler: 上传进度
        upload_progress_recorder:  记录上传进度，用于断点续传
        modify_time:      上传文件修改日期
    """

    def __init__(self, up_token, key, input_stream, data_size, params, mime_type,
                 progress_handler, upload_progress_recorder, modify_time, file_name,
                 http_proxy={}):
        """初始化断点续上传"""
        self.up_token = up_token
        self.key = key
        self.input_stream = input_stream
        self.size = data_size
        self.params = params
        self.mime_type = mime_type
        self.progress_handler = progress_handler
        self.upload_progress_recorder = upload_progress_recorder or UploadProgressRecorder()
        self.modify_time = modify_time or time.time()
        self.file_name = file_name
        self.http = QiniuHttp(http_proxy)
        # print(self.modify_time)
        # print(modify_time)

    def record_upload_progress(self, offset):
        record_data = {
            'size': self.size,
            'offset': offset,
            'contexts': [block['ctx'] for block in self.blockStatus]
        }
        if self.modify_time:
            record_data['modify_time'] = self.modify_time
        # print(record_data)
        self.upload_progress_recorder.set_upload_record(self.file_name, self.key, record_data)

    def recovery_from_record(self):
        record = self.upload_progress_recorder.get_upload_record(self.file_name, self.key)
        if not record:
            return 0

        try:
            if not record['modify_time'] or record['size'] != self.size or \
                    record['modify_time'] != self.modify_time:
                return 0
        except KeyError:
            return 0
        self.blockStatus = [{'ctx': ctx} for ctx in record['contexts']]
        return record['offset']

    @tornado.gen.engine
    def upload(self, callback=None):
        """上传操作"""

        self.blockStatus = []
        host = config.get_default('default_up_host')
        offset = self.recovery_from_record()
        for block in _file_iter(self.input_stream, config._BLOCK_SIZE, offset):
            length = len(block)
            crc = crc32(block)

            [ret, info] = yield tornado.gen.Task(self.make_block, block, length, host)

            if ret is None and not info.need_retry():
                callback([ret, info])
                return
            if info.connect_failed():
                host = config.get_default('default_up_host_backup')
            if info.need_retry() or crc != ret['crc32']:
                [ret, info] = yield tornado.gen.Task(self.make_block, block, length, host)
                if ret is None or crc != ret['crc32']:
                    callback([ret, info])
                    return
            self.blockStatus.append(ret)
            offset += length
            self.record_upload_progress(offset)
            if(callable(self.progress_handler)):
                self.progress_handler(((len(self.blockStatus) - 1) * config._BLOCK_SIZE)+length, self.size)

        [ret, info] = yield tornado.gen.Task(self.make_file, host)
        callback([ret, info])

    @tornado.gen.engine
    def make_block(self, block, block_size, host, callback=None):
        """创建块"""
        url = self.block_url(host, block_size)
        [ret, info] = yield tornado.gen.Task(self.post, url, block)
        callback([ret, info])

    def block_url(self, host, size):
        return 'http://{0}/mkblk/{1}'.format(host, size)

    def file_url(self, host):
        url = ['http://{0}/mkfile/{1}'.format(host, self.size)]

        if self.mime_type:
            url.append('mimeType/{0}'.format(urlsafe_base64_encode(self.mime_type)))

        if self.key is not None:
            url.append('key/{0}'.format(urlsafe_base64_encode(self.key)))

        if self.file_name is not None:
            url.append('fname/{0}'.format(urlsafe_base64_encode(self.file_name)))

        if self.params:
            for k, v in self.params.items():
                url.append('{0}/{1}'.format(k, urlsafe_base64_encode(v)))
            pass
        url = '/'.join(url)
        # print url
        return url

    @tornado.gen.engine
    def make_file(self, host, callback=None):
        """创建文件"""
        url = self.file_url(host)
        body = ','.join([status['ctx'] for status in self.blockStatus])
        [ret, info] = yield tornado.gen.Task(self.post, url, body)
        callback([ret, info])

    @tornado.gen.engine
    def post(self, url, data, callback=None):
        [ret, info] = yield tornado.gen.Task(self.http.post_with_token, url, data, self.up_token)
        callback([ret, info])

