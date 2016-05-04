#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
@author = 'andrew'
@date = '2016/4/25'
"""

import logging
import sys
import random
import re
import mimetypes
import itertools
from urllib import urlencode

import tornado.gen
from tornado.httpclient import AsyncHTTPClient, HTTPRequest

AsyncHTTPClient.configure("tornado.curl_httpclient.CurlAsyncHTTPClient")


class UploadForm(object):
    """
    上传对象构造
    """

    def __init__(self):
        self.form_fields = []
        self.files = []
        self.boundary = self.make_upload_from_boundary()
        self.content_type = 'multipart/form-data; boundary=%s' % self.boundary

    def make_upload_from_boundary(self, text=None):
        """
        生成上传boundary
        :param text:
        :return:
        """
        _width = len(repr(sys.maxint - 1))
        _fmt = '%%0%dd' % _width
        # Craft a random boundary.  If text is given, ensure that the chosen
        # boundary doesn't appear in the text.
        token = random.randrange(sys.maxint)
        boundary = '----' + (_fmt % token)
        if text is None:
            return boundary
        b = boundary
        counter = 0

        while True:
            cre = re.compile('^--' + re.escape(b) + '(--)?$', re.MULTILINE)
            if not cre.search(text):
                break
            b = boundary + '.' + str(counter)
            counter += 1

        return b

    def get_content_type(self):
        return self.content_type

    def add_field(self, name, value):
        self.form_fields.append((str(name), str(value)))
        return

    def add_file(self, fieldname, filename, fileHandle, mimetype=None):
        body = fileHandle.read()
        if mimetype is None:
            mimetype = (mimetypes.guess_type(filename)[0] or 'applicatioin/octet-stream')
        self.files.append((fieldname, filename, mimetype, body))
        return

    def __str__(self):
        parts = []
        part_boundary = '--' + self.boundary

        parts.extend(
            [part_boundary, 'Content-Disposition: form-data; name="%s"' % name,
             '',
             value,
             ]
            for name, value in self.form_fields)
        if self.files:
            parts.extend([
                             part_boundary,
                             'Content-Disposition: form-data; name="%s"; filename="%s"' % \
                             (field_name, filename),
                             'Content-Type: %s' % content_type,
                             '',
                             body,
                         ] for field_name, filename, content_type, body in self.files)

        flattened = list(itertools.chain(*parts))
        flattened.append('--' + self.boundary + '--')
        flattened.append('')
        return '\r\n'.join(flattened)


class TornadoHttp(object):
    def __init__(self, http_proxy={}):

        self.proxy_host = http_proxy['proxy_host'] if http_proxy.get("proxy_host") else None
        self.proxy_port = http_proxy['proxy_port'] if http_proxy.get("proxy_port") else None
        self.proxy_username = http_proxy['proxy_username'] if http_proxy.get("proxy_username") else None
        self.proxy_password = http_proxy['proxy_password'] if http_proxy.get("proxy_password") else None

    @tornado.gen.engine
    def _post(self, url, headers=None, body=None, timeout=None, callback=None):
        http_client = AsyncHTTPClient()
        http_request = HTTPRequest(url, method="POST", headers=headers, body=body,
                                   proxy_host=self.proxy_host, proxy_port=self.proxy_port,
                                   proxy_username=self.proxy_username, proxy_password=self.proxy_password,
                                   request_timeout=timeout if timeout else 60)

        response = yield tornado.gen.Task(http_client.fetch, http_request)
        callback(response)

    @tornado.gen.engine
    def _get(self, url, headers=None, data="", timeout=None, callback=None):
        http_client = AsyncHTTPClient()

        http_request = HTTPRequest('%s?%s' % (url, urlencode(data)), headers=headers,
                                   proxy_host=self.proxy_host, proxy_port=self.proxy_port,
                                   request_timeout=timeout if timeout else 60)

        response = yield tornado.gen.Task(http_client.fetch, http_request)

        callback(response)

    @tornado.gen.engine
    def tornado_http_post(self, url, data={}, files=None, auth=None, headers={}, timeout=None, callback=None):
        form = ""
        if files:
            form = UploadForm()
            [form.add_field(name, value) for name, value in data.items()]
            form.add_file('file', files['file'][0], files['file'][1], files['file'][2])
            headers['Content-Type'] = form.content_type
        else:
            form = data
            if auth:
                headers['Authorization'] = auth()

        # if 'User-Agent' not in headers:
        #     headers['User-Agent'] = 'QiniuPython/7.0.6 (Linux; x86_64; ) Python/2.7.6'

        # logging.error(headers)
        response = yield tornado.gen.Task(self._post, url, headers=headers, body=str(form), timeout=timeout)
        callback(response)

    @tornado.gen.engine
    def tornado_http_get(self, url, data={}, auth=None, headers={}, timeout=None, callback=None):
        if auth:
            headers['Authorization'] = auth()

        logging.error(headers)
        response = yield tornado.gen.Task(self._get, url, headers=headers, body=data, timeout=timeout)
        callback(response)
