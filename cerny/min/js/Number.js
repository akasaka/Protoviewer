// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.js.Number","CERNY.js.Array","CERNY.js.String");(function(){var method=CERNY.method;var signature=CERNY.signature;CERNY.js.Number={};Number.prototype.logger=CERNY.Logger("CERNY.js.Number");Number.logger=CERNY.Logger("CERNY.js.Number");function format(format){var matches=this.toString().match(/(\d+)(.(\d+))?/);var integer=matches[1];var fraction=matches[3];var integerF="";if(integer){if(format.digits.grouping===null){integerF=integer;}else{if(integer.length<=format.digits.grouping){integerF=integer;}else{var intArray=[];var intDigits=integer.split("").reverse();var i=0;intDigits.map(function(_digit){intArray.push(_digit);if(((i+1)%format.digits.grouping)===0&&(i+1)!=intDigits.length){intArray.push(format.separators.grouping);}
i+=1;});integerF=intArray.reverse().join("");}}}
var fractionF="";if(fraction){if(format.digits.fraction===null){fractionF=fraction;}else{if(fraction.length==format.digits.fraction){fractionF=fraction;}else if(fraction.length>format.digits.fraction){fractionF=fraction.substr(0,format.digits.fraction);}else{fractionF=fraction;}}}
if(format.digits.fraction){fractionF=fractionF.pad("0",format.digits.fraction,false);}
var r=integerF;if(fractionF!=""){r+=format.separators.decimal+fractionF;}
return r;};signature(format,"string","object");method(Number.prototype,"format",format);function parse(numStr,formats){if(!isArray(formats)&&isObject(formats)&&formats.regexp){formats=[formats];}
var match=null;var i=0;while(i<formats.length&&!match){match=numStr.match(formats[i].regexp);if(match===null){i+=1;}}
if(match){var format=formats[i];return format.parse(numStr);}
return null;};signature(parse,["number","null"],"string","object");method(Number,"_parse",parse);})();