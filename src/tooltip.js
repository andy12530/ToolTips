var isIE6 = false;
if (/MSIE 6.0/.test(window.navigator.userAgent)) {   //检测是否为IE6
    isIE6 = true;
}

function ToolTip(config) {
    this.config = {
        $btn: $("input"),
        placement: 'bottom',
        className: 'tool-tip',
        content: "",
        type: 'click',
        width: 0, //最大宽度
        offset: {
            top: 0,
            left: 0
        },
        arrowOffset: 0,
        delay: 0
    };
    $.extend(this.config, config);

    if (!this.config.$container || this.config.$container !== 1) {
        this.config.$container = $('body');
    }

    this.shown = false;
    this.init();
}

ToolTip.prototype.init = function() {
    var self = this, setting = this.config;
    this.$toolTipEl = this.createDom();

    if(setting.type === 'click') {
        setting.$btn.click(function(e) {
            e.preventDefault();
            if (self.shown) {
                self.hide();
            } else {
                self.show($(this));
            }
        });
    } else if (setting.type === 'hover') {
        var hideTimer = null;
        window.tooltip_timer = null;

        setting.$btn
            .on('mouseenter', function() {
                var $btn = $(this);
                clearTimeout(window.tooltip_timer);
                clearTimeout(hideTimer);
                window.tooltip_timer = setTimeout(function() {
                    self.show($btn);
                }, 80 + setting.delay);
            })
            .on('mouseleave', function() {
                clearTimeout(window.tooltip_timer);
                hideTimer = setTimeout(function() {
                    self.hide();
                }, 80);
            });

        this.$toolTipEl
            .on('mouseenter', function() {
                clearTimeout(hideTimer);
            })
            .on('mouseleave', function() {
                hideTimer = setTimeout(function() {
                    self.hide();
                }, 80);
            });
    }
};

ToolTip.prototype.createDom = function() {
    var setting = this.config, style = "";
    if (setting.width > 0) {
        if(isIE6) {
            style = 'style="width: ';
        } else {
            style = 'style="max-width: ';
        }
        style += setting.width +'px;"';
    }
    /*jshint multistr: true */
    var $toolTipEl = $('<div class="'+ setting.className +' ' + setting.className + '-' + setting.placement  + '" '+ style +'>\
                    <span class="arrow"><s></s></span>\
                    <div class="'+ setting.className +'-content">'+ setting.content +'</div>\
                </div>');

    $('body').append($toolTipEl);
    return $toolTipEl;
};

ToolTip.prototype.show = function($btn) {
    var setting = this.config;

    var position = $btn.offset(),
        btnWidth = $btn.outerWidth(),
        btnHeight = $btn.outerHeight(),
        toolTipWidth = this.$toolTipEl.outerWidth(),
        tooltipHeight = this.$toolTipEl.outerHeight();

    var css = {};

    if(setting.placement === 'bottom') {
        css.top = position.top + btnHeight;
        css.left = position.left;
    } else if(setting.placement === 'right') {
        css.top = position.top;
        css.left = position.left + btnWidth;
    } else if(setting.placement === 'left') {
        css.top = position.top;
        css.left = position.left - toolTipWidth - 20;
    } else if(setting.placement === 'top') {
        css.top = position.top - tooltipHeight - 10;
        css.left = position.left;
    }
    css.top += setting.offset.top;
    css.left += setting.offset.left;

    this.$toolTipEl.css(css);

    if(setting.arrowOffset > 0) {
        var arrowCss = {};
        if(setting.placement === 'bottom' || 'top') {
            arrowCss.left = setting.arrowOffset;
        } else {
            arrowCss.top = setting.arrowOffset;
        }
        this.toolTipEl.find('.arrow').css(arrowCss);
    }

    this.$toolTipEl.show();
    this.shown = true;
    this.trigger("show");

};

ToolTip.prototype.hide = function() {
    this.$toolTipEl.fadeOut(80);
    this.shown = false;
    this.trigger("hide");
};

ToolTip.prototype.setContent = function(content) {
    var setting = this.config;
    setting.content = content;

    if (this.shown) {
        this.$toolTipEl.find('.' + setting.className +'-content').hmtl(content);
    }
};