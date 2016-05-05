#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
@author:andrew
@date:2015-12-23
"""

import logging
import os
import hashlib
import mimetypes

import tornado.web
import tornado.gen
import json
import tornadoqiniu

from basecode.routes import route


ACCESS_KEY = "access_key"
SECRET_KEY = "secret_key"


TEST_BUCKET = "test"

BUCKETS = {
    "test": "test",
}

BUCKETS_URL = {
    "test": "http://test.com2.z0.glb.qiniucdn.com/",
}


def get_content_type(filename):
    return mimetypes.guess_type(filename)[0] or 'application/octet-stream'


qiniuAuth = tornadoqiniu.Auth(ACCESS_KEY, SECRET_KEY)


# 从七牛获取上传token
# 用于客户端请求上传,服务器端自主上传到七牛
def get_upload_token(filename, app_id="huanshi"):
    bucket = BUCKETS[app_id]
    expires = 3600
    policy = {}
    strict_policy = True
    # ext = filename.split(".")[-1]
    key = None

    token = qiniuAuth.upload_token(bucket, key=key, expires=expires, policy=policy, strict_policy=strict_policy)
    return token


# 使用文件路径上传
# 如果文件大小大于4m，自动断点续传
# 如果文件名已存在将返回错误
@tornado.gen.engine
def upload_by_path(token, file_path, filename=None, http_proxy={}, callback=None):

    content_type = get_content_type(file_path)
    [ret, info] = yield tornado.gen.Task(tornadoqiniu.put_file, token, filename, file_path,
                                         mime_type=content_type, check_crc=True, http_proxy=http_proxy)
    callback([ret, info])


@route("/upload/file", name="upload.file")
class UploadFileHandler(tornado.web.RequestHandler):

    def render_error(self, msg=""):
        self.set_status(203)
        error = {
            "status": "error",
            "msg": msg
        }
        self.write(json.dumps(error))
        self.finish()

    def render_success(self, msg="", data=""):
        self.set_status(200)
        success = {
            "status": "success",
            "msg": msg,
            "data": data
        }
        self.write(json.dumps(success))
        self.finish()

    @tornado.web.asynchronous
    @tornado.gen.engine
    def post(self):

        upload_file = self.request.files.get('file', "")
        if not upload_file:
            logging.error("file error")
            self.render_error(msg="file error")
            return

        upload_file = upload_file[0]
        self.file_name = upload_file.get('filename', '').encode("utf-8")
        self.file_ext = self.get_file_extension(self.file_name)
        if not self.file_ext:
            logging.error("file ext error")
            self.render_error(msg="file ext error")
            return

        self.file_path = None
        self.file_md5 = None

        file_buffer = upload_file.get("body")
        if file_buffer:
            file_path = "/tmp/" + self.file_name
            with open(file_path, "wb") as f:
                f.write(file_buffer)

            if os.path.exists(file_path):
                self.file_md5 = self.get_file_md5(file_path) + "." + self.file_ext
                self.file_path = file_path

        if not self.file_path or not self.file_md5:
            logging.error("file error")
            self.render_error(msg="file error")
            return

        self.file_id = yield tornado.gen.Task(self.upload_file_to_qiniu)
        if not self.file_id:
            self.render_error(msg="upload qiniu error!")
            return

        data = {
            "url": BUCKETS_URL.get("yixunfiles") + self.file_md5
        }
        self.render_success(data=data)

    @tornado.gen.engine
    def upload_file_to_qiniu(self, callback=None):
        file_id = ""
        try:
            http_proxy = {
                'proxy_host': '10.0.1.37',
                'proxy_port': 3128,
                #$'proxy_username': 'guest',
                #'proxy_password': 'idealsee2016'
            }

            token = get_upload_token(self.file_name, app_id="yixunfiles")
            logging.error("token:%s" % token)

            ret, info = yield tornado.gen.Task(upload_by_path, token, self.file_path, self.file_md5, http_proxy=http_proxy)
            logging.error("ret:%s" % ret)
            logging.error("info:%s" % info)

            if info.status_code == 200:
                file_id = ret['hash']
        except Exception, e:
            logging.error("upload file to qiniu error")

        callback(file_id)

    # 获取文件的扩展名
    def get_file_extension(self, filename):
        end_index = filename.rfind(".")
        if end_index >= 0:
            return filename[end_index+1:]
        else:
            return ""

    # 大文件的MD5值
    def get_file_md5(self, filename):
        if not os.path.isfile(filename):
            return None

        md5obj = hashlib.md5()
        f = file(filename, 'rb')
        while True:
            b = f.read(8096)
            if not b:
                break
            md5obj.update(b)
        f.close()

        md5 = md5obj.hexdigest()
        return md5
