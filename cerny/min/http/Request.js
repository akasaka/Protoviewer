// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.http.Request","CERNY.http.Response");(function(){var signature=CERNY.signature;var method=CERNY.method;var Response=CERNY.http.Response;CERNY.http.Request=Request;var logger=CERNY.Logger("CERNY.http.Request");function Request(method,url){this.method=method;this.url=url;this.headers={};this.body=null;this.contentType=null;}
Request.prototype.logger=logger;Request.UNSENT="0";Request.OPEN="1";Request.SENT="2";Request.LOADING="3";Request.DONE="4";function setBody(body,contentType){this.body=body;this.contentType=contentType;}
signature(setBody,"undefined","string",["undefined","string"]);method(Request.prototype,"setBody",setBody);function setHeader(name,value){this.headers[name]=value;}
signature(setHeader,"undefined","string","string");method(Request.prototype,"setHeader",setHeader);function sendSynch(){this.request=new XMLHttpRequest();this.request.open(this.method,this.url,false);setHeaders(this,this.request);this.request.send(this.body);return new Response(this.request);}
signature(sendSynch,CERNY.http.Response);method(Request.prototype,"sendSynch",sendSynch);function sendAsynch(callback){var handler=callback;if(isFunction(callback)){handler={};handler[Request.DONE]=callback;}
this.request=new XMLHttpRequest();this.request.open(this.method,this.url,true);setHeaders(this,this.request);var req=this.request;this.request.onreadystatechange=function(){if(isFunction(handler[""+req.readyState])){handler[""+req.readyState](req);}}
this.request.send(this.body);}
signature(sendAsynch,"undefined",["function","object"]);method(Request.prototype,"sendAsynch",sendAsynch);function setHeaders(t,request){if(t.contentType){request.setRequestHeader("Content-Type",t.contentType);}
for(var name in t.headers){if(t.headers.hasOwnProperty(name)){request.setRequestHeader(name,t.headers[name]);}}}})();