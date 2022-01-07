/*** -------------------------------------------------------------------------
 * Permanent Storage
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

class PStore {

	static get(name) {
		let json;

		if (isElectron()) {
			try {
				var filename = resources.getId("storage", {"{name}": name});

				const fs = require('fs');
				let rawdata = fs.readFileSync(filename);  
				json = JSON.parse(rawdata); 
			}
			catch (err) {
				json = null;
			}

		}
		else {
			json = store.get(name);
		}

		return json;
	}

	static set(name, json) {
		if (isElectron()) {
			var filename = resources.getId("storage", {"{name}": name});

			const fs = require('fs');
			let rawdata = JSON.stringify(json, null, 4);  
			fs.writeFileSync(filename, rawdata);
		}
		else {
			store.set(name, json);
		}
	}
}
