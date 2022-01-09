/*** -------------------------------------------------------------------------
 * Resource Load Handeling
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

class Resources {

	constructor(json) {
		this.cache = {};

		for (var id in json) {
			var data = json[id];
			this.setId(id, data);
		}
	}

	setId(id, data) {
		if (this.cache[id]) {
			console.warn("*** ERROR: id already exists: " + id);
		}

		var fetch = id.startsWith('url_');

		this.cache[id] = {
			fetch: fetch,
			inspect: true,
			id: id,
			url: null,
			data: data
		}
	}

	getId(id, all) {
		var item = this.cache[id];
		if (!item) {
			return null;
		}

		if (item.inspect) {
			item.inspect = false;

			item.data = this.replaceId(item.data);
		}

		var res;
		if (all == true) {
			res = item;
		}
		else {
			res = item.data;
			if (all === false) {
				// don't do anything!
			}
			else if (all == "svg-base64") {
				var base64 = window.btoa(res);
				res = "data:image/svg+xml;base64," + base64;
			}
			else if (typeof all === 'object' && isString(item.data)) {
				for (var key in all) {
					var value = all[key];
					res = res.replace(key, value);
				}
			}
		}

		return res;
	}

	replaceId(data) {
		if (Array.isArray(data)) {
			for (var i=0; i < data.length; i++) {
				data[i] = this.replaceId(data[i])
			}
		}
		else if (isString(data) && (data.indexOf("{") + 1 < data.indexOf("}"))) {
			for(let loop=true; loop; loop=false) {
				for (var key in this.cache) {
					var now = this.cache[key];
					if (!isString(now.data)) {
						continue;
					}

					var changed = data.replace("{" + key + "}", now.data);
					if (changed != data) {
						data = changed;

						loop = true;
					}
				}
			}
		}

		return data;
	}

	loader(callback) {
		var self = this;

		var now = null;
		for (var id in this.cache) {
			var item = this.getId(id, true);
			if (item.fetch) {
				item.fetch = false;

				now = item;
				break;
			}
		}
		if (!now) {
			callback(); // done!
			return;
		}

		now.url = now.data;

		console.log('[resources] loading:', now.url);

		var request = new XMLHttpRequest();
		request.open('GET', now.url, true);

		request.onerror = function() {
			console.warn("*** ERROR: loading", now.url, ". Status code: " + request.status);

			self.loader(callback);
		};

		request.onload = function() {
			if (request.status < 200 || request.status >= 400) {
				console.warn("*** ERROR: loading", now.url, ". Status code: " + request.status);
			}
			else {
				now.data = request.responseText;

				if (now.url.endsWith(".json")) {
					now.data = JSON.parse(now.data);
					for (var id in now.data) {
						var data = now.data[id];
						self.setId(id, data);
					}
				}
			}

			self.loader(callback);
		};

		request.send();
	}

	buttonId(config) {
		if (!config || !config.id) {
			return "<ERROR-#1>";
		}

		let type = !config.on ? "off" : (config.focus ? "focus" : "on");
		let id = "url_" + config.id;
		let fullId = id + '-' + type;
		let buttonId = fullId + '-' + config.width + 'x' + config.height;

		let str = this.getId(buttonId);
		if (str) {
			return str;
		}

		var image = this.getId(fullId, false);
		if (!image) {
			image = this.getId(id, false);
			if (!image) {
				return "<ERROR-#2>";
			}

			var color = this.getId("color_" + type);
			var colorReplace = this.getId("color_replace");
			if (color && colorReplace) {
				do {
					var org = image;
					image = image.replace("fill:" + colorReplace + ";", "fill:" + color + ";");
				}
				while (org != image);
			}
		}

		var base64 = window.btoa(image);
		image = "data:image/svg+xml;base64," + base64;

		str = "<img src='" + image + "'";
		if (config.width) {
			str += " width=" + config.width + "px";
		}
		if (config.height) {
			str += " height=" + config.height + "px";
		}
		str += ">";

		this.setId(buttonId, str);

		return str;
	}

	playId(id) {
		var item = this.getId(id);
		if (Array.isArray(item)) {
			id = item[Math.floor(Math.random() * item.length)];
			this.playId(id);
			return;
		}

		if (item === null) {
			item = new Audio(id);
			this.setId(id, item);
		}

		if (item) {
			item.play();
		}
		else {
			console.warn("*** ERROR: Can't audio play " + id);
		}	
	}
}
