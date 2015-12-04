'use strict';

var _ = require('underscore'),
	THREE = require('three');

var modelFiles = require('./models.js');

var meshConfigs = [
	{ name: 'player-one', file: 'player', texture: 'player-blue' },
	{ name: 'player-two', file: 'player', texture: 'player-red' },
	{ name: 'bullet', file: 'bullet', texture: 'player-blue' }// TODO: use the correct texture here
];

module.exports = function () {
	var mesh = {};

	var Assets = function () {
		this.load = function (onloaded) {
			var loader = new THREE.JSONLoader(), loaded = meshConfigs.length;
			var complete = function () {
				loaded -= 1;
				if (loaded <= 0) {
					onloaded();
				}
			};
			var loadMesh = function (conf) {
				var object = loader.parse(modelFiles[conf.file || conf.name]);
				var material = object.materials || new THREE.MeshBasicMaterial({ color: conf.color });
				// if (material.length >= 1) {
				// 	mesh[conf.name] = new THREE.Mesh(object.geometry, new THREE.MeshFaceMaterial(material));
				// } else {
				// 	mesh[conf.name] = new THREE.Mesh(object.geometry, material);
				// }
				mesh[conf.name] = new THREE.Mesh(object.geometry, new THREE.MeshPhongMaterial(
					{ map: THREE.ImageUtils.loadTexture('assets/textures/' + conf.texture + '.png') }));
				mesh[conf.name].castShadow = true;
				mesh[conf.name].receiveShadow = true;
				complete();
			};
			_.each(meshConfigs, function (c) {
				loadMesh(c);
			});

		};

		this.model = {
			playerOne: function () {
				return mesh['player-one'].clone();
			},
			playerTwo: function () {
				return mesh['player-two'].clone();
			},
			bullet: function () {
				return mesh['bullet'].clone();
			}
		};
	};

	return new Assets();
}();
