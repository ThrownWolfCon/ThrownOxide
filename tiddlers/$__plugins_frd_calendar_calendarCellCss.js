/*\
title: $:/plugins/frd/calendar/calendarCellCss.js
type: application/javascript
module-type: macro

<<calendarCellCss year month day numDay>>

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro

*/

exports.name = "calendarCellCss";

exports.params = [
	{ name: "year" },
	{ name: "month" },
	{ name: "day" },
	{ name: "numDay" }
];

/*
Run the macro
*/
exports.run = function calendarCellCss (year, month, day, numDay) {
	var f;
	var classes=["calendar-basic"];
	var cssarray=[];
	var configVariable = this.getVariable("calendarConfig");
	var config = (configVariable) ? configVariable : "$:/plugins/frd/calendar/calendarConfig";
	var obj = this.wiki.getTiddlerData(config,"erreur");
	if (obj!=="erreur") {
		var arr = obj["cellCssConfig"];
		var l=arr.length;
		for (var i=0;i<l;i++) {
			cssarray=arr[i];
			f=cssarray[0];
			if(testfunctions[f](year, month, day, numDay, cssarray.slice(2), this)) classes.push(cssarray[1]);
		}
		return classes.join(" ");
	} else return "Erreur calendarConfig dans calendarCellCss";
}

var testfunctions={
	
	restdays: function(year, month, day, numDay, arr, obj) {
		if(arr.indexOf(numDay)!==-1) return true;
		else return false;
	},
	
	holidays: function(year, month, day, numDay, arr, obj){
		var date=year+"-"+$tw.utils.pad(month)+"-"+$tw.utils.pad(day);
		if(arr.indexOf(date)!==-1) return true;
		else return false;
	},
		
	today: function(year, month, day, numDay, arr, obj) {
		var d=new Date();
		var y=d.getFullYear();
		var m=d.getMonth()+1;
		var dd=d.getDate();
		var todaydate=y+"-"+$tw.utils.pad(m)+"-"+$tw.utils.pad(dd);
//		var todaydate=$tw.utils.formatDateString(d, "YYYY-OMM-ODD");
		var currentdate=year+"-"+$tw.utils.pad(month)+"-"+$tw.utils.pad(day);
		if(todaydate===currentdate) return true;
		else return false;
	},
		
	datepicker: function(year, month, day, numDay, arr, obj) {
		var datePickerDate = obj.getVariable("datePickerDate");
//		var datePickerDate = $tw.getVariable("datePickerDate");
		if (datePickerDate) {
			var currentdate=year+"-"+$tw.utils.pad(month)+"-"+$tw.utils.pad(day);
			if (datePickerDate == currentdate) return true;
		} else return false;
	}
}


})();