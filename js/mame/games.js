 /*** -------------------------------------------------------------------------
 * Main application entry point
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

 class Games {
 
	 constructor() {
		 var self = this;
 
		 this.all = null;
		 this.good = null;
		 this.bad = null;
		 this.names = null;
		 this.years = null;
 
		 this.iamPlaying = false;
 
		 this.db = new loki("games.db");
		 this.users = this.db.addCollection("users");
 
		 this.played = PStore.get(STORE_PLAYED_ID) || {};
		 this.favorits = PStore.get(STORE_FAVORITS_ID) || {};
		 this.twoplayer = PStore.get(STORE_TWO_PLAYER_ID) || {};
		 this.notWorking = PStore.get(STORE_NOT_WORKING_ID) || {};
 
		 this.loaded();
	 }
 
	 loaded() {
		 var verifyedromsStr = resources.getId("url_verifyroms");
		 var listxmlStr = resources.getId("url_listxml");
 
		 var verifyedromsHash = verifyedromsStr.hashCode();
		 var listxmlHash = listxmlStr.hashCode();
 
		 var roms = PStore.get(STORE_ALL_GAMES);
		 if (!roms || !roms.data || roms.verifyedromsHash !== verifyedromsHash || roms.listxmlHash !== listxmlHash) {
			 this.generateRomList(verifyedromsStr, listxmlStr);
		 }
		 else {
			 this.makeRomList(roms.data);
		 }
	 }
 
	 makeRomList(data) {
		 this.names = {};
		 this.all = [];
		 this.good = [];
		 this.bad = [];
 
		 var empty = {
			 counter: 0, 
			 first: null, 
			 last: null,
		 };
 
		 for (var i=0; i < data.length; i++) {
			 var oneGame = data[i];
 
			 var play = this.played[oneGame.name] || empty;
			 var favorit = this.favorits[oneGame.name] || null;
			 var twoplayer = this.twoplayer[oneGame.name] || null;
			 var notWorking = this.notWorking[oneGame.name] === true;
			 var bad = oneGame.state.endsWith("is bad");
			 var best = oneGame.state.endsWith("is best available");
 
			 var card = new Card({
				 state: oneGame.state,
				 name: oneGame.name, // UID
				 year: oneGame.year,
				 description: oneGame.description,
				 manufacturer: oneGame.manufacturer,
 
				 first: new Date(play.first),
				 last: new Date(play.last),
				 counter: play.counter,
				 favorit: favorit,
				 twoplayer: twoplayer,
				 bad: bad,
				 best: best,
				 notWorking: notWorking,
			 });
 
			 this.names[card.name] = card;
 
			 this.all.push(card);
 
			 if (card.bad) {
				 this.bad.push(card);
			 }
			 else {
				 this.good.push(card);
			 }
 
			 this.users.insert(card);
		 }
 
		 this.all.sort(Card.cmpDescriptionInc);
	 }
 
	 generateRomList(verifyedromsStr, listxmlStr) {
		 var roms = [];
		 var validated = {};
 
		 var lines = verifyedromsStr.split("\n");
		 for (var idx = 0; idx < lines.length; idx++) {
			 var line = lines[idx];
			 if ((line.indexOf("NOT FOUND") !== -1) && (line.indexOf("BUT OPTIONAL") === -1)) {
				 continue;
			 }
 
			 if (line.indexOf("INCORRECT CHECKSUM:") !== -1) {
				 continue;
			 }
			 
			 if (line.startsWith("EXPECTED:")) {
				 continue;
			 }
 
			 if (line.startsWith("   FOUND:")) {
				 continue;
			 }
	 
			 if (line.startsWith("romset ")) {
				 line = line.substring(7);
			 }
		 
			 var j = line.indexOf(' ');
		 
			 var name = line.substr(0, j).trim();
			 var state = line.substr(j).trim();
			 if (name !== "" && state !== "") {
				 validated[name] = state;
			 }
		 }
 
		 var parser = new DOMParser();
		 var xml = parser.parseFromString(listxmlStr, "text/xml");
		 var root = xml.getRootNode();
		 var machines = root.getElementsByTagName("machine");
 
		 var fetch = (machine, id) => {
			 var value = machine.getElementsByTagName(id);
			 if (value.length) {
				 return value[0].innerHTML;
			 }
			 return "";
		 }
 
		 for (var idx = 0; idx < machines.length; idx ++) {
			 var machine = machines[idx];
 
			 var name = machine.getAttribute("name");
			 var state = validated[name];
			 if (!state) {
				 continue;
			 }
 
			 var description = fetch(machine, "description");
			 var year = fetch(machine, "year");
			 var manufacturer = fetch(machine, "manufacturer");
			 var input = machine.getElementsByTagName("input");
 
			 if (manufacturer == "<unknown>") {
				 manufacturer = ""
			 }
	 
			 roms.push({
				 name: name, // UID
				 year: year,
				 description: description,
				 manufacturer: manufacturer,
				 state: state,
			 });
		 }
 
		 roms.sort(function(a, b) {
			 if (a.name < b.name) {
				 return -1;
			 }
		 
			 if (a.name > b.name) {
				 return 1;
			 }
		 
			 return 0;
		 });
 
		 PStore.set(STORE_ALL_GAMES, {
			 verifyedromsHash: verifyedromsStr.hashCode(),
			 listxmlHash: listxmlStr.hashCode(),
			 data: roms
		 });
 
		 this.makeRomList(roms);
	 }
 
	 isPlaying() {
		 return this.iamPlaying;
	 }
 
	 play(name, callback) {
		 var self = this;
 
		 var today = new Date();
 
		 var tracking = this.played[name];
		 if (!tracking) {
			 tracking = {
				 first: today,
				 counter: 0,
			 };
		 }
 
		 tracking.last = today;
		 tracking.counter ++;
 
		 this.played[name] = tracking;
		 PStore.set(STORE_PLAYED_ID, this.played);
 
		 var card = this.names[name];
 
		 card.last = tracking.last;
		 card.counter = tracking.counter;
 
		 this.iamPlaying = true;

		 playerOneKeyCounter = 0;
		 playerTwoKeyCounter = 0;
 
		 var cmd = resources.getId("shell_cmd_play", {"{name}": name});
		 if (!cmd) return;
 
		 executeShellCommand(cmd, (error, stdout, stderr) => { 
			 var running = error === null;
 
			 self.setWorking(card, running);

			 if (playerTwoKeyCounter > TWO_PLAYER_KEY_COUNTER) {
				 self.setTwoPlayer(name);
			 }
 
			 this.iamPlaying = false;
 
			 callback(running);
		 }); 
	 }
 
	 playClose(callback) {
		 if (this.isPlaying()) {
			 var cmd = resources.getId("shell_cmd_play_close");
			 executeShellCommand(cmd, (error, stdout, stderr) => { 
				 this.iamPlaying = false;
				 callback(true);
			 });
		 }
		 else {
			 callback(false);
		 }
	 }
 
	 search(text) {
		 if (text.length == 0) {
			 return this.all;
		 }
 
		 text = text.trim().toUpperCase();
 
		 if (text.length === 1) {
			 return this.users.where((card) => {
				 var first = card.description.toUpperCase().charCodeAt(0) - 65;
				 var letter = (first >= 0 ? "" + String.fromCharCode(65 + first) :  "#");
 
				 return letter == text;
			 });
		 }
 
		 var words = text.split(" ");
 
		 return this.users.where((card) => {
			 if (card.year === text) {
				 return true;
			 }
 
			 for (var i=0; i < words.length; i++) {
				 if (card.sorted.indexOf(words[i]) === -1) {
					 return false;
				 }
			 }
 
			 return true;
		 });
	 }
 
	 getAllCards(cmpFunc) {
		 var results = this.all;
		 results.sort(cmpFunc);
		 return results;
	 }
 
	 getGoodCards(cmpFunc) {
		 var results = this.good;
		 results.sort(cmpFunc);
		 return results;
	 }
 
	 getBadBoys(cmpFunc) {
		 var results = this.bad;
		 results.sort(cmpFunc);
		 return results;
	 }
 
	 getStoredList(cards, cmpFunc) {
		 var results = [];
 
		 for (var name in cards) {
			 var card = this.names[name];
			 if (card) {
				 results.push(card);
			 }
		 }
 
		 return results.sort(cmpFunc);
	 }
 
	 getMostPlayed(cmpFunc) {
		 return this.getStoredList(this.played, cmpFunc);
	 }
 
	 getLastPlayed(cmpFunc) {
		 return this.getStoredList(this.played, cmpFunc);
	 }
 
	 getShuffle(count) {
		 var loops = count * 4; // Handbreak!
		 var results = [];
		 var taken = [];
		 var max = this.good.length;
		 while(count && loops) {
			 loops --;
 
			 var idx = Math.floor(Math.random() * max);
			 if (taken[idx]) {
				 continue;
			 }
			 taken[idx] = true;
 
			 var card = this.good[idx];
			 if (card.counter || card.favorit) {
				 continue;
			 }
 
			 results.push(card);
			 count --;
		 }
 
		 return results;
	 }
 
	 setWorking(card, running) {
		 card.notWorking = running;
 
		 if (running) {
			 delete this.notWorking[card.name];
		 }
		 else {
			 this.notWorking[card.name] = true;
		 }
 
		 PStore.set(STORE_NOT_WORKING_ID, this.notWorking);
	 }
 
	 // Favorits
	 getFavorits(cmpFunc) {
		 return this.getStoredList(this.favorits, cmpFunc);
	 }
 
	 hasFavorit(name) {
		 return this.favorits[name] !== undefined;
	 }
 
	 clearFavorit(name) {
		 var card = this.names[name];
		 card.favorit = false;
 
		 delete this.favorits[name];
 
		 PStore.set(STORE_FAVORITS_ID, this.favorits);
	 }
 
	 setFavorit(name) {
		 var card = this.names[name];
		 if (card) {
			 card.favorit = true;
 
			 this.favorits[name] = {
				 added: new Date(),
			 };
 
			 PStore.set(STORE_FAVORITS_ID, this.favorits);
		 }
	 }
 
	 toggleFavorit(name) {
		 if (this.hasFavorit(name)) {
			 this.clearFavorit(name);
			 return false;
		 }
 
		 this.setFavorit(name);
		 return true;
	 }
 
	 // Two Player
 
	 getTwoPlayers(cmpFunc) {
		 return this.getStoredList(this.twoplayer, cmpFunc);
	 }
 
	 hasTwoPlayer(name) {
		 return this.twoplayer[name] !== undefined;
	 }
 
	 clearTwoPlayer(name) {
		 var card = this.names[name];
		 card.twoplayer = false;
 
		 delete this.twoplayer[name];
 
		 PStore.set(STORE_TWO_PLAYER_ID, this.twoplayer);
	 }
 
	 setTwoPlayer(name) {
		 var card = this.names[name];
		 if (card) {
			 card.twoplayer = true;
 
			 this.twoplayer[name] = {
				 added: new Date(),
			 };
 
			 PStore.set(STORE_TWO_PLAYER_ID, this.twoplayer);
		 }
	 }
 
	 toggleTwoPlayer(name) {
		 if (this.hasTwoPlayer(name)) {
			 this.clearTwoPlayer(name);
			 return false;
		 }
 
		 this.setTwoPlayer(name);
		 return true;
	 }
 }
 