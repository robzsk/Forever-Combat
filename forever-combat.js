(function () {
	'use strict';

	var $ = require('jquery'),
		_ = require('underscore'),
		overlay = require('./src/overlay'),
		assets = require('./src/assets'),
		loop = require('./src/engine/loop'),
		World = require('./src/world'),
		Input = require('./src/engine/input');

	var world = new World();

	var playerOneScore = 0, playerTwoScore = 0;

	var updateScores = function () {
		overlay.update(playerOneScore, playerTwoScore);
	};

	updateScores();

	assets.load(function () {});

	world.on('player-one-score', function () {
		playerOneScore += 1;
		updateScores();
	});

	world.on('player-two-score', function () {
		playerTwoScore += 1;
		updateScores();
	});

	world.addPlayerOne(
		new Input({
			gamepad: { index: 0 },
			buttons: { left: 14, right: 15, fire: 0 },
			keys: { left: 37, right: 39, fire: 38 }
		}), // input
		{ x: 5, y: 5 }, // spawn point
		90 // starting angle
	);

	world.addPlayerTwo(
		new Input({
			gamepad: { index: 1 },
			buttons: { left: 14, right: 15, fire: 0 },
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
