// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.js.String");(function(){var method=CERNY.method;var signature=CERNY.signature;CERNY.js.String={};String.prototype.logger=CERNY.Logger("CERNY.js.String");function entityify(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
signature(entityify,"string");method(String.prototype,"entityify",entityify);function trim(){return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/,"$1");}
signature(trim,"string");method(String.prototype,"trim",trim);function pad(padChr,length,front){padChr=padChr.substring(0,1);if(!isBoolean(front)){front=true;}
var padSize=length-this.length;if(padSize>0){var padStr="";for(var i=0;i<padSize;i++){padStr+=padChr;}
if(front){return padStr+this;}
return this+padStr;}
return""+this;}
signature(pad,"string","string","number",["undefined","boolean"]);method(String.prototype,"pad",pad);})();function isNonEmptyString(s){return!isNull(s)&&isString(s)&&s.trim().length>0;}