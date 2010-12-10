// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.event.Revertable","CERNY.event.Observable","CERNY.js.Array");(function(){var check=CERNY.check;var method=CERNY.method;var signature=CERNY.signature;var pre=CERNY.pre;var Observable=CERNY.event.Observable;var name="CERNY.event.Revertable";var logger=CERNY.Logger(name);var EVT_CHANGE=name+".change";var EVT_REVERT=name+".revert";function Revertable(obj,properties){Observable(obj);method(obj,"set",set);method(obj,"get",get);method(obj,"commit",commit);method(obj,"revert",revert);method(obj,"hasChanged",hasChanged);properties=properties.map(function(property){if(isString(property)){return{name:property};}
return property;});if(obj._revertableProperties){properties.append(obj._revertableProperties);}
obj._revertableProperties=properties;createGetterAndSetters(obj);}
signature(Revertable,"undefined","object",Array);method(CERNY.event,"Revertable",Revertable);pre(Revertable,function(obj,properties){check(!obj._revertableChangeCount||obj._revertableChangeCount>0,"Revertable cannot be called on changed objects.");});CERNY.event.Revertable.EVT_CHANGE=EVT_CHANGE;CERNY.event.Revertable.EVT_REVERT=EVT_REVERT;function init(t){delete(t._revertableOriginal);t._revertableOriginal={};t._revertableChangeCount=0;}
function set(name,value){if(this[name]!==value){var event=EVT_CHANGE;if(!this._revertableOriginal){init(this);}
if(this._revertableOriginal[name]){if(value===this._revertableOriginal[name]){delete(this._revertableOriginal[name]);this._revertableChangeCount-=1;if(this._revertableChangeCount===0){event=EVT_REVERT;}}}else{this._revertableOriginal[name]=this[name];this._revertableChangeCount+=1;}
this[name]=value;this.notify(event);}}
signature(set,"undefined","string","any");pre(set,function(name,value){check(this._revertableProperties.contains({name:name},propertyComperator),"the property '"+name+"' is not revertable");});function get(name){return this[name];}
signature(get,"any","string");function commit(){init(this);}
signature(commit,"undefined");function revert(){var t=this;this._revertableProperties.map(function(property){var name=property.name;if(t._revertableOriginal.hasOwnProperty(name)){t[name]=t._revertableOriginal[name];}});init(this);}
signature(revert,"undefined");function hasChanged(){return this._revertableChangeCount>0;}
signature(hasChanged,"boolean");function createGetterAndSetters(obj){obj._revertableProperties.map(function(property){var name=capitalize(property.name);var setterName="set"+name;var getterName="get";if(property.type==="boolean"||property.type===Boolean){getterName="is";}
getterName+=name;function getter(){return this[property];}
function setter(value){this.set(property.name,value);}
if(property.type){signature(getter,property.type);signature(setter,"undefined",property.type);}
method(obj,getterName,getter);method(obj,setterName,setter);});}
function cap(str){return str.substring(0,1).toUpperCase()+str.substring(1);}
function capitalize(str){var result="";var segments=str.split("_");for(var i=0;i<segments.length;i++){result+=cap(segments[i]);}
return result;}
function propertyComperator(a,b){return a.name===b.name;}})();