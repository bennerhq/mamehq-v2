/*** -------------------------------------------------------------------------
 * Main controller handler!
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

class Shutdown extends Alphabet {

	constructor(config) {
		super(config);

		this.config.gridID = "#shutdown-grid";
		this.config.classOne = "shutdown-one";

		this.config.letters = ["ok", "no", "terminal"];
		this.config.iconWidth = 27;

		this.config.onShutdown = this.config.onShutdown || function() { return false; };
		this.config.onCancel = this.config.onCancel || function() { return false; };
	}

	show() {
		super.show();

		$("#shutdown-fullscreen").fadeIn(200);
		$("#shutdown-dialogue").show();

		animateCss("#shutdown-dialogue", "bounceInDown");

		loza.setHtmlID("shutdown");

		this.setCurrent(1);
	}

	hide() {
		super.hide();

		animateCss("#shutdown-dialogue", "bounceOutUp", () => {
			$("#shutdown-dialogue").hide();
			$("#shutdown-fullscreen").fadeOut(100);
		});
	}
};
