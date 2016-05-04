!function($, wysi) {
    "use strict";

    var tpl = {
        "font-styles": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li class='dropdown'>" +
              "<a class='btn dropdown-toggle btn-primary" + size + "' data-toggle='dropdown' date-wgt='btg-dropdown-proxy' href='#'>" +
              "<i class='icon-white icon-font'></i>&nbsp;<span class='current-font'>" + locale.font_styles.normal + "</span>&nbsp;<b class='caret'></b>" +
              "</a>" +
              "<ul class='dropdown-menu' role='menu' aria-labelledby='dLabel'>" +
                "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div' tabindex='-1'>" + locale.font_styles.normal + "</a></li>" +
                // "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1' tabindex='-1'>" + locale.font_styles.h1 + "</a></li>" +
                // "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2' tabindex='-1'>" + locale.font_styles.h2 + "</a></li>" +
                "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h3' tabindex='-1'>" + locale.font_styles.h3 + "</a></li>" +
              "</ul>" +
            "</li>";
        },

        "fontSize": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li class='dropdown'>" +
              "<a class='btn dropdown-toggle btn-primary" + size + "' data-toggle='dropdown' href='#'>" +
              "<i class='icon-white icon-font'></i>&nbsp;<span class='current-font-size'>" + locale.fontSize['48'] + "</span>&nbsp;<b class='caret'></b>" +
              "</a>" +
              "<ul class='dropdown-menu'>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='24' class='wysiwyg-font-size-24' tabindex='-1'>" + locale.fontSize['24'] + "</a></li>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='36' class='wysiwyg-font-size-36' tabindex='-1'>" + locale.fontSize['36'] + "</a></li>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='48' class='wysiwyg-font-size-48' tabindex='-1'>" + locale.fontSize['48'] + "</a></li>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='56' class='wysiwyg-font-size-56' tabindex='-1'>" + locale.fontSize['56'] + "</a></li>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='72' class='wysiwyg-font-size-72' tabindex='-1'>" + locale.fontSize['72'] + "</a></li>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='96' class='wysiwyg-font-size-96' tabindex='-1'>" + locale.fontSize['96'] + "</a></li>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='108' class='wysiwyg-font-size-108' tabindex='-1'>" + locale.fontSize['108'] + "</a></li>" +
                "<li><a data-wysihtml5-command='fontSize' data-wysihtml5-command-value='136' class='wysiwyg-font-size-136' tabindex='-1'>" + locale.fontSize['136'] + "</a></li>" +
              "</ul>" +
            "</li>";
        },

        "emphasis": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
              "<div class='btn-group'>" +
                "<a class='btn" + size + "' data-wysihtml5-command='bold' title='CTRL+B' tabindex='-1'>" + locale.emphasis.bold + "</a>" +
                "<a class='btn" + size + "' data-wysihtml5-command='italic' title='CTRL+I' tabindex='-1'>" + locale.emphasis.italic + "</a>" +
                "<a class='btn" + size + "' data-wysihtml5-command='underline' title='CTRL+U' tabindex='-1'>" + locale.emphasis.underline + "</a>" +
              "</div>" +
            "</li>";
        },

        "lists": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
              "<div class='btn-group'>" +
                "<a class='btn" + size + "' data-wysihtml5-command='insertUnorderedList' title='" + locale.lists.unordered + "' tabindex='-1'><i class='icon-list'></i></a>" +
                "<a class='btn" + size + "' data-wysihtml5-command='insertOrderedList' title='" + locale.lists.ordered + "' tabindex='-1'><i class='icon-th-list'></i></a>" +
                "<a class='btn" + size + "' data-wysihtml5-command='Outdent' title='" + locale.lists.outdent + "' tabindex='-1'><i class='icon-indent-right'></i></a>" +
                "<a class='btn" + size + "' data-wysihtml5-command='Indent' title='" + locale.lists.indent + "' tabindex='-1'><i class='icon-indent-left'></i></a>" +
              "</div>" +
            "</li>";
        },

        "link": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
              "<div class='bootstrap-wysihtml5-insert-link-modal modal hide fade'>" +
                "<div class='modal-header'>" +
                  "<a class='close' data-dismiss='modal'>&times;</a>" +
                  "<h3>" + locale.link.insert + "</h3>" +
                "</div>" +
                "<div class='modal-body'>" +
                  "<input value='http://' class='bootstrap-wysihtml5-insert-link-url input-xlarge'>" +
                "</div>" +
                "<div class='modal-footer'>" +
                  "<a href='#' class='btn' data-dismiss='modal'>" + locale.link.cancel + "</a>" +
                  "<a href='#' class='btn btn-primary' data-dismiss='modal'>" + locale.link.insert + "</a>" +
                "</div>" +
              "</div>" +
              "<a class='btn btn-primary" + size + "' data-wysihtml5-command='createLink' title='" + locale.link.insert + "' tabindex='-1'><i class='icon-white icon-share'></i><span>" + locale.link.insert + "</span></a>" +
            "</li>";
        },

        "image": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return '<li>' +
              '<a class="btn btn-primary"' + size + ' data-wysihtml5-command="insertImage" data-wgt="single-upload" title="' + locale.image.insert + '" tabindex="-1"><i class="icon-white icon-picture"></i><span>' + locale.image.insert + '</span></a>' +
              '<span class="loading-small wgt-loading-upload" style="display:none;"></span>' +
              '<!-- used by file upload -->' + 
              '<div class="image-upload-cover upload-cover"></div>' +
              '<div class="image-upload-progress upload-progress progress">' +
                    '<div class="progress-bar"></div>' + 
                '</div>' + 
                '<div class="image-upload-progress-label upload-progress-label"></div>' +
                '<div class="image-cancel-group cancel-group">' +
                    '<button class="btn btn-danger btn-xs image-cancel">' + $._('Cancel') + '</button>' +
                '</div>' +
            '</li>';
        },

        "html": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
              "<div class='btn-group'>" +
                "<a class='btn" + size + "' data-wysihtml5-action='change_view' title='" + locale.html.edit + "' tabindex='-1'><i class='icon-pencil'></i></a>" +
              "</div>" +
            "</li>";
        },

        "paging": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
              "<div class='btn-group'>" +
                "<a class='btn btn-primary" + size + "' data-wysihtml5-action='paging' title='" + locale.paging.edit + "' tabindex='-1'><i class='icon-white  icon-file'></i><span>" + locale.paging.edit + "</span></a>" +
              "</div>" +
            "</li>";
        },

        "fullScreen" : function(locale, options){
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li>" +
              "<div class='btn-group'>" +
                "<a class='btn btn-primary" + size + "' data-wysihtml5-action='fullScreen' title='" + locale.fullScreen.label + "' tabindex='-1'><i class='icon-white  icon-file'></i><span>" + locale.fullScreen.label + "</span></a>" +
              "</div>" +
            "</li>";
        },

        "color": function(locale, options) {
            var size = (options && options.size) ? ' btn-'+options.size : '';
            return "<li class='dropdown'>" +
              "<a class='btn dropdown-toggle" + size + "' data-toggle='dropdown' href='#' tabindex='-1'>" +
                "<span class='current-color'>" + locale.colours.black + "</span>&nbsp;<b class='caret'></b>" +
              "</a>" +
              "<ul class='dropdown-menu'>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='black'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='black'>" + locale.colours.black + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='silver'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='silver'>" + locale.colours.silver + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='gray'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='gray'>" + locale.colours.gray + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='maroon'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='maroon'>" + locale.colours.maroon + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='red'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='red'>" + locale.colours.red + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='purple'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='purple'>" + locale.colours.purple + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='green'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='green'>" + locale.colours.green + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='olive'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='olive'>" + locale.colours.olive + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='navy'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='navy'>" + locale.colours.navy + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='blue'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='blue'>" + locale.colours.blue + "</a></li>" +
                "<li><div class='wysihtml5-colors' data-wysihtml5-command-value='orange'></div><a class='wysihtml5-colors-title' data-wysihtml5-command='foreColor' data-wysihtml5-command-value='orange'>" + locale.colours.orange + "</a></li>" +
              "</ul>" +
            "</li>";
        }
    };

    var templates = function(key, locale, options) {
        return tpl[key](locale, options);
    };


    var Wysihtml5 = function(el, options) {
        this.el = el;
        var toolbarOpts = options || defaultOptions;
        for(var t in toolbarOpts.customTemplates) {
          tpl[t] = toolbarOpts.customTemplates[t];
        }
        this.toolbar = this.createToolbar(el, toolbarOpts);
        this.editor =  this.createEditor(options);

        window.editor = this.editor;

        $('iframe.wysihtml5-sandbox').each(function(i, el){
            $(el.contentWindow).off('focus.wysihtml5').on({
                'focus.wysihtml5' : function(){
                    $('li.dropdown').removeClass('open');
                }
            });
        });
    };

    Wysihtml5.prototype = {

        constructor: Wysihtml5,

        createEditor: function(options) {
            options = options || {};
            
            // Add the toolbar to a clone of the options object so multiple instances
            // of the WYISYWG don't break because "toolbar" is already defined
            options = $.extend(true, {}, options);
            options.toolbar = this.toolbar[0];

            var editor = new wysi.Editor(this.el[0], options);

            if(options && options.events) {
                for(var eventName in options.events) {
                    editor.on(eventName, options.events[eventName]);
                }
            }
            return editor;
        },

        createToolbar: function(el, options) {
            var self = this;
            var toolbar = $("<ul/>", {
                'class' : "wysihtml5-toolbar",
                'style': "display:none"
            });
            var culture = options.locale || defaultOptions.locale || "en";
            for(var key in defaultOptions) {
                var value = false;

                if(options[key] !== undefined) {
                    if(options[key] === true) {
                        value = true;
                    }
                } else {
                    value = defaultOptions[key];
                }

                if(value === true) {
                    toolbar.append(templates(key, locale[culture], options));

                    if (key == 'font-styles') {
                        this.initFontStyles(toolbar);
                    }

                    if(key === "html") {
                        this.initHtml(toolbar);
                    }

                    if(key === "link") {
                        this.initInsertLink(toolbar);
                    }

                    if(key === "paging") {
                        this.initPaging(toolbar);
                    }

                    if(key === "image") {
                        this.initInsertImage(toolbar);
                    }
                    if(key === "fullScreen") {
                        this.initFullScreen(toolbar);
                    }
                    
                }
            }

            if(options.toolbar) {
                for(key in options.toolbar) {
                    toolbar.append(options.toolbar[key]);
                }
            }

            toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
                var target = e.target || e.srcElement;
                var el = $(target);
                self.toolbar.find('.current-font').text(el.html());
            });

            toolbar.find("a[data-wysihtml5-command='foreColor']").click(function(e) {
                var target = e.target || e.srcElement;
                var el = $(target);
                self.toolbar.find('.current-color').text(el.html());
            });

            toolbar.find("a[data-wysihtml5-command='fontSize']").click(function(e) {
                var target = e.target || e.srcElement;
                var el = $(target);
                self.toolbar.find('.current-font-size').text(el.html());
            });

            this.el.before(toolbar);

            return toolbar;
        },

        initFontStyles:function(toolbar){
            toolbar.find('[data-toggle="dropdown"]').dropdown();
        },

        initHtml: function(toolbar) {
            var changeViewSelector = "a[data-wysihtml5-action='change_view']";
            toolbar.find(changeViewSelector).click(function(e) {
                toolbar.find('a.btn').not(changeViewSelector).toggleClass('disabled');
            });
        },

        initFullScreen : function(toolbar) {
            var self = this;
            var changeViewSelector = "a[data-wysihtml5-action='fullScreen']";
            toolbar.find(changeViewSelector).click(function(e) {
                $('body').append('<div class="modal-backdrop fade in"></div>');
                $(self.el).css({
                    width     : '100%',
                    height    : '100%',
                    'z-index' : '1051'
                });
                console.log(self.editor)
                $('.wysihtml5-toolbar').css({
                    position  : 'fixed',
                    top       : '40px',
                    left      : '30px',
                    'z-index' : '1051'
                });
                $('.wysihtml5-sandbox').css({
                    position  : 'fixed',
                    top       : '80px',
                    left      : '30px',
                    width     : '100%',
                    height    : '100%',
                    'z-index' : '1051'
                });
                
            });
            
        },

        initPaging: function(toolbar) {
            var self = this;
            var pagingSelector = "a[data-wysihtml5-action='paging']";
            toolbar.find(pagingSelector).click(function(e) {
                self.editor.composer.commands.exec("createPaging");
            });
        },

        

        initInsertImage: function(toolbar) {
            var self = this;

            var xhrObject;
            var cover         = toolbar.find('.image-upload-cover');
            var progress      = toolbar.find('.image-upload-progress');
            var progressLabel = toolbar.find('.image-upload-progress-label');
            var uploadBtn     = toolbar.find('a[data-wysihtml5-command=insertImage]');
            var cancelBtn     = toolbar.find('.image-cancel');

            var caretBookmark;

            progressLabel.css({top:'26%'});
            cancelBtn.parent().css({top:'28%'});

            var insertImage = function(url) {
                self.editor.currentView.element.focus();
                if (caretBookmark) {
                  self.editor.composer.selection.setBookmark(caretBookmark);
                  caretBookmark = null;
                }
                setTimeout(function(){
                    self.editor.composer.commands.exec("insertImage", {src:url,title:'idealsee[IMG]'});
                },100);
            };
            var hideProgress = function(){
                cover.hide();
                progress.hide();
                progressLabel.hide();
                cancelBtn.parent().hide();
            };
            var showProgress = function() {
                cover.show();
                progress.show();
                progressLabel.show();
                cancelBtn.parent().show();
                progressLabel.text('0%');
                progress.find('.progress-bar').css({'width':'0px'});
            };
            var cancelBtnClick = function(e){
                hideProgress();
                if (xhrObject) {
                    try{
                        xhrObject.abort();
                    } catch(ex){
                        
                    }
                };
                return false;
            };
            cancelBtn.on('click',cancelBtnClick);
            uploadBtn.click(function() {
                var $form          = $('<form action="/web/comupload"  method="post">').appendTo("body"),
                    $input         = $("<input type='file' name='file' accept='image/*'>").hide().appendTo($form),
                    $hidden        = $("<input type='hidden' name='not_need_narrow' value='1'>").hide().appendTo($form);
                
                $form.attr('enctype',"multipart/form-data");
                var activeButton = $(this).hasClass("wysihtml5-command-active");

                if (!activeButton) {
                    self.editor.currentView.element.focus(false);
                    caretBookmark = self.editor.composer.selection.getBookmark();

                    $input.trigger("click");
                    $input.on("change",function(){
                        $form.trigger("submit");
                    }); 
                    $form.on("submit",function(){
                        showProgress();
                        var options = { 
                            beforeSend:function(xhr, o){
                                xhrObject = xhr;
                            }, 
                            success:function(responseText,statusText,xhr){
                                insertImage(responseText.medium_image_src)
                                hideProgress();
                                $form.remove();
                            },
                            error:function(responseText,statusText,xhr){
                                is.error("上传文件错误!");
                                hideProgress();
                                $form.remove();
                            },
                            uploadProgress : function(e,position, total, percent){
                                progress.find('.progress-bar').css({'width':percent + '%'});
                                progressLabel.text(percent + '%');
                            },
                        };
                        $form.ajaxSubmit(options);
                        return false;
                    });
                    return false;
                }
                else {
                    return true;
                }
            });
        },

        initInsertLink: function(toolbar) {
            var self = this;
            var insertLinkModal = toolbar.find('.bootstrap-wysihtml5-insert-link-modal');
            var urlInput = insertLinkModal.find('.bootstrap-wysihtml5-insert-link-url');
            var insertButton = insertLinkModal.find('a.btn-primary');
            var initialValue = urlInput.val();
            var caretBookmark;

            var insertLink = function() {
                var url = urlInput.val();
                urlInput.val(initialValue);
                self.editor.currentView.element.focus();
                if (caretBookmark) {
                  self.editor.composer.selection.setBookmark(caretBookmark);
                  caretBookmark = null;
                }
                self.editor.composer.commands.exec("createLink", {
                    href: url,
                    target: "_blank",
                    rel: "nofollow"
                });
            };
            var pressedEnter = false;

            urlInput.keypress(function(e) {
                if(e.which == 13) {
                    insertLink();
                    insertLinkModal.modal('hide');
                }
            });

            insertButton.click(insertLink);

            insertLinkModal.on('shown', function() {
                urlInput.focus();
            });

            insertLinkModal.on('hide', function() {
                self.editor.currentView.element.focus();
            });

            toolbar.find('a[data-wysihtml5-command=createLink]').click(function() {
                var activeButton = $(this).hasClass("wysihtml5-command-active");

                if (!activeButton) {
                    self.editor.currentView.element.focus(false);
                    caretBookmark = self.editor.composer.selection.getBookmark();
                    insertLinkModal.appendTo('body').modal('show');
                    insertLinkModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
                        e.stopPropagation();
                    });
                    return false;
                }
                else {
                    return true;
                }
            });
        }
    };

    // these define our public api
    var methods = {
        resetDefaults: function() {
            $.fn.wysihtml5.defaultOptions = $.extend(true, {}, $.fn.wysihtml5.defaultOptionsCache);
        },
        bypassDefaults: function(options) {
            return this.each(function () {
                var $this = $(this);
                $this.data('wysihtml5', new Wysihtml5($this, options));
            });
        },
        shallowExtend: function (options) {
            var settings = $.extend({}, $.fn.wysihtml5.defaultOptions, options || {});
            var that = this;
            return methods.bypassDefaults.apply(that, [settings]);
        },
        deepExtend: function(options) {
            var settings = $.extend(true, {}, $.fn.wysihtml5.defaultOptions, options || {});
            var that = this;
            return methods.bypassDefaults.apply(that, [settings]);
        },
        init: function(options) {
            var that = this;
            return methods.shallowExtend.apply(that, [options]);
        }
    };

    $.fn.wysihtml5 = function ( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.wysihtml5' );
        }    
    };

    $.fn.wysihtml5.Constructor = Wysihtml5;

    var defaultOptions = $.fn.wysihtml5.defaultOptions = {
        "font-styles": true,
        "fontSize" : false,
        "color": false,
        "emphasis": false,
        "lists": false,
        "html": false,
        "link": false,
        "image": true,
        "paging":false,
        "fullScreen":true,
        events: {},
        parserRules: {
            classes: {
                // (path_to_project/lib/css/wysiwyg-color.css)
                "wysiwyg-color-silver" : 1,
                "wysiwyg-color-gray" : 1,
                "wysiwyg-color-white" : 1,
                "wysiwyg-color-maroon" : 1,
                "wysiwyg-color-red" : 1,
                "wysiwyg-color-purple" : 1,
                "wysiwyg-color-fuchsia" : 1,
                "wysiwyg-color-green" : 1,
                "wysiwyg-color-lime" : 1,
                "wysiwyg-color-olive" : 1,
                "wysiwyg-color-yellow" : 1,
                "wysiwyg-color-navy" : 1,
                "wysiwyg-color-blue" : 1,
                "wysiwyg-color-teal" : 1,
                "wysiwyg-color-aqua" : 1,
                "wysiwyg-color-orange" : 1
            },
            tags: {
                "b":  {},
                "i":  {},
                "br": {},
                "ol": {},
                "ul": {},
                "li": {},
                "h1": {},
                "h2": {},
                "h3": {},
                "blockquote": {},
                "u": 1,
                "img": {
                    "check_attributes": {
                        "width": "numbers",
                        "alt": "alt",
                        "src": "url",
                        "height": "numbers"
                    }
                },
                "a":  {
                    set_attributes: {
                        target: "_blank",
                        rel:    "nofollow"
                    },
                    check_attributes: {
                        href:   "url" // important to avoid XSS
                    }
                },
                "span": 1,
                "div": 1,
                // to allow save and edit files with code tag hacks
                "code": 1,
                "pre": 1
            }
        },
        locale: "en"
    };

    if (typeof $.fn.wysihtml5.defaultOptionsCache === 'undefined') {
        $.fn.wysihtml5.defaultOptionsCache = $.extend(true, {}, $.fn.wysihtml5.defaultOptions);
    }

    var locale = $.fn.wysihtml5.locale = {
        en: {
            font_styles: {
                normal: "Normal text",
                h1: "Heading 1",
                h2: "Heading 2",
                h3: "Heading 3"
            },
            emphasis: {
                bold: "Bold",
                italic: "Italic",
                underline: "Underline"
            },
            lists: {
                unordered: "Unordered list",
                ordered: "Ordered list",
                outdent: "Outdent",
                indent: "Indent"
            },
            link: {
                insert: "Insert link",
                cancel: "Cancel"
            },
            image: {
                insert: "Insert image",
                cancel: "Cancel"
            },
            html: {
                edit: "Edit HTML"
            },
            paging: {
                edit: "Paging"
            },
            colours: {
                black: "Black",
                silver: "Silver",
                gray: "Grey",
                maroon: "Maroon",
                red: "Red",
                purple: "Purple",
                green: "Green",
                olive: "Olive",
                navy: "Navy",
                blue: "Blue",
                orange: "Orange"
            }
        }
    };

}(window.jQuery, window.wysihtml5);

