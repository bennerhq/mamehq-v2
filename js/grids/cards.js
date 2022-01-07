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

class Cards extends Grid {

	constructor(config) {
		super(config);

		this.config.gridID = "#cards";
		this.config.classOne = "card-one";

		this.cards = null;
		this.sections = {};
	}

	length() {
		return this.cards.length;
	}

	set(cards) {
		this.cards = cards;

		super.setCurrent(0);
		super.show();
	}

	clearHTML(idx) {
		if (!idx || idx === -1) {
			idx = this.current;
		}

		var id = this.getID(idx);
		$(id).html("");

		this.setCurrent(idx);
	}

	showHTML(idx, on, focus) {
		var html = "";

		var card = this.cards[idx];
		if (card) {
			html += card.showHTML(on, focus);
		}

		return html;
	}

	selected() {
		this.clearHTML();
		super.selected();
	}

	activate() {
		var card = this.cards[this.current];

		games.toggleFavorit(card.name);

		this.clearHTML();
	}

	placeSection(section) {
		var newPos = this.sections[section];
		if (newPos >= 0) {
			super.setCurrent(newPos);
		}
	}

	getCard(idx) {
		if (!idx || idx === -1) {
			idx = this.getCurrent();
		}
		return this.cards[idx];
	}
};
