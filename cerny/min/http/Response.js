// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.http.Response");(function(){var signature=CERNY.signature;var method=CERNY.method;CERNY.http.Response=Response;var logger=CERNY.Logger("CERNY.http.Response");function Response(request){this.request=request;this.body=request.responseText;this.status=request.status;}
Response.prototype.logger=logger;function getStatus(){return this.status;}
signature(getStatus,"number");method(Response.prototype,"getStatus",getStatus);function getBody(){return this.body;}
signature(getBody,"string");method(Response.prototype,"getBody",getBody);function getHeader(name){return this.request.getResponseHeader(name);}
signature(getHeader,"string","string");method(Response.prototype,"getHeader",getHeader);function getValue(){eval("var o = "+this.body);return o;}
signature(getValue,"any");method(Response.prototype,"getValue",getValue);})();