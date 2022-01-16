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

/*** ---------------------------------------------------------------------- */

var KeyboardMonitor = {
	playerOneKeyCounter: 0,
	playerTwoKeyCounter: 0,

	isTwoPlayer: () => {
		return
			KeyboardMonitor.playerOneKeyCounter > KEY_PLAYER_COUNTER && 
			KeyboardMonitor.playerTwoKeyCounter > KEY_PLAYER_COUNTER;
	},

	reset: () => {
		KeyboardMonitor.playerOneKeyCounter = 0;
		KeyboardMonitor.playerTwoKeyCounter = 0;
	},

	initialize: function() {
		if (!isElectron()) {
			return;
		}

		const child_process = require('child_process');
		if (!child_process) return;

		let shell_cmd_key_catch = resources.getId("shell_cmd_key_catch");
		if (!shell_cmd_key_catch) return;

		let oneKeys = resources.getId("keysPlayerOne");
		if (!oneKeys) return;

		let twoKeys = resources.getId("keysPlayerTwo");
		if (!twoKeys) return;

		var child = child_process.spawn(shell_cmd_key_catch, [], {
				encoding: 'utf8',
				shell: true
		});

		child.stdout.setEncoding('utf8');
		child.stdout.on('data', (stdout) => {
			idleTimer = new Date();

			stdout = stdout.toString();

			oneKeys.forEach((item) => {
				if (stdout.indexOf(item) === -1) return;

				KeyboardMonitor.playerOneKeyCounter ++;
			});

			twoKeys.forEach((item) => {
				if (stdout.indexOf(item) === -1) return;

				KeyboardMonitor.playerTwoKeyCounter ++;
			});
		});

		child.stderr.setEncoding('utf8');
		child.stderr.on('data', (data) => {
			console.log('[keyboard] catch stderr...', data);
		});

		child.on('error', (error) => {
			console.log('[keyboard] catch error...', error);
		});

		child.on('close', (code) => {
			console.log('[keyboard] catch close...', code);
		});
	}
};

/*** ---------------------------------------------------------------------- */

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
 
		 KeyboardMonitor.initialize();
 
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
 