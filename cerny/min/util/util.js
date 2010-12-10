// (c) 2006-2008 Robert Cerny
CERNY.namespace("util");CERNY.require("CERNY.util","CERNY.js.Array","CERNY.js.String");(function(){var method=CERNY.method;var signature=CERNY.signature;var logger=CERNY.Logger("CERNY.util");CERNY.util.logger=logger;function indent(indentation){var result="\n";for(var i=0;i<indentation;i++){result+=" ";}
return result;};method(CERNY.util,"indent",indent);signature(indent,"string","number");function fillNumber(number){var str=number.toString();return str.pad("0",2);};method(CERNY.util,"fillNumber",fillNumber);signature(fillNumber,"string","number");function cutNumber(number,size){var str=""+number.toString();return str.slice(str.length-size,str.length);};method(CERNY.util,"cutNumber",cutNumber);signature(cutNumber,"string","number","number");function escapeStrForRegexp(str){if(str=="."){return'\\'+str;}
return str;};method(CERNY.util,"escapeStrForRegexp",escapeStrForRegexp);signature(escapeStrForRegexp,"string","string");function parseUri(uri){var r=new RegExp(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);var m=r.exec(uri);var ensure=function(_str){return _str!=null?_str:"";}
var i={};i.scheme=ensure(m[2]);i.authority=ensure(m[4]);i.path=ensure(m[5]);i.query=ensure(m[7]);i.fragment=ensure(m[9]);var ra=new RegExp(/^(([^@]+)@)?([^:]+)(:([0-9]*))?/);var ma=ra.exec(i.authority);if(ma){i.userinfo=ensure(ma[2]);i.host=ensure(ma[3]);i.port=ensure(ma[5]);}
i.path_segments=i.path.replace(/^\//,"").split("/");return i;};method(CERNY.util,"parseUri",parseUri);signature(parseUri,"object","string");function getNameFromFqName(fqName){var lastSegment=fqName.split("\.").pop();if(lastSegment.indexOf("_")>=0){lastSegment=lastSegment.split("_").pop();}
return lastSegment;}
method(CERNY.util,"getUriParameterValue",getUriParameterValue);signature(getNameFromFqName,"string","string");function getUriParameterValue(parameter,url){if(!url){url=document.URL;}
var regex="/.*"+parameter+"=([^&]*).*/";var match=new RegExp(eval(regex)).exec(url);if(match!=null&&match[1]!=null){return decodeURIComponent(match[1]);}else{return null;}}
method(CERNY.util,"getNameFromFqName",getNameFromFqName);signature(getUriParameterValue,["null","string"],["string"],["string","undefined"]);function compare(a,b){if(a==b)return 0;if(a>b)return 1;return-1;}
method(CERNY.util,"compare",compare);signature(compare,"number","any","any");function createComparator(order,compare){if(!compare){compare=CERNY.util.compare;}
return function(a,b){var indexA=order.indexOf(a);var indexB=order.indexOf(b);if(indexA<0){if(indexB<0){return compare(a,b);}
return 1;}
if(indexB<0){return-1;}
return compare(indexA,indexB);}}
method(CERNY.util,"createComparator",createComparator);signature(createComparator,"function",Array,["undefined","function"]);})();