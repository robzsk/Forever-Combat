'use strict';

var _ = require('underscore'),
	util = require('util'),
	factory = require('./factory'),
	EventEmitter = require('events').EventEmitter;

var scene = require('./scene');

var World = function () {
	var players = [],
		playerOne = [],
		playerTwo = [];

	var bullets = [],
		bulletOne = [],
		bulletTwo = [];

	var handleFireBullet = function (player, callback) {
		_.each(player, function (row) {
			_.each(row, function (col) {
				_.each(col, function (p) {
					p.on('fire', callback);
				});
			});
		});
	};

	var handleCollision = function (bullet, player) {
		factory.killEntity(bullet);
		factory.killEntity(player);
	};

	EventEmitter.call(this);

	this.update = function (ticks, step) {
		_.each(players, function (row) {
			factory.updateEntity(row, ticks, step);
		});

		_.each(bullets, function (row) {
			factory.updateEntity(row, ticks, step);
		});

		if (factory.checkCollides(bulletOne, playerTwo)) {
			handleCollision(bulletOne, playerTwo);
			this.emit('player-one-score');
		}
		if (factory.checkCollides(bulletTwo, playerOne)) {
			handleCollision(bulletTwo, playerOne);
			this.emit('player-two-score');
		}
	};

	var rot = 0.1;
	this.render = function (dt) {
		rot += 0.5;
		_.each(players, function (row) {
			_.each(row, function (player) {
				_.each(player, function (p) {
					p.avatar.rotation.set(0, -p.rotation().z, p.rotation().z, 'ZYX');
					p.avatar.position.set(p.position().x, p.position().y, 2);

					p.propeller.rotation.set(0, rot, p.rotation().z, 'ZYX');
					p.propeller.position.set(p.position().x, p.position().y, 2);
				});
			});
		});

		_.each(bullets, function (row) {
			_.each(row, function (col) {
				_.each(col, function (bullet) {
					var z = bullet.isAlive() ? 2 : -100;
					bullet.avatar.position.set(bullet.position().x, bullet.position().y, z);
				});
			});
		});

		scene.lookAt({x: 0, y: 0});// TODO: don't need this set it in scene and forget it
		scene.render();
	};

	// TODO: can we make so that players are more generic when created? Allow for more players
	this.addPlayerOne = function (input, spawn, angle) {
		playerOne.push(factory.createPlayerOne(input, spawn, angle * 0.0174533));
		players = players.concat(playerOne);
		handleFireBullet(playerOne, function () {
			factory.spawnBullet(playerOne, bulletOne);// TODO: this is going to call for each playerone should only do it once
		});
		bulletOne.push(factory.createBullet());// TODO: this is a mistake need to assign not push here
		bullets = bullets.concat(bulletOne);
	};

	this.addPlayerTwo = function (input, spawn, angle) {
		playerTwo.push(factory.createPlayerTwo(input, spawn, angle * 0.0174533));
		players = players.concat(playerTwo);
		handleFireBullet(playerTwo, function () {
			factory.spawnBullet(playerTwo, bulletTwo);
		});
		bulletTwo.push(factory.createBullet());
		bullets = bullets.concat(bulletTwo);
	};

};

util.inherits(World, EventEmitter);

module.exports = World;
