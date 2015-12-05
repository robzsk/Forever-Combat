'use strict';

var $ = require('jquery'),
	_ = require('underscore'),
	THREE = require('three');

var shake = function () {
	var time, MAX = 10, offset = new THREE.Vector2();

	var mag = function () {
		var m = 0.3;
		return function () {
			return Math.random() < 0.5 ? -m : m;
		};
	}();

	var shake = {
		update: function () {
			time -= 1;
			if (time >= 0) {
				offset.set(Math.random() * mag(), Math.random() * mag());
			} else {
				offset.set(0, 0);
			}
		},
		start: function () {
			time = MAX;
		},
		stop: function () {
			time = 0;
			offset.set(0, 0);
		},
		get: function () {
			var ret = new THREE.Vector2(0, 0);
			return function (p) {
				ret.set(p.x + offset.x, p.y + offset.y);
				return ret;
			};
		}()
	};
	return shake;
}();

var windowWidth = window.innerWidth,
	windowHeight = window.innerHeight,
	ZOOM = 1;

module.exports = function () {
	var scene = new THREE.Scene(),
		cam = new THREE.OrthographicCamera(windowWidth * ZOOM / -2, windowWidth * ZOOM / 2, windowHeight * ZOOM / 2, windowHeight * ZOOM / -2, 0.01, 10),
		ambientLight = new THREE.AmbientLight(0xffffff),
		renderer = new THREE.WebGLRenderer({ antialias: true }),
		viewWidth, viewHeight;

	var setSize = function () {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		renderer.setSize(windowWidth, windowHeight);
		viewWidth = windowWidth / cam.zoom;
		viewHeight = windowHeight / cam.zoom;
		cam.left = windowWidth * ZOOM / -2;
		cam.right = windowWidth * ZOOM / 2;
		cam.top = windowHeight * ZOOM / 2;
		cam.bottom = windowHeight * ZOOM / -2;
		cam.near = 0.01;
		cam.far = 10;
		cam.updateProjectionMatrix();
	};

	cam.zoom = 28;
	cam.updateProjectionMatrix();

	scene.add(cam);
	scene.add(ambientLight);

	renderer.setClearColor(0x7EC0EE, 1);

	document.body.appendChild(renderer.domElement);

	setSize();

	$(window).on('resize', function () {
		setSize();
	});

	return {
		getCameraPosition: function () {
			return cam.position;// TODO: return a copy
		},

		render: function () {
			shake.update();
			renderer.render(scene, cam);
		},

		add: function (m) {
			scene.add(m);
		},

		lookAt: function (p) {
			var e;
			return function (p) {
				e = shake.get(p);
				cam.position.set(p.x, p.y, 10);
			};
		}(),

		boom: function () {
			shake.start();
		},

		remove: function (m) {
			scene.remove(m);
		},

		clear: function () {
			var children = _.clone(scene.children);
			_.each(children, function (child) {
				if (child !== ambientLight) {
					scene.remove(child);
				}
			});
			shake.stop();
		},

		getViewWidth: function () {
			return viewWidth;
		},

		getViewHeight: function () {
			return viewHeight;
		}

	};
}();