function Color(color, opacity, apply)
{
    var dialog = this;
    
    var input = document.createElement('input');
    $(input).css({
        'margin-bottom': '10px',
        'margin-left'  : '23px',
        'width'        : '170px'
    });
    
    // Required for picker to render in IE
    if (mxClient.IS_IE)
    {
        input.style.marginTop = '10px';
        document.body.appendChild(input);
    }

    var picker = new jscolor.color(input);
    picker.pickerOnfocus = false;
    // picker.showPicker();

    var div = document.createElement('div');
    // jscolor.picker.box.style.position = 'relative';
    // jscolor.picker.box.style.width = '230px';
    // jscolor.picker.box.style.height = '100px';
    // jscolor.picker.box.style.paddingBottom = '10px';
    // div.appendChild(jscolor.picker.box);

    var center = document.createElement('center');
    
    function addPresets(presets, rowLength)
    {
        rowLength = (rowLength != null) ? rowLength : 10;
        var table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.setAttribute('cellspacing', '0');
        table.style.marginBottom = '20px';
        table.style.cellSpacing = '0px';
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);

        var rows = presets.length / rowLength;
        
        for (var row = 0; row < rows; row++)
        {
            var tr = document.createElement('tr');
            
            for (var i = 0; i < rowLength; i++)
            {
                (function(clr)
                {
                    var td = document.createElement('td');
                    td.style.border = '1px solid black';
                    td.style.padding = '0px';
                    td.style.width = '16px';
                    td.style.height = '16px';
                    
                    if (clr == 'none')
                    {
                        td.style.background = 'url(\'' + IMAGE_PATH + '/nocolor.png' + '\')';
                    }
                    else
                    {
                        td.style.backgroundColor = '#' + clr;
                    }
                    
                    tr.appendChild(td);
                    
                    mxEvent.addListener(td, 'click', function()
                    {
                        if (clr == 'none')
                        {
                            picker.fromString('ffffff');
                            input.value = 'none';
                        }
                        else
                        {
                            picker.fromString(clr);
                        }
                    });
                })(presets[row * rowLength + i]);
            }
            
            tbody.appendChild(tr);
        }
        
        center.appendChild(table);
        
        return table;
    };

    div.appendChild(input);
    mxUtils.br(div);
    
    // Adds presets
    var table = addPresets([
        'none', '000000', 'EEECE1', '1F497D', '4F81BD', 'C0504D', '9BBB59', '8064A2', '4BACC6', 'F79646'
    ]);
    table.style.marginBottom = '8px';
    table = addPresets([
        'F2F2F2', '7F7F7F', 'DDD9C3', 'C6D9F0', 'DBE5F1', 'F2DCDB', 'EBF1DD', 'E5E0EC', 'DBEEF3', 'FDEADA', 
        'D8D8D8', '595959', 'C4BD97', '8DB3E2', 'B8CCE4', 'E5B9B7', 'D7E3BD', 'CCC1D9', 'B7DDE8', 'FBD5B5', 
        'BFBFBF', '3F3F3F', '938953', '548DD4', '95B3D7', 'D99694', 'C3D69B', 'B4A4C9', '92CDDC', 'FAC08F', 
        'A5A5A5', '262626', '494429', '17365D', '366092', '953734', '76933C', '5F497A', '31859B', 'E36C09', 
        '7F7F7F', '0C0C0C', '1D1B10', '081C37', '1C395C', '5E1C1B', '4F6128', '3F3151', '205867', '974806', 
    ]);
    table.style.marginBottom = '8px';

    table = addPresets([
        'C00000', 'FF0000', 'FFC000', 'FFF000', '92D050', '00B050', '00B0F0', '0070C0', '002060', '7030A0', 
    ]);
    table.style.marginBottom = '8px';

    div.appendChild(center);

    var addOptions = function(selectEl){
        for ( var i = 100;i >= 0; i-- ) {
            var option   = document.createElement('option');
            option.value = i;
            option.text  = i;
            selectEl.appendChild(option);
        }
    }

    var opacity       = document.createElement('div');
    var opacityLable  = document.createElement('span');
    var opacitySelect = document.createElement('select');
    var opacityUnit   = document.createElement('span');

    opacityLable.innerHTML     = '透明度：';
    opacitySelect.className    = 'input-mini';
    opacityUnit.innerHTML      = '%';
    opacity.style.marginBottom = '10px';
    opacity.style.width        = '216px';

    addOptions(opacitySelect);

    mxEvent.addListener(opacitySelect, 'change', function()
    {
        console.log(this.value);
    });
    opacity.appendChild(opacityLable);
    opacity.appendChild(opacitySelect);
    opacity.appendChild(opacityUnit);

    div.appendChild(opacity);

    var buttons = document.createElement('div');
    buttons.style.textAlign = 'right';
    buttons.style.whiteSpace = 'nowrap';
    
    var applyFunction = (apply != null) ? apply : this.createApplyFunction();

    var applyButton = mxUtils.button(mxResources.get('apply'), function()
    {
        console.log(this)
        var color   = input.value;
        var opacity = opacitySelect.value;
        
        if (color != 'none')
        {
            color = '#' + color;
        }
        
        applyFunction('color',color);
        applyFunction('opacity',opacity);
        editorUi.hideDialog();
        $(dialog.sourceEl).parent().css({'border-style':'solid','border-width': '1px'});
        return false;
    });
    applyButton.className = 'btn btn-primary';
    buttons.appendChild(applyButton);
    var cancelButton = mxUtils.button(mxResources.get('cancel'), function()
    {
        editorUi.hideDialog();
        $(dialog.sourceEl).parent().css({'border-style':'solid','border-width': '1px'});
        return false;
    });
    $(cancelButton).addClass('btn').css({
        'margin-left' : '10px'
    });
    buttons.appendChild(cancelButton);
    
    if (color != null)
    {
        if (color == 'none')
        {
            picker.fromString('ffffff');
            input.value = 'none';
        }
        else
        {
            picker.fromString(color);
        }
    }
    
    div.appendChild(buttons);

    this.picker        = picker;
    this.colorInput    = input;
    this.opacitySelect = opacitySelect;
    this.container     = div;
};
