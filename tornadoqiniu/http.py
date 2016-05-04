# -*- coding: utf-8 -*-

import platform
import tornado.gen
import tornado.web
import json
from requests.auth import AuthBase

from tornadoqiniu import config
from .auth import RequestsAuth
from . import __version__
from .tornadoHttp import TornadoHttp


_sys_info = '{0}; {1}'.format(platform.system(), platform.machine())
_python_ver = platform.python_version()

USER_AGENT = 'QiniuPython/{0} ({1}; ) Python/{2}'.format(__version__, _sys_info, _python_ver)

_session = None
_headers = {'User-Agent': USER_AGENT}


class _TokenAuth(AuthBase):
    def __init__(self, token):
        self.token = token

    def __call__(self):

        # r.headers['Authorization'] = 'UpToken {0}'.format(self.token)
        # return r

        return 'UpToken {0}'.format(self.token)


class QiniuHttp(object):
    """
    七牛上传http接口类
    """
    def __init__(self, http_proxy={}):
        self.tornado_http = TornadoHttp(http_proxy)

    def __return_wrapper(self, resp):
        # if resp.status_code != 200 or resp.headers.get('X-Reqid') is None:
        #     return None, ResponseInfo(resp)
        # ret = resp.json() if resp.text != '' else {}

        if resp.code != 200 or resp.headers.get('X-Reqid') is None:
            return None, ResponseInfo(resp)
        try:
            ret = json.loads(resp.body) if resp.body else {}
        except Exception, e:
            ret = {}

        return [ret, ResponseInfo(resp)]

    @tornado.gen.engine
    def _post(self, url, data, files, auth, callback=None):
        try:
            r = yield tornado.gen.Task(self.tornado_http.tornado_http_post, url, data=data, files=files, auth=auth,
                                       headers=_headers, timeout=config.get_default('connection_timeout'))
        except Exception as e:
            callback([None, ResponseInfo(None, e)])
            return

        callback(self.__return_wrapper(r))

    @tornado.gen.engine
    def _get(self, url, params, auth, callback=None):
        try:
            r = yield tornado.gen.Task(self.tornado_http.tornado_http_get, url, data=params,
                                       auth=RequestsAuth(auth) if auth is not None else None,
                                       headers=_headers, timeout=config.get_default('connection_timeout'))
        except Exception as e:
            callback([None, ResponseInfo(None, e)])
            return
        callback(self.__return_wrapper(r))

    @tornado.gen.engine
    def post_with_token(self, url, data, token, callback=None):
        [ret, info] = yield tornado.gen.Task(self._post, url, data, None, _TokenAuth(token))
        callback([ret, info])

    @tornado.gen.engine
    def post_file(self, url, data, files, callback=None):
        [ret, info] = yield tornado.gen.Task(self._post, url, data, files, None)
        callback([ret, info])

    @tornado.gen.engine
    def post_with_auth(self, url, data, auth, callback=None):
        [ret, info] = yield tornado.gen.Task(self._post, url, data, None, RequestsAuth(auth))
        callback([ret, info])


class ResponseInfo(object):
    """七牛HTTP请求返回信息类

    该类主要是用于获取和解析对七牛发起各种请求后的响应包的header和body。

    Attributes:
        status_code: 整数变量，响应状态码
        text_body:   字符串变量，响应的body
        req_id:      字符串变量，七牛HTTP扩展字段，参考 http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html
        x_log:       字符串变量，七牛HTTP扩展字段，参考 http://developer.qiniu.com/docs/v6/api/reference/extended-headers.html
        error:       字符串变量，响应的错误内容
    """

    def __init__(self, response, exception=None):
        """用响应包和异常信息初始化ResponseInfo类"""
        self.__response = response
        self.exception = exception
        if response is None:
            self.status_code = -1
            self.text_body = None
            self.req_id = None
            self.x_log = None
            self.error = str(exception)
        else:
            self.status_code = response.code
            self.text_body = response.body
            self.req_id = response.headers.get('X-Reqid')
            self.x_log = response.headers.get('X-Log')
            if self.status_code >= 400:
                try:
                    ret = json(response.body) if response.body != '' else None
                except Exception,e:
                    ret = None

                if ret is None or ret['error'] is None:
                    self.error = 'unknown'
                else:
                    self.error = ret['error']
            if self.req_id is None and self.status_code == 200:
                self.error = 'server is not qiniu'

    def ok(self):
        return self.status_code == 200 and self.req_id is not None

    def need_retry(self):
        if self.__response is None or self.req_id is None:
            return True
        code = self.status_code
        if (code // 100 == 5 and code != 579) or code == 996:
            return True
        return False

    def connect_failed(self):
        return self.__response is None or self.req_id is None

    def __str__(self):
        return ', '.join(['%s:%s' % item for item in self.__dict__.items()])

    def __repr__(self):
        return self.__str__()
