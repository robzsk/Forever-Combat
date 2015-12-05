'use strict';
var THREE = require('three'),
	thrust = require('./engine/thrust'),
	Entity = require('./engine/entity'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var MAX_SPEED = 10.0,
	MAX_ANGULAR_SPEED = 3.0,
	TORQUE = 50.0, DEATH_ROTATION = 0.2,
	TRUST = new THREE.Vector3(0, 50.0, 0);

var DEATH_TIME = 150;

var RADIUS = 0.6;
var points = [
	{ x: 0, y: 0, z: 0, r: RADIUS, rs: RADIUS * RADIUS }
];

var Player = function () {
	var entity = new Entity(points),
		dead = false, deathTimer = 0,
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

	var rotateDead = function () {
		entity.setRotationZ(entity.rotation().z + DEATH_ROTATION);
	};

	var handleInput = function (m) {
		keys.left = m.left;
		keys.right = m.right;
		keys.fire = m.fire;
	};

	util.inherits(Player, EventEmitter);

	this.update = function (ticks, dt) {
		if (!dead) {
			input.update(ticks);
			if (keys.fire) {
				this.emit('fire');
			}
			entity.update(dt, applyForce, applyDamping);
		} else {
			rotateDead();
			deathTimer -= 1;
			if (deathTimer < 0) {
				dead = false;
			}
		}
	};

	this.isAlive = function () {
		return !dead;
	};

	this.kill = function () {
		dead = true;
		deathTimer = DEATH_TIME;
		entity.setVelocity(0, 0);
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
	this.checkCollides = entity.checkCollides;
	this.setX = entity.setX;
	this.setY = entity.setY;

};
util.inherits(Player, EventEmitter);

module.exports = Player;
