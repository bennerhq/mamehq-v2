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

class Controller extends Alphabet {

	constructor(config) {
		super(config);

		this.config.gridID = "#controller";
		this.config.classOne = "controller-one";

		this.config.letters = [
			"favorits",
			"shuffle",
			"last", 
			"most", 
			"two",
			"good", 
			"bad",
			"search", 
			"shutdown"
		];

		this.actions = {};
		this.actions["favorits"] = {fn: games.getFavorits,     params: [Card.cmpDescriptionInc, Card.cmpMostInc]};
		this.actions["shuffle"]  = {fn: games.getShuffle,      params: [SHUFFLE_MAX]};
		this.actions["last"]     = {fn: games.getLastPlayed,   params: [Card.cmpLastInc, Card.cmpLastDec]};
		this.actions["most"]     = {fn: games.getMostPlayed,   params: [Card.cmpMostInc, Card.cmpMostDec]};
		this.actions["two"]      = {fn: games.getTwoPlayers,   params: [Card.cmpDescriptionInc, Card.cmpMostDec]};
		this.actions["good"]     = {fn: games.getGoodCards,    params: [Card.cmpDescriptionInc, Card.cmpDescriptionDec]};
		this.actions["bad"]      = {fn: games.getBadBoys,      params: [Card.cmpDescriptionInc, Card.cmpDescriptionDec]};

		this.config.onSearch = this.config.onSearch || function() { return false; };

		this.config.iconWidth = 27;

		this.lastCurrent = null;
		this.sortCurrent = -1;
	}

	selected(current) {
		var letter = this.getLetter(current);
		switch (letter) {
		case "search":
			this.config.onSearch();
			break;

		case "shutdown":
			this.config.onShutdown();
			break;

		default:
			var action = this.actions[letter];
			if (action) {
				if (this.lastCurrent !== current) {
					this.lastCurrent = current;
					this.sortCurrent = -1;
				}

				this.sortCurrent ++;
				if (this.sortCurrent >= action.params.length) {
					this.sortCurrent = 0;
				}

				var param = action.params[this.sortCurrent];
				var cards = action.fn.call(games, param);
				super.selected(cards);
			}
		}
	}

	show() {
		super.show();

		animateCss(this.config.gridID, "bounceInDown");
	}
};
