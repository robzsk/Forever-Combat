'use strict';

var _ = require('underscore'),
	scene = require('./scene'),
	assets = require('./assets'),
	Player = require('./player'),
	Bullet = require('./bullet');

module.exports = function () {
	var width = scene.getWidth(), height = scene.getHeight();

	var createBullet = function () {
		var create = function () {
			var b = new Bullet();
			b.avatar = assets.model.bullet();
			scene.add(b.avatar);
			return b;
		};
		return function () {
			var bullet = [];

			var row = [];
			row.push(create());
			row.push(create());
			bullet.push(row);

			row = [];
			row.push(create());
			row.push(create());
			bullet.push(row);

			return bullet;
		};
	}();

	var createPlayer = function () {
		var create = function (c, model, propeller) {
			var p = new Player();
			p.set(c);
			p.avatar = model();
			p.propeller = propeller();
			scene.add(p.avatar);
			scene.add(p.propeller);
			return p;
		};
		return function (input, spawn, angle, model, propeller) {
			var player = [];

			// create a row
			var row = [];
			row.push(create({input: input, spawn: { x: spawn.x + width, y: spawn.y }, angle: angle}, model, propeller));
			row.push(create({input: input, spawn: { x: spawn.x,  y: spawn.y }, angle: angle}, model, propeller));
			player.push(row);
			// end row

			// another row
			row = [];
			row.push(create({input: input, spawn: { x: spawn.x + width, y: spawn.y + height }, angle: angle}, model, propeller));
			row.push(create({input: input, spawn: { x: spawn.x,  y: spawn.y + height }, angle: angle}, model, propeller));
			player.push(row);
			// end row

			return player;
		};
	}();

	return {
		updateEntity: function (entity, ticks, step) {
			_.each(entity, function (col) {
				_.each(col, function (ent) {
					ent.update(ticks, step);
				});

				// wrap horizontal
				var swap;
				if (col[0].position().x > width && col[0].velocity().x > 0) {
					swap = col[0];
					col[0] = col[1];
					col[1] = swap;
					swap.setX(col[0].position().x - width);
				}
				if (col[1].position().x < -width && col[1].velocity().x < 0) {
					swap = col[1];
					col[1] = col[0];
					col[0] = swap;
					swap.setX(col[1].position().x + width);
				}

			});

			// wrap vertical
			_.each(entity[0], function (col, n) {
				var swap;
				if (entity[1][n].position().y > height && entity[1][n].velocity().y > 0) {
					swap = entity[1][n];
					entity[1][n] = entity[0][n];
					entity[0][n] = swap;
					swap.setY(entity[1][n].position().y - height);
				}
				if (entity[0][n].position().y < -height && entity[0][n].velocity().y < 0) {
					swap = entity[0][n];
					entity[0][n] = entity[1][n];
					entity[1][n] = swap;
					swap.setY(entity[0][n].position().y + height);
				}
			});
		},

		checkCollides: function (a, b) {
			return _.some(a, function (row, z) {
				return _.some(row, function (col, y) {
					return _.some(col, function (ea, x) {
						var eb = b[z][y][x];
						if (!eb.isAlive() || !ea.isAlive()) {
							return false;
						} else {
							return eb.checkCollides(ea);
						}
					});
				});
			});
		},

		spawnBullet: function (player, bullets) {
			_.each(player, function (row, i) {
				_.each(row, function (col, y) {
					_.each(col, function (p, x) {
						var b = bullets[0][y][x];
						if (!b.isAlive()) {
							bullets[0][y][x].spawn(p.position(), p.rotation());
						}
					});
				});
			});
		},

		killEntity: function (entity) {
			_.each(entity, function (row) {
				_.each(row, function (col) {
					_.each(col, function (entity) {
						entity.kill();
					});
				});
			});
		},

		createBullet: function () {
			return createBullet();
		},

		createPlayerOne: function (input, spawn, angle) {
			return createPlayer(input, spawn, angle, assets.model.playerOne, assets.model.propellerOne);
		},

		createPlayerTwo: function (input, spawn, angle) {
			return createPlayer(input, spawn, angle, assets.model.playerTwo, assets.model.propellerTwo);
		}
	};
}();
