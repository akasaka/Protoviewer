// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.json.Printer","Object.toJSONString");(function(){var method=CERNY.method;var signature=CERNY.signature;CERNY.json.Printer=Printer;CERNY.json.Printer.print=print;function Printer(obj){var self=CERNY.object(obj);self.logger=CERNY.Logger("CERNY.json.Printer");self.STATES={START:"START",OBJECT:{OBJECT:"OBJECT",NAME:"NAME",VALUE:{VALUE:"VALUE",STRING:{STRING:"STRING",ESCAPED:"ESCAPED"}}},ARRAY:"ARRAY"};self.separator="";method(self,"print",print);method(self,"startName",concat);method(self,"endName",concat);method(self,"startArray",concat);method(self,"endArray",concat);method(self,"startObject",concat);method(self,"endObject",concat);method(self,"startValue",concat);method(self,"endValue",concat);method(self,"printNull",concat);return self;};function concat(str){return str;};signature(concat,"string","string");function print(object){this.indent=0;this.state=[this.STATES.START];this.state.current=function(){return this[this.length-1];};var t=this;var state=t.state;var STATES=t.STATES;var rest=object.toJSONString(),token,result="";while(rest.length>0){token=rest.substr(0,1);if(state.current()==STATES.OBJECT.VALUE.STRING.ESCAPED){result+=token;state.pop();}else{switch(token){case'{':switch(state.current()){case STATES.OBJECT.VALUE.STRING.STRING:result+=token;break;default:result+=t.startObject(token);state.push(STATES.OBJECT.OBJECT);}
break;case'}':switch(state.current()){case STATES.OBJECT.VALUE.STRING.STRING:result+=token;break;default:result+=t.endObject(token);state.pop();state.pop();}
break;case'[':result+=t.startArray(token);state.push(STATES.ARRAY);break;case']':result+=t.endArray(token);state.pop();break;case':':if(state.current()===STATES.OBJECT.OBJECT){result+=t.startValue(token);state.push(STATES.OBJECT.VALUE.VALUE);}else{result+=token;}
break;case',':switch(state.current()){case STATES.OBJECT.VALUE.VALUE:result+=t.endValue(token);state.pop();break;default:result+=token;}
break;case"\\":switch(state.current()){case STATES.OBJECT.VALUE.STRING.STRING:result+=token;state.push(STATES.OBJECT.VALUE.STRING.ESCAPED);break;default:result+=token;}
break;case'"':switch(state.current()){case STATES.OBJECT.OBJECT:result+=t.startName(token);state.push(STATES.OBJECT.NAME);break;case STATES.OBJECT.NAME:result+=t.endName(token);state.pop();break;case STATES.OBJECT.VALUE.VALUE:result+=token;state.push(STATES.OBJECT.VALUE.STRING.STRING);break;case STATES.OBJECT.VALUE.STRING.STRING:result+=token;state.pop();break;default:result+=token;}
break;default:this.logger.debug("token: "+token);result+=token;}}
rest=rest.substr(1,rest.length);}
return result;};signature(print,"string","object");})();