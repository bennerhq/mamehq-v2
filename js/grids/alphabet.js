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

class Alphabet extends Grid {

	constructor(config) {
		super(config);

		this.config.letters = config.letters || "#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}

	length() {
		return this.config.letters.length;
	}

	getPreHTML(idx) {
		var html = "";

		if (!this.newLines) {
			this.newLines = [];

			do {
				var idx = this.config.letters.indexOf("_");
				if (idx === -1) break;
	
				this.newLines.push(idx);
				this.config.letters = this.config.letters.replace("_", "");
			}
			while (true);
		}

		if (this.newLines.indexOf(idx) !== -1) {
			html += "<br>";
		}

		return html;
	}

	getHTML(idx, on, focus) {
		var letter = this.config.letters[idx];

		if (letter && (this.config.iconWidth || this.config.iconHeight)) {
			letter = resources.buttonId({
				id: letter,
				on: on,
				focus: focus,
				width: this.config.iconWidth,
				height: this.config.iconHeight,
			});
		}

		return letter;
	}

	getLetter(idx) {
		if (idx === undefined) {
			idx = this.current;
		}

		return this.config.letters[idx];
	}

	setCurrent(idx) {
		if (isString(idx)) {
			idx = this.config.letters.indexOf(idx);
		}

		if (idx !== -1) {
			super.setCurrent(idx);
		}
	}
};
