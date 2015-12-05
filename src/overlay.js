'use strict';

(function () {
	var fullScreenApi = {
			supportsFullScreen: false,
			isFullScreen: function () { return false; },
			requestFullScreen: function () {},
			cancelFullScreen: function () {},
			fullScreenEventName: '',
			prefix: ''
		},
		browserPrefixes = 'webkit moz o ms khtml'.split(' ');

	// check for native support
	if (typeof document.cancelFullScreen != 'undefined') {
		fullScreenApi.supportsFullScreen = true;
	} else {
		// check for fullscreen support by vendor prefix
		for (var i = 0, il = browserPrefixes.length; i < il; i++) {
			fullScreenApi.prefix = browserPrefixes[i];

			if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined') {
				fullScreenApi.supportsFullScreen = true;

				break;
			}
		}
	}

	// update methods to do something useful
	if (fullScreenApi.supportsFullScreen) {
		fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';

		fullScreenApi.isFullScreen = function () {
			switch (this.prefix) {
				case '':
					return document.fullScreen;
				case 'webkit':
					return document.webkitIsFullScreen;
				default:
					return document[this.prefix + 'FullScreen'];
			}
		};
		fullScreenApi.requestFullScreen = function (el) {
			return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
		};
		fullScreenApi.cancelFullScreen = function (el) {
			return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
		};
	}

	// jQuery plugin
	if (typeof jQuery != 'undefined') {
		jQuery.fn.requestFullScreen = function () {
			return this.each(function () {
				var el = jQuery(this);
				if (fullScreenApi.supportsFullScreen) {
					fullScreenApi.requestFullScreen(el);
				}
			});
		};
	}

	// export api
	window.fullScreenApi = fullScreenApi;
})();

var $ = require('jquery');

var fullscreen = function () {
	var $full = $('<div>')
		.css({
			position: 'absolute',
			bottom: '50px',
			right: '50px'
		})
		.text('full screen');
	$(document.body).append($full);
	$full.on('click', function () {
		window.fullScreenApi.requestFullScreen(document.body);
	});
}();

var score = function () {
	var ret = $('<div>')
		.css({
			position: 'absolute',
			fontSize: '70px'
		});

	return ret;
};

var $a = function () {
	var el = score();
	el.css({
		top: '20px',
		left: '20px',
		color: '#0000ff',
		textShadow: '-5px 5px 0 #fff'
	});
	$(document.body).append(el);
	return el;
}();

var $b = function () {
	var el = score();
	el.css({
		top: '20px',
		left: '20px',
		color: '#ff0000',
		textShadow: '5px 5px 0 #fff'
	});
	$(document.body).append(el);
	return el;
}();

var MID = window.innerWidth / 2;

var setPosition = function () {
	$a.css({
		left: (MID - 40) + 'px'
	});

	$b.css({
		left: (MID + 40) + 'px'
	});
};

$(window).on('resize', function () {
	MID = window.innerWidth / 2;
	setPosition();
});

module.exports = {
	update: function (a, b) {
		$a.text(a);
		$b.text(b);
		setPosition();
	}
};
