/*** -------------------------------------------------------------------------
 * Grid handler
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

class Grid {

	constructor(config) {
		this.config = config || {};

		this.config.classOne = config.classOne || "grid-one";
		this.config.classNow = config.classNow || "grid-now";
		this.config.classFocus = config.classFocus || "grid-now-focus";

		this.config.onEdge = config.onEdge || function(dx, dy) { return false; };
		this.config.onFocus = config.onFocus || function() { return false; };
		this.config.onReady = config.onReady || function() { return false; };
		this.config.onSelected = config.onSelected || function(current) { return false;  };
		this.config.onActivate = config.onActivate || function(current) {  return false; };
		this.config.onOnePlayer = config.onOnePlayer || function(current) { return false; };
		this.config.onTwoPlayer = config.onTwoPlayer || function(current) { return false; };

		this.focus = false;
		this.current = 0;
		this.magic = null;
	}

	setFocus(hasFocus, current) {
		if (current === undefined) {
			current = this.current;
		}

		this.focus = hasFocus === true;
		this.setCurrent(current);
	}

	hasFocus() {
		return this.focus === true;
	}

	getID(pos, clean) {
		var id = this.config.gridID ;

		if (pos !== undefined) {
			id += "-" + pos;
		}

		if (clean === true) {
			id = id.replace("#", "");
		}

		return id;
	}

	length() {
		return 0;
	}

	getPreHTML(idx, on, focus) {
		return "";
	}

	getPostHTML(idx, on, focus) {
		return "";
	}

	getHTML(idx, on, focus) {
		return "";
	}

	showHTML(idx, on, focus) {
		return "";
	}

	getClass(idx) {
		var html = this.config.classOne;

		if (idx === this.current) {
			if (this.focus) { 
				html += " " + this.config.classFocus;
			}
			else {
				html += " " + this.config.classNow;
			}
		}

		return html;
	}

	show(data) {
		if (this.config.gridID) {
			var html = "";

			var len = this.length();
			for (var i=0; i < len; i++) {
				var id = this.getID(i, true);

				html += 
					this.getPreHTML(i, true, false);

				html +=
					"<div id='" + id + "' class='" + this.getClass(i) + "'>" + 
					this.getHTML(i, true, false) + 
					"</div>";

				html += 
					this.getPostHTML(i);
			}

			var $grid = $(this.config.gridID);
			$grid.html(html);
			if (this.config.width) {
				$grid.width(this.config.width);
			}

			this.setCurrent(this.current);
		}

		this.config.onReady.call(this, data);
	}

	hide() {
	}

	selected(current) {
		if (current === undefined) {
			current = this.current;
		}
		this.config.onSelected.call(this, current);
	}

	activate(current) {
		if (current === undefined) {
			current = this.current;
		}
		this.config.onActivate.call(this, current);
	}

	onePlayer(current) {
		if (current === undefined) {
			current = this.current;
		}
		this.config.onOnePlayer.call(this, current);
	}

	twoPlayer(current) {
		if (current === undefined) {
			current = this.current;
		}
		this.config.onTwoPlayer.call(this, current);
	}

	getCurrent() {
		return this.current;
	}

	markCurrent(focus) {
		var html = this.getHTML(this.current, true, focus);
		if (html === "") {
			html = this.showHTML(this.current, true, focus);
		}

		var id = this.getID(this.current);
		var $div = $(id);
		$div.html(html);

		return $div;
	}

  	setCurrent(current) {
		var self = this;

		if (current < 0 || current >= this.length()) {
			return;
		}

		var $div = this.markCurrent(false);
		$div.removeClass(this.config.classFocus)
		$div.removeClass(this.config.classNow);

		this.current = current;

		var $div = this.markCurrent(self.focus);
		if (this.focus) {
			$div.addClass(this.config.classFocus);
		}
		else {
			$div.addClass(this.config.classNow);
		}

		var id = this.getID(this.current, true);
		var e = document.getElementById(id);
		if (e) {
			e.scrollIntoView({
			// behavior: "smooth", // Chrome browser fuck-up!!!
			block: "nearest",
			inline: "nearest",
			});
		}

		var delta = 100; // ??? FIXME ???
		var begin = Math.max(this.current - delta, 0);
		var end = Math.min(this.current + delta, this.length());
		for (var idx = begin; idx < end; idx++) {
			var id = this.getID(idx);

			var $div = $(id);
			if (!$div.length) continue;

			var html = $div.html();
			if (html !== "") continue;

			html = this.showHTML(idx, true, idx === this.focus);
			if (html === "") continue;

			$div.html(html);
		}
	}

	moveX(dir) {
		var max = this.length();
		var newCurrent = this.current + dir;
		if (newCurrent >= max) {
			newCurrent = 0;
		}
		if (newCurrent < 0) {
			newCurrent = max - 1;
		}

		var id = this.getID(this.current);
		var nowPos = $(id).position();

		var id = this.getID(newCurrent);
		var newPos = $(id).position();
		if (!newPos) {
			return false;
		}

		var newDir = Math.sign(newPos.left - nowPos.left);
		if ((newDir !== dir)  && this.config.onEdge.call(this, dir, 0)) {
			return false;
		}

		this.setCurrent(newCurrent);

		return true;
	}

	moveY(dir) {
		var newCurrent = this.current;

		var id = this.getID(newCurrent);
		var nowPos = $(id).position();
		if (!nowPos) {
			return false;
		}

		var newPos = nowPos;
		var width = $(id).width();

		var max = this.length();
		do {
			newCurrent += dir;
			if (newCurrent < 0) {
				newCurrent = max - 1;
			}
			if (newCurrent >= max) {
				newCurrent = 0;
			}
			if (newCurrent === this.current) {
				return false;
			}

			var id = this.getID(newCurrent);
			newPos = $(id).position();
			if (!newPos) {
				return false;
			}

			var newDir = Math.sign(newPos.top - nowPos.top);
			if ((newDir !== dir) && (nowPos.left === newPos.left) && this.config.onEdge.call(this, 0, dir)) {
				return false;
			}
		}
		while (newPos.top == nowPos.top || Math.abs(newPos.left - nowPos.left) > width);

		this.setCurrent(newCurrent);

		return true;
	}
};
