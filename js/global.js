/*** -------------------------------------------------------------------------
 * Globals
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

// ---------------------------------------------------------------------------

// BOOT STRAP PATH
const PATH_SETTINGS_JSON        = { "url_config": "./config/settings.json" };

// Store ID's
const STORE_PLAYED_ID           = "played";
const STORE_FAVORITS_ID         = "favorits";
const STORE_TWO_PLAYER_ID       = "twoplayer";
const STORE_HISTORY_ID          = "history";
const STORE_NOT_WORKING_ID      = "notworking";
const STORE_ALL_GAMES           = "games";

// Limits
const SHUFFLE_MAX               = 100;
const CARDS_HISTORY_MAX         = 100;

// ---------------------------------------------------------------------------
// Globals!

var idleTimer   = new Date();
var resources   = null;
var loza        = null;
var games       = null;
var app         = null;
