/*** -------------------------------------------------------------------------
 * Display Grid handler
 *
 * Author: jens@bennerhq.com, 2019
 */

/***
 * "THE BEER-WARE LICENSE" (Revision 43):
 * 
 * As long as you retain this notice you can do whatever you want with this 
 * stuff. If we meet some day, and you think this stuff is worth it, you can 
 * buy me a beer in return.
 * 
 * Thanks, 
 * Jens Kaas Benner
 * 
 * [https://en.wikipedia.org/wiki/Beerware]
 */

 "use strict";

class Keyboard {

	constructor(config) {
		var self = this;

		this.config = config || {};

		this.config.keyUp = resources.getId("keyUp").split(" ");
		this.config.keyDown = resources.getId("keyDown").split(" ");
		this.config.keyLeft = resources.getId("keyLeft").split(" ");
		this.config.keyRight = resources.getId("keyRight").split(" ");
		this.config.keySelect = resources.getId("keySelect").split(" ");
		this.config.keyActivate = resources.getId("keyActivate").split(" ");
		this.config.keyOnePlayer = resources.getId("keyOnePlayer").split(" ");
		this.config.keyTwoPlayer = resources.getId("keyTwoPlayer").split(" ");

		this.config.onChange = this.config.onChange || function() {};

		this.theGrid = null;

		document.addEventListener('keydown', function(event) {
			idleTimer = new Date();

			self.keydown(event);
		});

		// Install kill switch!...
		$("body").click((event) => {
			appCmd("quit-now");
		});
	}

	setFocusTo(focus) {
		if (this.theGrid) {
			this.theGrid.setFocus(false);
		}

		this.theGrid = focus;
		if (this.theGrid) {
			this.theGrid.setFocus(true);
		}
	}

	keydown(event) {
		event.preventDefault();

		if (!this.theGrid) {
			return;
		}

		var taken = null;

		if (this.config.keyUp.indexOf(event.code) !== -1) {
			taken = this.theGrid.moveY(-1);
		}

		if (this.config.keyDown.indexOf(event.code) !== -1) {
			taken = this.theGrid.moveY(+1);
		}

		if (this.config.keyRight.indexOf(event.code) !== -1) {
			taken = this.theGrid.moveX(+1);
		}

		if (this.config.keyLeft.indexOf(event.code) !== -1) {
			taken = this.theGrid.moveX(-1);
		}

		if (this.config.keySelect.indexOf(event.code) !== -1) {
			var current = this.theGrid.getCurrent();
			taken = this.theGrid.selected(current);
		}

		if (this.config.keyActivate.indexOf(event.code) !== -1) {
			taken = this.theGrid.activate(current);
		}

		if (this.config.keyOnePlayer.indexOf(event.code) !== -1) {
			taken = this.theGrid.onePlayer(current);
		}

		if (this.config.keyTwoPlayer.indexOf(event.code) !== -1) {
			taken = this.theGrid.twoPlayer(current);
		}

		if (taken) {
			var current = this.theGrid.getCurrent();
			this.config.onChange(current);
		}
	}
};
