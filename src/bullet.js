'use strict';
var THREE = require('three'),
	Entity = require('./engine/entity'),
	thrust = require('./engine/thrust');

var MAX_SPEED = 30.0;
var THRUST = new THREE.Vector3(0, 1000.0, 0);
var RADIUS = 0.4;
var points = [
	{ x: 0, y: 0, z: 0, r: RADIUS, rs: RADIUS * RADIUS }
];
var MAX_LIFE = 50;

var Bullet = function () {
	var entity = new Entity(points), life = 0;

	var applyForce = function (torque, force) {
		thrust(force, entity.rotation(), THRUST);
	};

	var applyDamping = function (v, av) {
		if (v.length() > MAX_SPEED) {
			v.normalize();
			v.multiplyScalar(MAX_SPEED);
		}

	};

	this.spawn = function (pos, rotation) {
		life = MAX_LIFE;
		entity.setPosition(pos.x, pos.y);
		entity.setVelocity(0, 0);
		entity.setRotation(rotation);
	};

	this.isAlive = function () {
		return life > 0;
	};

	this.update = function (ticks, dt) {
		life -= 1;
		if (this.isAlive()) {
			entity.update(dt, applyForce, applyDamping);
		}
	};

	this.kill = function () {
		life = -1;
	};

	this.checkCollides = entity.checkCollides;
	this.getPoints = entity.getPoints;
	this.position = entity.position;
	this.velocity = entity.velocity;
	this.setX = entity.setX;
	this.setY = entity.setY;
};

module.exports = Bullet;
