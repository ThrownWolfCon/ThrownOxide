/*\
title: $:/plugins/frd/calendar/calendarjs.js
type: application/javascript
module-type: macro

<<calendarjs fieldyear fieldmonth startingDay year month buttons cellContent>>

FrD : francois.deblon@yahoo.fr

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro

*/

exports.name = "calendarjs";

exports.params = [
	{ name: "fieldyear" },
	{ name: "fieldmonth" },
	{ name: "startingDay" },
	{ name: "year" },
	{ name: "month" },
	{ name: "buttons" },
	{ name: "cellContent" }
];

/*
Run the macro
*/
exports.run = function calendar(fieldyear, fieldmonth, sstartingDay, syear, smonth, buttons, cellContent) {
	var calStr="";
	var d=new Date();
	var year=probeAndParseData(fieldyear, "year");
	var month=probeAndParseData(fieldmonth, "month");
	var nyear=probeAndParseData(syear, "year");
	var nmonth=probeAndParseData(smonth, "month");
	var startingDay;
	if ((year===false)||(month===false)||(nyear===false)||(nmonth===false)||(startingDay===false)) return "Erreur dans les données de mois, d année ou de startingDay";
	if (year===0) year = (nyear===0) ? d.getFullYear(): nyear;
	if (month===0) month = (nmonth === 0) ? (d.getMonth()+1) : nmonth;
	var state = this.getVariable("calendarState")||this.getVariable("currentTiddler");
	var configVariable = this.getVariable("calendarConfig");
	var config = (configVariable) ? configVariable : "$:/plugins/frd/calendar/calendarConfig";
	var obj = this.wiki.getTiddlerData(config,"erreur");
	if (obj!=="erreur") {
		startingDay = (sstartingDay==="") ? probeAndParseData(obj["startingDay"]) : probeAndParseData(sstartingDay);
		var weekDays=obj["days"];
		var days=getDaysInMonth(year, month);
		var firstOfMonth = new Date (year, month-1, 1);
		var firstDay=firstOfMonth.getDay();
		var w=calendarArray(year, month, startingDay, firstDay, days);
		calStr+="<table>";
		calStr+=calendarButtonsTitle(state, config, year, month, buttons);
		calStr+="<tr><th>"+rotateArray(startingDay, weekDays).join("</th><th>")+"</th></tr>";
		calStr += calendarCells(config, w, cellContent);
		calStr+="</table>";
		return calStr;
	} else return "Erreur calendarConfig";
}

function probeAndParseData(data, field) {
	var num;
	if (data==="") {
		num = 0;
	} else {
		num = parseInt(data, 10);
		if (isNaN(num)) num=false;
		else {
			if ((field==="year") && ((num < 999) || (num > 9999))) {
				num = false;
			} else if ((field==="month") && ((num < 1) || (num > 12))) {
				num = false;
			} else if ((field==="startingDay") && ((num < 0) || (num > 6))) {
				num = false;
			}
		}
	}
	return num;
}

function calendarButtonsTitle(state, config, year, month, sbuttons) {
	var buttons;
	var s="";
	var obj = $tw.wiki.getTiddlerData(config,"erreur");
	if (obj!=="erreur") {
		buttons = (sbuttons==="") ? obj["buttons"] : sbuttons;
		if(buttons==="none") {
			s+="<th colspan='7'><<calendarTitle "+year+" "+month+" basic>></th>";
		} else {
			var buttonsImages = obj["buttonsImages"];
			s+="<tr>";
			s+="<td class='tc-popup-handle'>"+calendarButton(state, buttonsImages[0], "previous", "year", year, month) + "</td>";
			s+="<td class='tc-popup-handle'>"+calendarButton(state, buttonsImages[1], "previous", "month", year, month) + "</td>";
			s+="<th colspan='3' class='tc-popup-handle'><<calendarTitle "+year+" "+month+">></th>";
			s+="<td class='tc-popup-handle'>"+calendarButton(state, buttonsImages[2], "next", "month", year, month) + "</td>";
			s+="<td class='tc-popup-handle'>"+calendarButton(state, buttonsImages[3], "next", "year", year, month) + "</td>";
			s+="</tr>";
		}
	} else s+="Erreur calendarConfig dans calendarButtonsTitle";
	return s;
}

function calendarButton (state, title, direction, yearmonth, year, month) {
	var s="";
	var arr = getPrevNextMonthYear(direction, yearmonth, year, month);
	s+="<$button class='tc-btn-invisible'>"+title;
	s+="<$action-setfield $tiddler='"+state+"'  year="+arr[0]+"/>";
	s+="<$action-setfield $tiddler='"+state+"'  month="+arr[1]+"/>";
	s+="</$button>";
	return s;
}

