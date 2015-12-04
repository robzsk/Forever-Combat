'use strict';
var THREE = require('three'),
	thrust = require('./engine/thrust'),
	Entity = require('./engine/entity'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var MAX_SPEED = 10.0,
	MAX_ANGULAR_SPEED = 3.0,
	TORQUE = 50.0,
	TRUST = new THREE.Vector3(0, 50.0, 0);

var RADIUS = 0.8;
var points = [
	{ x: 0, y: 0, z: 0, r: RADIUS, rs: RADIUS * RADIUS }
];

var Player = function () {
	var entity = new Entity(points),
		dead = false,
		input;

	var keys = {
		left: false, right: false, fire: false,
		reset: function () {
			this.left = this.right = this.fire = false;
		}
	};

	var applyForce = function (torque, force) {
		if (keys.left) {
			torque.z += TORQUE;
		} else if (keys.right) {
			torque.z -= TORQUE;
		}
		thrust(force, entity.rotation(), TRUST);
	};

	var applyDamping = function (v, av) {
		av.z = av.z < 0 ? Math.max(av.z, -MAX_ANGULAR_SPEED) : Math.min(av.z, MAX_ANGULAR_SPEED);
		if (!keys.left && !keys.right) {
			av.z *= 0.9;
		}
		if (v.length() > MAX_SPEED) {
			v.normalize();
			v.multiplyScalar(MAX_SPEED);
		}

	};

	var handleInput = function (m) {
		keys.left = m.left;
		keys.right = m.right;
		keys.fire = m.fire;
	};

	util.inherits(Player, EventEmitter);

	this.update = function (ticks, dt) {
		if (!dead) {
			if (keys.fire) {
				this.emit('fire');
			}
			input.update(ticks);
			entity.update(dt, applyForce, applyDamping);
		}
	};

	this.isDead = function () {
		return dead;
	};

	this.kill = function () {
		dead = true;
		input.removeListener('input.move', handleInput);
	};

	this.set = function (conf) {
		dead = false;
		keys.reset();
		input = conf.input;
		// TODO: probably should do this somwhere else
		// input.removeAllListeners('input.move'); // there can be only one
		input.on('input.move', handleInput);
		entity.reset(conf.spawn.x, conf.spawn.y);
		entity.setRotationZ(conf.angle);
	};

	this.position = entity.position;
	this.velocity = entity.velocity;
	this.rotation = entity.rotation;
	this.setRotationZ = entity.setRotationZ;
	this.getPoints = entity.getPoints;
	this.handleCollision = entity.handleCollision;
	this.setX = entity.setX;
	this.setY = entity.setY;

};
util.inherits(Player, EventEmitter);

module.exports = Player;
