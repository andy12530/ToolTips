function ToolTip(config) {
	this.config = {
		$btn: $("input"),
		placement: 'bottom',
		className: 'tool-tip',
		content: "",
		type: 'click',
		width: 0,
		offset: {
			top: 0,
			left: 0
		}
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
		setting.$btn.toggle(function(e) {
			e.preventDefault();
			self.show($(this));
		}, function(e) {
			e.preventDefault();
			self.hide();
		});
	} else if (setting.type === 'hover') {
		var timer = null;

		setting.$btn
			.on('mouseenter', function() {
				clearTimeout(timer);
				timer = setTimeout(function() {
					self.show($(this));
				}, 50);
			})
			.on('mouseleave', function() {
				timer = setTimeout(function() {
					self.hide();
				}, 50);
			});

		this.$toolTipEl
			.on('mouseenter', function() {
				clearTimeout(timer);
			})
			.on('mouseleave', function() {
				timer = setTimeout(function() {
					self.hide();
				}, 50);
			});
	}
};

ToolTip.prototype.createDom = function() {
	var setting = this.config, style = "";
	if (setting.width > 0) {
		style = 'style="width: '+ setting.width +'px;"';
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

	this.$toolTipEl.show();
	this.trigger("show");
};

ToolTip.prototype.hide = function() {
	this.$toolTipEl.fadeOut(80);
	this.trigger("hide");
};

ToolTip.prototype.setContent = function(content) {
	var setting = this.config;
	setting.content = content;

	if (this.shown) {
		this.$toolTipEl.find('.' + setting.className +'-content').hmtl(content);
	}
};