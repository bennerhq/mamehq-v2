/*** -------------------------------------------------------------------------
 * Search text input
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

class Search extends Alphabet {

	constructor(config) {
		super(config);

		this.config.ID = "#search-popup";
		this.config.innerClass = "search-popup-inner";

		this.config.inputID = this.config.ID + "-input",
		this.config.gridID = this.config.ID + "-letters",
		this.config.classOne = "search-letters-item",

		this.IS_DELETE = "⌫";
		this.IS_SPACE = "⎵";		

		this.config.letters = 
			this.IS_DELETE + this.IS_SPACE + 
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ#$0123456789";

		this.input = "";
		this.current = this.config.letters.indexOf("A");
	}

	setInput(newInput) {
		this.input = newInput;

		newInput = newInput.trim();
		var show = newInput ? newInput : "&nbsp;";
		$(this.config.inputID).html(show);

		this.config.onSelected.call(this, this.input);
	}

	selected() {
		var newInput = this.input;

		var char = this.config.letters[this.current];

		if (char === this.IS_SPACE) {
			newInput += " ";
		}
		else if (char === this.IS_DELETE) {
			newInput = newInput.substring(0, newInput.length - 1);
		}
		else {
			newInput += char;
		}

		this.setInput(newInput);

		return true;
	}

	show() {
		var self = this;

		var inputID = this.config.inputID.replace("#", "");
		var gridID = this.config.gridID.replace("#", "");
		var input = this.input !== "" ? this.input : "&nbsp;";

		var html = 
			"<div id='" + inputID + "' class='search-input'>" + input + "</div>" +
			"<div id='" + gridID + "' class='search-letters'></div>";

		if (this.config.innerClass) {
			html = "<div class='" + this.config.innerClass + "'>" + html + "</div>";
		}

		var $div = $(this.config.ID);
		$div.html(html).fadeIn();
		setTimeout(function() {
			animateCss(self.config.ID, "slideInUp");
		}, 1);
		
		if (this.input !== "") {
			this.setInput(this.input);
		}

		super.show();
	}

	hide() {
		var self = this;

		animateCss(this.config.ID, "slideOutDown", function() {
			$(self.config.ID).hide();
		});
	}

	toggleShow() {
		var $div = $(this.config.ID);
		if ($div.is(":hidden")) {
			this.show();
			return true;
		}

		this.hide();
		return false;
	}
};
