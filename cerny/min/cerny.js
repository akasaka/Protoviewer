// (c) 2006-2008 Robert Cerny
if(typeof CERNY!='object'){CERNY={};}
(function(){CERNY.CloningException=CloningException;CERNY.ContractViolation=ContractViolation;CERNY.check=check;CERNY.clone=clone;CERNY.dump=dump;CERNY.instanceOf=instanceOf;CERNY.method=method;CERNY.object=object;CERNY.post=post;CERNY.pre=pre;CERNY.signature=signature;CERNY.typeOf=_typeOf;function object(obj){obj=obj||{};function F(){}
F.prototype=obj;return new F();};function method(obj,name,func,interceptors){var f=func,interceptor;if(!interceptors){interceptors=CERNY.Configuration.Interception.active;}
for(var i=interceptors.length-1;i>=0;i--){interceptor=interceptors[i];interceptor.create=CERNY.Interceptors.create;f=interceptor.create(obj,name,f,i);}
obj[name]=f;};function signature(func,returnType){if(func._signature){throw new Error("Signature already defined: "+func);}
var parameterTypes=[];for(var i=2;i<arguments.length;i++){parameterTypes[i-2]=arguments[i];}
func._signature={returnType:returnType,parameterTypes:parameterTypes}};function pre(func,pre){func._pre=pre;}
function post(func,post){func._post=post;}
function check(expr,message){if(expr===false){throw new CERNY.ContractViolation(message);}}
function ContractViolation(message){this.message=message;}
function CloningException(type){this.message="Cloning not available for that type: "+type;}
function clone(subject){switch(_typeOf(subject)){case Array:var clone=[];for(var i=0,l=subject.length;i<l;i++){try{clone[i]=CERNY.clone(subject[i]);}catch(e){if(e instanceof CERNY.CloningException){CERNY.print("When cloning array item at position: "+i+": "+e.message);}}}
return clone;case Object:var clone={};for(var name in subject){if(subject.hasOwnProperty(name)){try{clone[name]=CERNY.clone(subject[name]);}catch(e){if(e instanceof CERNY.CloningException){CERNY.print("When cloning value of property '"+name+"': "+e.message);}}}}
return clone;case Date:return new Date(subject.getTime());case"boolean":case"function":case"null":case"number":case"string":case"undefined":return subject;default:if(typeof subject.clone=="function"){return subject.clone();}
throw new CERNY.CloningException(_typeOf(subject));}}
function dump(value){var encloser="";if(isString(value)){encloser="'";}
return encloser+value+encloser+" ("+typeof value+")";};function instanceOf(obj,func){if(isObject(obj)){return obj instanceof func;}};function _typeOf(value){var type=typeof value;if(type=="object"){if(value===null){return"null";}
return value.constructor;}
if(type=="function"){if(value.constructor===RegExp){return value.constructor;}}
return type;}})();(function(){CERNY.Logger=Logger;function Logger(name){if(isObject(CERNY.Logger[name])){return CERNY.Logger[name];}
function getLogLevelStr(name){var segments=name.split("."),part;var logLevelStr=null;for(var i=segments.length;i>0&&logLevelStr==null;i--){part="";for(var j=0;j<i;j++){if(part!=""){part+=".";}
part+=segments[j];}
logLevelStr=CERNY.Configuration.Logger[part];}
return logLevelStr||CERNY.Configuration.Logger["ROOT"]||"OFF";};var self=CERNY.object(CERNY.Logger.Logger);self.name=name;var logLevelStr=getLogLevelStr(name);self.logLevel=CERNY.Logger[logLevelStr];if(!isNumber(self.logLevel)){CERNY.print("Invalid log level '"+logLevelStr+"' for '"+name+"'. Defaults to FATAL."+"Log level must be one of 'OFF', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG' or 'TRACE'.");self.logLevel=CERNY.Logger.FATAL;}
CERNY.Logger[name]=self;return self;}
CERNY.Logger.OFF=10;CERNY.Logger.FATAL=20;CERNY.Logger.ERROR=30;CERNY.Logger.WARN=40;CERNY.Logger.INFO=50;CERNY.Logger.DEBUG=60;CERNY.Logger.TRACE=70;CERNY.Logger.indent=-1;CERNY.Logger.indentStr=CERNY.Configuration.Logger.indentStr||"  ";CERNY.Logger.appenders=[CERNY.print];CERNY.Logger.layout=function(date,levelName,indentStr,message,loggerName){return date.getTime()+", "+levelName+": "+indentStr+message+" | "+loggerName;};function createLogFunction(level,levelStr){return function(message,time){if(level<=this.logLevel){var indentStr="";for(var i=0;i<CERNY.Logger.indent;i++){indentStr+=CERNY.Logger.indentStr;}
for(var i=0;i<CERNY.Logger.appenders.length;i++){CERNY.Logger.appenders[i](CERNY.Logger.layout(new Date(),levelStr,indentStr,message,this.name));}}}};function createEnabledFunction(level){return function(){return level<=this.logLevel;}};CERNY.Logger.Logger={fatal:createLogFunction(CERNY.Logger.FATAL,"FATAL"),warn:createLogFunction(CERNY.Logger.WARN,"WARN "),info:createLogFunction(CERNY.Logger.INFO,"INFO "),error:createLogFunction(CERNY.Logger.ERROR,"ERROR"),debug:createLogFunction(CERNY.Logger.DEBUG,"DEBUG"),trace:createLogFunction(CERNY.Logger.TRACE,"TRACE"),isFatalEnabled:createEnabledFunction(CERNY.Logger.FATAL),isWarnEnabled:createEnabledFunction(CERNY.Logger.WARN),isInfoEnabled:createEnabledFunction(CERNY.Logger.INFO),isErrorEnabled:createEnabledFunction(CERNY.Logger.ERROR),isDebugEnabled:createEnabledFunction(CERNY.Logger.DEBUG),isTraceEnabled:createEnabledFunction(CERNY.Logger.TRACE)};CERNY.logger=CERNY.Logger("CERNY");})();(function(){CERNY.Interceptors={};CERNY.Interceptors.create=create;function create(obj,name,func,position){var t=this;var loggerName="NONE";if(isObject(obj.logger)&&isString(obj.logger.name)){loggerName=obj.logger.name;}
return function(){var call={arguments:arguments,func:func,subject:this,logger:CERNY.Logger(loggerName+"."+name)}
t.before(call);try{call.returnValue=func.apply(this,arguments);}catch(e){call.exception=e;if(position==0){if(call.logger.isErrorEnabled()){call.logger.error("Exception: "+e.message);}else{CERNY.print("Exception: "+e.message+" | "+call.logger.name);}}
throw e;}finally{t.after(call);}
return call.returnValue;};};CERNY.Interceptors.LogIndenter={before:function(call){if(call.logger.logLevel>=CERNY.Logger.TRACE){CERNY.Logger.indent+=1;}},after:function(call){if(call.logger.logLevel>=CERNY.Logger.TRACE){CERNY.Logger.indent-=1;}}}
CERNY.Interceptors.Tracer={before:function(call){call.logger.trace("entry");for(var i=0;i<call.arguments.length;i++){call.logger.trace("arg "+i+": "+CERNY.dump(call.arguments[i]));}},after:function(call){call.logger.trace("return: "+CERNY.dump(call.returnValue));}}
CERNY.Interceptors.Profiler={before:function(call){var func=call.func;if(!func._ProfilerData){func._ProfilerData={count:0,total:0}}
func._ProfilerData.count+=1;call.logger.trace("start");call.start=new Date();},after:function(call){var duration=new Date().getTime()-call.start.getTime();call.func._ProfilerData.total+=duration;call.logger.trace("stop: "+duration+" ms");}}
CERNY.Interceptors.TypeChecker={before:function(call){var type,argument;if(isObject(call.func._signature)){var signature=call.func._signature;for(var i=0;i<signature.parameterTypes.length;i++){type=signature.parameterTypes[i];argument=call.arguments[i];try{CERNY.checkType(type,argument);}catch(te){if(te instanceof TypeError){call.logger.fatal("arg "+i+": "+te.message);}
throw te;}}
for(var j=i;j<call.arguments.length;j++){argument=call.arguments[j];try{CERNY.checkType(type,argument);}catch(te){if(te instanceof TypeError){call.logger.fatal("arg "+i+": "+te.message);}
throw te;}}}},after:function(call){if(isObject(call.func._signature)&&!call.exception){try{CERNY.checkType(call.func._signature.returnType,call.returnValue);}catch(te){if(te instanceof TypeError){call.logger.fatal("return: "+te.message);}
throw te;}}}}
CERNY.Interceptors.ContractChecker={before:function(call){try{call.old=CERNY.clone(call.subject);}catch(e){if(e instanceof CERNY.CloningException){call.logger.warn(e.message);}else{throw e;}}
if(isFunction(call.func._pre)){try{call.func._pre.apply(call.subject,call.arguments);}catch(e){if(e instanceof CERNY.ContractViolation){e.message="Precondition violated: "+e.message;call.logger.fatal(e.message);}
throw e;}}},after:function(call){if(!call.exception){if(isFunction(call.func._post)){try{if(!call.old){call.logger.warn("no old version of the object available.");}
var args=[call.old,call.returnValue];for(var i=0;i<call.arguments.length;i++){args.push(call.arguments[i]);}
call.func._post.apply(call.subject,args);}catch(e){if(e instanceof CERNY.ContractViolation){e.message="Postcondition violated: "+e.message;call.logger.fatal(e.message);}
throw e;}}
if(isFunction(call.subject.invariant)){try{call.subject.invariant();}catch(e){if(e instanceof CERNY.ContractViolation){e.message="Invariant violated: "+e.message;call.logger.fatal(e.message);}
throw e;}}}
delete(call.old);}}})();if(isFunction(CERNY.configure)){CERNY.configure();}
(function(){var dump=CERNY.dump;var method=CERNY.method;var print=CERNY.print;var signature=CERNY.signature;function intercept(obj){var intercepted=[],specs=[],spec,intercept,i,j,name,newName,interceptors,count,logger=CERNY.Logger("CERNY.intercept");if(!isFunction(obj.hasOwnProperty)){print("The object of interception does not feature the method 'hasOwnProperty'.");print("Interception cannot be applied.");return intercepted;}
if(obj.logger){logger.debug("obj.logger.name: "+obj.logger.name);}
for(var i=1;i<arguments.length;i++){if(isArray(arguments[i])){interceptors=arguments[i];}else{specs.push(arguments[i]);}}
if(specs.length==0){specs.push(/.*/);}
for(i=0;i<specs.length;i++){spec=specs[i];var count=0;for(name in obj){intercept=false;if(isFunction(obj[name])&&obj.hasOwnProperty(name)){if(isString(spec)){if(name==spec){intercept=true;}}else if(isRegexp(spec)){if(name.match(spec)){intercept=true;}}}
if(intercept){count+=1;if(!isObject(obj["_intercepted"])){obj._intercepted={};}
if(isFunction(obj._intercepted[name])){logger.info("Intercepted method '"+name+"' already existing . Using existing one, not passed one.");obj[name]=obj._intercepted[name];}
obj._intercepted[name]=obj[name];CERNY.method(obj,name,obj._intercepted[name],interceptors);intercepted.push(name);}}
if(isString(spec)&&count==0){logger.error("Method specified, but not intercepted: "+spec);}}
return intercepted;};signature(intercept,Array,["object","function"],["undefined","string",RegExp,Array]);method(CERNY,"intercept",intercept);function checkType(type,value,throwException){if(!isBoolean(throwException)){throwException=true;}
var logger=CERNY.Logger("CERNY.checkType"),message=null;switch(typeof type){case"string":switch(type){case"any":break;case"null":if(value!==null){message="Type error: "+dump(value)+"should be of type null";}
break;default:if(typeof value!=type){message="Type error: "+dump(value)+" should be of type "+type;}
break;}
break;case"function":if(!CERNY.instanceOf(value,type)){message="Type error: "+dump(value);if(type.prototype.constructor.name){message+=" should be of type "+type.prototype.constructor.name;}}
break;case"object":if(isArray(type)){var typeError=true;for(var i=0;i<type.length&&typeError;i++){typeError=!CERNY.checkType(type[i],value,false);}
if(typeError){message="Type error (Array): "+dump(value);}}
break;case"undefined":if(typeof value!=="undefined"){message="Type error: "+dump(value)+" should be undefined";}
break;default:logger.error("Type not handled: "+dump(type));}
if(message){if(throwException){throw new TypeError(message);}
return false;}
return true;};method(CERNY,"checkType",checkType);function namespace(name,parentNameSpace){var i,parentNameSpace=parentNameSpace||CERNY,segments=name.split(".");for(i=0;i<segments.length;i++){if(!parentNameSpace.hasOwnProperty(segments[i])){parentNameSpace[segments[i]]={};}
parentNameSpace=parentNameSpace[segments[i]];}
return parentNameSpace;};signature(namespace,"object","string",["undefined","object"]);method(CERNY,"namespace",namespace);function joinFunctions(){var args=arguments;return function(){var result;for(var i=0;i<args.length;i++){result=args[i].apply(this,arguments);}
return result;};};signature(joinFunctions,"function","function");method(CERNY,"joinFunctions",joinFunctions);function identity(arg){return arg;}
signature(identity,"any","any");method(CERNY,"identity",identity);function empty(){};signature(empty,"undefined");method(CERNY,"empty",empty);function isPresent(exp){var present=true,result,logger=CERNY.Logger("CERNY.isPresent");try{result=eval(exp);if(isUndefined(result)){present=false;}
logger.debug("result: "+dump(result));}catch(e){logger.debug("exception: "+e);present=false;}
return present;};signature(isPresent,"boolean","string");method(CERNY,"isPresent",isPresent);function require(script){var exp,present,i,missing=[],missingMsg,logger=CERNY.Logger("CERNY.require"),value,values,location;for(i=1;i<arguments.length;i++){exp=arguments[i];logger.debug("exp: '"+exp+"'");if(isString(exp)){present=CERNY.isPresent(exp);if(!present){try{value=CERNY.Catalog.lookup(exp);}catch(e){throw new Error("Catalog does not resolve: '"+exp+"'");}
values=value.split(",");if(values.length==1){location=values[0];}else{location=values.pop();values.unshift(exp);CERNY.require.apply(CERNY,values);}
CERNY.load(location);present=CERNY.isPresent(exp);}
if(!present){logger.error("Expression missing: "+exp);missing.push(exp);}}}
if(missing.length>0){for(i=0;i<missing.length;i++){if(missingMsg){missingMsg+=", ";}else{missingMsg=script+" is missing ";}
missingMsg+=missing[i];}
logger.fatal(missingMsg+"!");CERNY.print(missingMsg+"!");}
return missing;};signature(require,Array,"string",["undefined","string"]);method(CERNY,"require",require);if(typeof XMLHttpRequest=='undefined'){XMLHttpRequest=function(){return new ActiveXObject("Microsoft.XMLHTTP");};}
function load(location){if(isUndefined(location)){return;}
var logger=CERNY.Logger("CERNY.load");try{var sourceCode=CERNY.getResource(location);if(window.execScript){window.execScript(sourceCode);}else{window.eval(sourceCode);}}catch(e){var msg="Script at location '"+location+"' could not be loaded. "+"Exception: "+e.message;logger.error(msg);throw new Error(msg);}};signature(load,"undefined",["undefined","string"]);method(CERNY,"load",load);function loadData(location){eval("var obj = "+CERNY.getResource(location));return obj;}
signature(loadData,"any","string");method(CERNY,"loadData",loadData);function getResource(location){var request=new XMLHttpRequest();request.open("GET",location,false);request.send(null);if(request.status>=400){throw new Error("HTTP status code: "+request.status+" "+request.statusText);}
return request.responseText;};signature(getResource,"string","string");if(!CERNY.getResource){method(CERNY,"getResource",getResource);}
function Dictionary(obj){obj.logger=CERNY.Logger("CERNY.Dictionary");method(obj,"lookup",lookup);method(obj,"evaluate",evaluate);processInclude(obj);return obj;};signature(Dictionary,"object","object");CERNY.Dictionary=Dictionary;function lookup(term){var value=this[term];if(isString(value)){return this.evaluate(value,term);}else{throw new Error("Term '"+term+"' could not be found in this dictionary.");}};signature(lookup,["undefined","string"],"string");function evaluate(str,context){var subTerms=str.match(/{.*?}/g),subTerm,subTermStr;if(subTerms){for(var i=0;i<subTerms.length;i++){subTerm=subTerms[i].substring(1,subTerms[i].length-1);if(context&&context===subTerm){continue;}
subTermStr=this.lookup(subTerm);while(str.indexOf(subTerm)>=0){str=str.replace("{"+subTerm+"}",subTermStr);}}}
return str;}
signature(evaluate,"string","string",["undefined","string"]);function processInclude(dictionary){var include=dictionary.include;if(include){for(var i=0;i<include.length;i++){eval("var inclDict = "+CERNY.getResource(dictionary.evaluate(include[i])));copyTerms(dictionary,inclDict);Dictionary(inclDict);copyTerms(inclDict,dictionary);}}}
function copyTerms(source,destination){for(var term in source){if(isString(source[term])&&typeof destination[term]==="undefined"){destination[term]=source[term];}}}
CERNY.Catalog=Dictionary(CERNY.Configuration.Catalog);CERNY.require("CERNY");CERNY.namespace("event");CERNY.namespace("http");CERNY.namespace("js");CERNY.namespace("js.doc");CERNY.namespace("json");CERNY.namespace("text");})();function isAlien(a){return isObject(a)&&typeof a.constructor!='function';}
function isArray(a){return isObject(a)&&a.constructor==Array;}
function isBoolean(a){return typeof a=='boolean';}
function isFunction(a){return typeof a=='function';}
function isNull(a){return typeof a=='object'&&!a;}
function isNumber(a){return typeof a=='number'&&isFinite(a);}
function isObject(a){return(a&&typeof a=='object')||isFunction(a);}
function isString(a){return typeof a=='string';}
function isUndefined(a){return typeof a=='undefined';}
function isRegexp(a){return isObject(a)&&a.constructor==RegExp;}
function isDate(a){return isObject(a)&&a.constructor==Date;}
CERNY.Glossary={"Appender":"A function used for log output. It must take one string parameter.","Fulfilling a predicate":"An object or value is said to fulfill a predicate, if it returns true on application.","Interception":"Method call interception. A programming technique to allow separation of concerns.","Predicate":"A function which takes an argument and returns true or false.","Script":"A file containing JavaScript code."};CERNY.References={"DCP":{title:"Prototypal Inheritance in JavaScript",author:"Douglas Crockford",uri:"http://javascript.crockford.com/prototypal.html"},"DCR":{title:"Remedial JavaScript",author:"Douglas Crockford",uri:"http://javascript.crockford.com/remedial.html"},"JSO":{title:"Introducing JSON",author:"Douglas Crockford",uri:"http://www.json.org/"},"RHI":{title:"Rhino: JavaScript for Java",uri:"http://www.mozilla.org/rhino/"},"YUI":{title:"The YUI library",uri:"http://sourceforge.net/projects/yui"}};