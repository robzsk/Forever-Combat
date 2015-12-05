'use strict';

var $ = require('jquery');

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
		textShadow: '-5px 5px 0 #000055'
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
		textShadow: '5px 5px 0 #550000'
	});
	$(document.body).append(el);
	return el;
}();

var MID = window.innerWidth / 2;

module.exports = {
	update: function (a, b) {
		$a.text(a);
		$b.text(b);
		$a.css({
			left: (MID - 40) + 'px'
		});

		$b.css({
			left: (MID + 40) + 'px'
		});
	}
};
