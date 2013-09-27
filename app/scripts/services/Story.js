'use strict';

angular.module('angularAppsApp')
  .factory('Story', function (REST) {
    // Service logic
    // ...
		var story_scenes = [
			{
				// 0
				name: 'Sitting on the Toilet',
				text: [
					'So one day you were sitting on the toilet. You liked sitting on the toilet. It was a nice way to relax. You could sit there, fart up a storm, read some jokes, stare out the window, laugh at the smells, and so forth. Really, it was a hell of a time.',
					'One time, when you were sitting on the toilet, something terrible happened.',
					'Seriously. It was really bad.',
					'A woman screamed. Like she was on fire. Being raped. Being run over. Repeatedly. But you have got a huge dump coming half-way out of you. It is nasty, messy, a little wet. The scream comes again from outside the window. Do you race outside, heedless of the trail of shit that is bound to follow you?'
				],
				choice: [
					{
						key: 'y',
						sceneId: '12'
					},
					{
						key: 'n',
						sceneId: '1'
					},
				],
			},
			{
				// 1
				name: 'Running out the House',
				text: [
					'So you pull up your pants as fast as possible, heedless of the smell coming from your bottom',
					'You come outside, and see a woman staring straight at you, laughter on her face. Her jock boyfriend is laughing at you. Because you have shit running down your leg and over your calf, and into your show. Shit. Shit. Shit.',
					'You feel anger burning inside you. Do you take a punch at the jock?'
				],
				choice: {
					yes: 3,
					no: 2,
				}
			},
			{
				// 2
				name: 'Loser',
				text: [
					'So you just sit there, wimping out. You are such a loser. The End.',
				],
				choice: {
					yes: 0,
					no: 0,
				}
			},
			{
				// 3
				name: 'Winner',
				text: [
					'Good for you. You take action, and no matter what happened, you did not sit there like a passive rock. Good for you. You win.',
				],
				choice: {
					yes: 0,
					no: 0,
				}
			}
		]

    // Public API here
    return {
			getScene: function(number, cb) {
				console.log('Making rest request');
				// return story_scenes[number];
				console.log(number);
				REST.getScene(number, function(result) {
					console.log('Returning scene');
					console.log(result);
					cb(result);
				});
			}
    };
  });
