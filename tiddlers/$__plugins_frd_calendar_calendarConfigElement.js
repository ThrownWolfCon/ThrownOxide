/*\
title: $:/plugins/frd/calendar/calendarConfigElement.js
type: application/javascript
module-type: macro

<<calendarConfigElement element>>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro

*/

exports.name = "calendarConfigElement";

exports.params = [
	{ name: "element" }
];

/*
Run the macro
*/
exports.run = function calendarConfigElement(element) {
	var s;
	var configVariable = this.getVariable("calendarConfig");
	var config = (configVariable) ? configVariable : "$:/plugins/frd/calendar/calendarConfig";
	var obj = this.wiki.getTiddlerData(config,"erreur");
	s=obj[element];
	if(s!==undefined) return s;
	else return "";
};

})();