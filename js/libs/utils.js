/*** -------------------------------------------------------------------------
 * Misc. utility functions
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

/***
 * Source:
 *      https://davidwalsh.name/javascript-clone-array
 */
Array.prototype.clone = function() {
	return this.slice(0);
};

/***
 * Source:
 *      https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 */
String.prototype.hashCode = function(){
	let h = 0;

	let len = this.length;
	for(let i = 0; i < len; i++) 
			h = Math.imul(31, h) + this.charCodeAt(i) | 0;

	return h;
}

/***
 * Source:
 *      https://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string-in-javascript
 */
function isString(type) {
	return (typeof type === 'string' || type instanceof String);
}

/***
 * Source:
 *      https://github.com/daneden/animate.css
 */
function animateCss(element, animationName, callback) {
	const node = document.querySelector(element)
	node.classList.add('animated', animationName)

	function handleAnimationEnd() {
		node.classList.remove('animated', animationName)
		node.removeEventListener('animationend', handleAnimationEnd)

		if (typeof callback === 'function') callback()
	}

	node.addEventListener('animationend', handleAnimationEnd)
}

String.prototype.endsWiths = function (lit) {
	for (let i=0; i < arguments.length; i++) {
		if (this.endsWith(arguments[i])) {
			return true;
		}		
	}
	return false;
}

/***
 * Source:
 *      https://github.com/electron/electron/issues/2288
 */
function isElectron() {
	var userAgent = navigator.userAgent.toLowerCase();
	return (userAgent.indexOf(' electron/') > -1);
}

/***
 * Source:
 *      https://stackoverflow.com/questions/35079548/how-to-call-shell-script-or-python-script-in-from-a-atom-electron-app
 */
function executeShellCommand(command, callback) {
	callback = callback || function() {};

	if (isElectron() && command !== "") {
		const exec = require('child_process').exec;
		exec(command, callback);
	}
	else {
		console.log("[executeShellCommand] ", command)

		callback(null, null, null); 
	}
}

function appCmd(cmd) {
	if (isElectron()) {
		const { ipcRenderer } = require('electron')
		ipcRenderer.send(cmd)
	}
	else {
		console.log("[appCommand] " + cmd);
	}
}

/***
 * 
 * Source:
 *      https://stackoverflow.com/questions/36098913/convert-seconds-to-days-hours-minutes-and-seconds
 */
function elapsedString(msec) {
	var seconds = msec / 1000;

	var years = Math.floor(seconds / (3600*24*365));
	if (years) {
		return Math.round(years * 10) / 10 + "y";
	}

	var days = Math.floor(seconds / (3600*24));
	if (days) {
		return days + "d";
	}

	seconds  -= days*3600*24;
	var hrs   = Math.floor(seconds / 3600);
	if (hrs) {
		return hrs + "h";
	}

	seconds  -= hrs*3600;
	var mnts = Math.floor(seconds / 60);
	if (mnts) {
		return mnts + "m";
	}

	seconds  -= mnts*60;
	return Math.round(seconds) + "s";
}
