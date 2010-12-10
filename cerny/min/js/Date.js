// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.js.Date");(function(){var method=CERNY.method;var signature=CERNY.signature;CERNY.js.Date={};Date.prototype.logger=CERNY.Logger("CERNY.js.Date");Date.logger=CERNY.Logger("CERNY.js.Date");function format(format){var dateStr="<1>"+format.separator+"<2>"+format.separator+"<3>";var year=this.getFullYear();var month=this.getMonth()+1;var day=this.getDate();dateStr=dateStr.replace("<"+format.positions.year+">",format.formatters.year(year));dateStr=dateStr.replace("<"+format.positions.month+">",format.formatters.month(month));dateStr=dateStr.replace("<"+format.positions.day+">",format.formatters.day(day));return dateStr;}
signature(format,"string","object");method(Date.prototype,"format",format);function parse(dateStr,formats){if(!isArray(formats)&&isObject(formats)&&formats.regexp){formats=[formats];}
var match=null;var i=0;while(i<formats.length&&!match){match=dateStr.match(formats[i].regexp);if(match===null){i+=1;}}
if(match){var format=formats[i];var year=match[format.positions.year];var month=match[format.positions.month];var day=match[format.positions.day];year=(year>=100)?year:""+format.century+year;var date=new Date(year,month-1,day);var aYear=date.getFullYear();var aMonth=date.getMonth();var aDay=date.getDay();if(year==date.getFullYear()&&month==date.getMonth()+1&&day==date.getDate()){return date;}}
return null;}
signature(parse,["null",Date],"string","object");method(Date,"_parse",parse);})();