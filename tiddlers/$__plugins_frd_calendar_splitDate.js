/*\
title: $:/plugins/frd/calendar/splitDate.js
type: application/javascript
module-type: macro

<<splitDate date>>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro

*/

exports.name = "splitDate";

exports.params = [
	{ name: "date" }
];

/*
Run the macro
*/
exports.run = function splitDate(date) {
	return date.replace(/-/g, " ");
}

})();