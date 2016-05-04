# -*- coding: utf-8 -*-
'''
Qiniu Resource Storage SDK for Python
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For detailed document, please see:
<http://developer.qiniu.com>
'''

# flake8: noqa

__version__ = '1.0.0'

from .auth import Auth

from .config import set_default, Zone

from .services.upload.uploader import put_data, put_file, put_stream

from .utils import urlsafe_base64_encode, urlsafe_base64_decode, etag, entry
