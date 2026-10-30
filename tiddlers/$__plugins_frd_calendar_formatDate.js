/*\
title: $:/plugins/frd/calendar/formatDate.js
type: application/javascript
module-type: macro

<<formatDate year month day format>>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro

*/

exports.name = "formatDate";

exports.params = [
	{ name: "year" },
	{ name: "month" },
	{ name: "day" },
	{ name: "format" }
];

/*
Run the macro
*/
exports.run = function formatDate(year, month, day, format) {
	var date = new Date(parseInt(year), parseInt(month)-1, parseInt(day));
	var defaultFormat = this.wiki.getTiddlerText("$:/config/NewJournal/Title", "YYYY-0MM-0DD")
	return $tw.utils.formatDateString(date,format || defaultFormat);
}

})();