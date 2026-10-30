/*\
title: $:/plugins/frd/calendar/readFromDateString.js
type: application/javascript
module-type: macro

<<readFromDateString ymd dateString>>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro

*/

exports.name = "readFromDateString";

exports.params = [
	{ name: "ymd" },
	{ name: "dateString" }
];

/*
Run the macro
*/
exports.run = function readFromDateString(ymd, dateString) {
	var s="";
	var arr = dateString.split("-");
	if (ymd=="year") s = arr[0];
	else if (ymd=="month") s = arr[1];
	return s;
}

})();