function getPrevNextMonthYear(direction, yearmonth, yyear, mmonth) {
	var ymarr=new Array();
	var year=yyear;
	var month=mmonth;
	if(yearmonth=="year"){
		if(direction=="previous") year=year-1;
		else if(direction=="next") year=year+1;
	} else if(yearmonth=="month"){
		if(direction=="previous"){
			if(month==1){
				month=12;
				year=year-1;
			} else month=month-1;
		} else if(direction=="next"){
			if(month==12){
				month=1;
				year=year+1;
			}else month=month+1;
		}
	}
	ymarr[0] = year;
	ymarr[1] = month;
	return ymarr;
}

function calendarArray(year, month, startingDay, firstDay, days) {
	var pdays;
	var ymarr;
	var daysNumArray=[0,1,2,3,4,5,6];
	var currDay=0;
	var w=[];
	var nbz=nbZeros(startingDay, firstDay);
	var nbComplWeeks;
	var rem;
	var zrem;
	rotateArray(startingDay, daysNumArray);
	w[0]=[];
	for(var i=0; i < nbz; i++) {
		ymarr = getPrevNextMonthYear("previous", "month", year, month);
		pdays=getDaysInMonth(ymarr[0], ymarr[1]);
		calendarArrayCell(w, ymarr[0], ymarr[1], pdays-nbz+i+1, daysNumArray, 0, i)
	}
	for(var i=nbz; i < 7; i++) {
		currDay+=1;
		calendarArrayCell(w, year, month, currDay, daysNumArray, 0, i)
	}
	nbComplWeeks =parseInt((days-currDay)/7, 10);
	for(i=0;i<nbComplWeeks;i++) {
		w[i+1]=[];
		for (var j=0;j<7;j++) {
			currDay+=1;
			calendarArrayCell(w, year, month, currDay, daysNumArray, i+1, j)
		}
	}
	rem=days-currDay;
	if(rem>0) {
		w[nbComplWeeks+1]=[];
		for (var i=0;i<rem;i++) {
			currDay+=1;
			calendarArrayCell(w, year, month, currDay, daysNumArray, nbComplWeeks+1, i)
		}
		zrem=7-rem;
		if (zrem>0) {
			currDay=0;
			for (var i=rem;i<7;i++){
				currDay+=1;
				ymarr = getPrevNextMonthYear("next", "month", year, month);
				calendarArrayCell(w, ymarr[0], ymarr[1], currDay, daysNumArray, nbComplWeeks+1, i)
			}
		}
	}
	return w;
}


function calendarArrayCell(calArray, year, month, currDay, daysNumArray, i, j){
	calArray[i][j]=[];
	calArray[i][j][0]=year;
	calArray[i][j][1]=month;
	calArray[i][j][2]=currDay;
	calArray[i][j][3]=daysNumArray[j];
}

function nbZeros(startingDay, firstDay) {
	var nbz = firstDay - startingDay;
	return (nbz >= 0)?nbz:nbz+7;
}

function calendarCells(configTiddlerTitle, cellsArray, scellContent) {
	var l=cellsArray.length;
	var cellContent;
	var cellContentMacro;
	var str="";
	var obj = $tw.wiki.getTiddlerData(configTiddlerTitle,"erreur");
	if (obj!=="erreur") {
		cellContent = (scellContent==="") ? obj["cellContent"] : scellContent;
		var contentPreDef = obj["cellContentPreDef"];
		if (contentPreDef.indexOf(cellContent) !== -1) cellContentMacro = "calendarCellContent_"+cellContent;
		else cellContentMacro = cellContent;
		for (var i=0;i<l;i++) {
			str+="<tr>";
			for (var j=0;j<7;j++) {
				str+="<td class=<<calendarCellCss "+cellsArray[i][j][0] +" ";
				str+=cellsArray[i][j][1]+" "+cellsArray[i][j][2] + " "+cellsArray[i][j][3] + ">>>";
				str+="<<"+cellContentMacro + " " + cellsArray[i][j][0] +" ";
				str+=cellsArray[i][j][1]+" "+cellsArray[i][j][2] + " "+cellsArray[i][j][3] + ">>";
				str+="</td>";
			}
			str+="</tr>";
		}
	} else return "Erreur calendarConfig dans calendarCells";
	return str;
}



function isLeapYear (Year) {
	if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
		return true;
	} else { return false; }
}

function getDaysInMonth(year, month)  {
	var days;
	if (month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)  days=31;
	else if (month==4 || month==6 || month==9 || month==11) days=30;
	else if (month==2)  {
		if (isLeapYear(year)) { days=29; }
		else { days=28; }
	}
	return days;
}

function rotateArray(num, array) {
	var d;
	for (var i = 0;i<num;i++) {
		d=array[0];
		array.shift();
		array.push(d);
	}
	return array;
}

})();
