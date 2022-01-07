/*** -------------------------------------------------------------------------
 * Main application entry point
 *
 * Author: jens@bennerhq.com, 2019
 */

 /***
 * "THE BEER-WARE LICENSE" (Revision 43):
 * 
 * As long as you retain this notice you can do whatever you want with this 
 * stuff. If we meet some day, and you think this stuff is worth it, you can 
 * buy me a beer in return.
 * Thanks, 
 * Jens Kaas Benner
 * 
 * [https://en.wikipedia.org/wiki/Beerware]
 */

"use strict";

class Application {

	constructor() {
		let self = this;

		let FIXME_WIDTH = 140;

		this.controller = new Controller({
			onEdge: function(dx, dy) {
				if (dx > 0) {
					self.keyboard.setFocusTo(self.cards);

					return true;
				}
			},

			onShutdown: function() {
				self.keyboard.setFocusTo(self.shutdown);
				self.shutdown.show();
			},
	
			onSearch: function() {
				if (self.search.toggleShow()) {
					self.keyboard.setFocusTo(self.search);
				}
			},

			onReady: function() {
				var cards = games.getFavorits(Card.cmpDescriptionInc); //games.getShuffle(SHUFFLE_MAX);
				self.cards.set(cards);

				this.setCurrent("favorits");
			},

			onSelected: function(cards) {
				self.cards.set(cards);
			}
		});

		this.shutdown = new Shutdown({
			onSelected: function(current) {
				var letter = this.getLetter(current);

				switch (letter) {
					case "no":
						// Continue!
						break;

					case "terminal":
						appCmd("quit-now");
						break;

					case "ok":
						self.poweroff();
						break;
				}
				self.keyboard.setFocusTo(self.controller);
				this.hide();
			}
		});

		this.play = new Play({
			onReady: (card) => {
				games.play(card.name, (ok) => {
					self.cards.show();
					setTimeout(() => {
						self.play.hide();
					}, 0.5 * 1000);
				});
			}
		});

		this.cards = new Cards({
			width: window.innerWidth - FIXME_WIDTH,

			onEdge: function(dx, dy) {
				if (dx < 0) {
					self.keyboard.setFocusTo(self.controller);

					return true;
				}
			},
			
			onSelected: () => {
				var card = self.cards.getCard();
				self.play.show(card);
			}
		});

		this.search = new Search({
			onEdge: function(dx, dy) {
				if (dy < 0 && self.cards.length()) {
					self.keyboard.setFocusTo(self.cards);
					this.hide();

					return true;
				}
			},

			onSelected: function(input) {
				input = input.trim();

				var cards = games.search(input);
				self.cards.set(cards);
			}
		});

		let idle_time_interval_min = parseInt(resources.getId("idle_time_interval_min"));
		let idle_time_poweroff_min = parseInt(resources.getId("idle_time_poweroff_min"));
		let shell_cmd_idlecheck = resources.getId("shell_cmd_idlecheck");
		if (idle_time_interval_min && idle_time_poweroff_min && shell_cmd_idlecheck) {
			let counter = 0;
			setInterval(() => {
				counter ++;
				executeShellCommand(shell_cmd_idlecheck, (error, stdout, stderr) => {
					if (counter >= idle_time_poweroff_min) {
						self.poweroff();
					} else {
						resources.playId('audio_waiting');
					}
				});
			}, 1000 * 60 * idle_time_interval_min);
		}

		$( window ).resize(() => {
			self.cards.config.width = window.innerWidth - FIXME_WIDTH;
			self.cards.show();
		});
	}

	poweroff() {
		resources.playId('audio_poweroff');

		loza.setHtmlID("splash-poweroff");

		$("#main-container").fadeOut("fast");

		$("#splash-poweroff-container").fadeIn(2000, () => {
			setTimeout(() => {
				let cmd = resources.getId("shell_cmd_shutdown");
				executeShellCommand(cmd, (error, stdout, stderr) => {
					// ... ?
				});
			}, 4000);
		});
	}

	show() {
		var all = games.getAllCards();
		this.cards.set(all);
		this.cards.show();

		this.controller.show();

		this.keyboard = new Keyboard();
		this.keyboard.setFocusTo(this.controller);

		$("#splash-start-container").fadeOut();
		$("#main-container").fadeIn();

		appCmd("ready-now");
	}
};
