(function () {
	'use strict';

	var $ = require('jquery'),
		_ = require('underscore'),
		assets = require('./src/assets'),
		loop = require('./src/engine/loop'),
		World = require('./src/world'),
		Input = require('./src/engine/input');

	// world.on('world.player.killed', function (player) {
		//
		// });

	var world = new World();
	var playerOne, playerTwo;

	assets.load(function () {});

	world.addPlayerOne(
		new Input({
			gamepad: { index: 0 },
			buttons: { left: 14, right: 15 },
			keys: { left: 37, right: 39, fire: 38 }
		}), // input
		{ x: 5, y: 5 }, // spawn point
		90 // starting angle
	);

	world.addPlayerTwo(
		new Input({
			keys: { left: 65, right: 68, fire: 83 }
		}),
		{x: -5, y: -5},
		-90
	);

	loop.on('loop.update', function (ticks, step) {
		world.update(ticks, step);
	});

	loop.on('loop.render', function (dt) {
		world.render(dt);
	});
})();
