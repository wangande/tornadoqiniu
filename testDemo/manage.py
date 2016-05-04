# -*- coding: UTF-8 -*-

import os.path
import logging
from tornado.options import define, options
import tornado.httpserver
import tornado.ioloop
import tornado.web
from basecode.routes import route

define("port", default=8888, help="Run server on a specific port", type=int)


# 自定义Application类，继承于Application
class Application(tornado.web.Application):

    def __init__(self):

        # 导入views，生成routes
        import views
        handlers = route.get_routes()
        # 定义setting，对tornado.web.Application进行设置
        settings = dict(
            blog_title=u"webar",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
            cookie_secret="NyM8vWu0Slec0GLonsdI3ebBX0VEqU3Vm8MsHiN5rrc=",
            app_secret="XOJOwYhNTgOTJqnrszG3hWuAsTmVz0GisOCY6R5d1E8=",
            login_url="/",
            autoescape=None,
            gzip=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


def main():
    options.log_to_stderr = True
    options.logging = 'info'
    tornado.options.parse_command_line()
    # 启动http server监听端口
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    # 启动ioloop
    logging.error("start server")
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()
