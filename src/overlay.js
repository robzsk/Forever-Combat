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
	var sc = $('<div>')
		.css({
			position: 'absolute',
			fontSize: '50px',
			top: '20px',
			color: 'white',
			width: '100%',
			opacity: '0.5'
		});
	$(document.body).append(sc);
	return function () {
		return sc;
	};

}();

var div = function () {
	return $('<div>')
		.css({
			width: '50%',
			float: 'left'
		});
};

var $a = function () {
	var el = $('<div>');
	el.css({
		backgroundColor: 'blue',
		textAlign: 'right',
		float: 'right',
		width: '150px',
		paddingRight: '15px',
		margin: '5px',
		border: 'solid white 4px',
		borderRadius: '10px'
	});

	score().append(div().append(el));
	return el;
}();

var $b = function () {
	var el = $('<div>');
	el.css({
		backgroundColor: 'red',
		width: '150px',
		paddingLeft: '15px',
		margin: '5px',
		border: 'solid white 4px',
		borderRadius: '10px'
	});

	score().append(div().append(el));
	return el;
}();

module.exports = {
	update: function (a, b) {
		$a.text(a);
		$b.text(b);
	}
};
