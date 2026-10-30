/*\
title: $:/plugins/frd/calendar/calendarTitle.js
type: application/javascript
module-type: macro

<<calendarTitle year month style>>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro

*/

exports.name = "calendarTitle";

exports.params = [
	{ name: "year" },
	{ name: "month" },
	{ name: "style" }
];

/*
Run the macro
*/
exports.run = function calendarTitle(year, month, style) {
	var s='';
	var obj = this.wiki.getTiddlerData("$:/plugins/frd/calendar/calendarConfig","erreur");
	var monthabr=obj["monthabr"][month-1];
	if (style==="basic") {
		s+=monthabr + " " + year;
	} else {
		var tiddler = this.getVariable("calendarState")||this.getVariable("currentTiddler");
		var date= new Date();
		var yearnow=date.getFullYear();
		var monthnow=date.getMonth() +1;
		s+='<$button class="tc-btn-invisible">'+monthabr +' '+year;
		s+='<$action-setfield $tiddler="'+tiddler+'" year='+yearnow+'/>';
		s+='<$action-setfield $tiddler="'+tiddler+'" month='+monthnow+'/>';
		s+='</$button>';
		}
	return s;
};

})();
