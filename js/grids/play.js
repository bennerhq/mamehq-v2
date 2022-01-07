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

class Play extends Alphabet {

	constructor(config) {
		super(config);
	}

	imageSnapper(id, url, def) {
		const img = new Image();
		img.src = url;
		var snap = img.src;
		if (!img.complete) {
			snap = def;
			if (!def) {
				$(id).hide();
			}

			img.onload = function() {
				$(id).show().attr("src", this.src);
			};
		}

		$(id).attr("src", snap);
	}

	show(card) {
		var self = this;

		resources.playId('audio_play');
		
		$("#play-fullscreen").fadeIn(200);
		$("#play-dialogue").show();

		var url = resources.getId("marquees", {"{name}": card.name});
		this.imageSnapper("#play-image-marquees", url);

		var url = resources.getId("snap", {"{name}": card.name});
		this.imageSnapper("#play-image-name", url, resources.getId("url_image_arcade_icon", "svg-base64"));

		animateCss("#play-dialogue", "bounceInDown", function() {
			self.config.onReady.call(self, card);
		});
	}

	hide() {
		if ($("#play-fullscreen").is(":hidden")) {
			return;
		}

		super.hide();

		animateCss("#play-dialogue", "bounceOutUp", () => {
			$("#play-fullscreen").fadeOut(100);
			$("#play-dialogue").hide();
		});
	}
};
