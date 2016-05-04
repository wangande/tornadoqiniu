#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tornado.web
import tornado.gen

from basecode.routes import route


@route(r"/", name="index")
@route(r"/index", name="index.home")
class IndexHandler(tornado.web.RequestHandler):

    @tornado.web.asynchronous
    @tornado.gen.engine
    def get(self):
        self.render("index.html")
