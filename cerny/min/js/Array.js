// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.js.Array");(function(){var check=CERNY.check;var method=CERNY.method;var pre=CERNY.pre;var signature=CERNY.signature;CERNY.js.Array={};Array.prototype.logger=CERNY.Logger("CERNY.js.Array");function map(func){var result=new Array(this.length);for(var i=0;i<this.length;i++){result[i]=func(this[i]);}
return result;};signature(map,Array,"function");method(Array.prototype,"map",map);function append(array){if(array){for(var i=0;i<array.length;i+=1){this.push(array[i]);}}};signature(append,"undefined",["null","undefined",Array]);method(Array.prototype,"append",append);if(!Array.prototype.push){Array.prototype.push=function(){for(var i=0;i<arguments.length;i++){this[this.length]=arguments[i];}
return this.length;};}
function filter(predicate){var result=[];for(var i=0;i<this.length;i+=1){if(predicate(this[i])){result.push(this[i]);}}
return result;};signature(filter,Array,"function");method(Array.prototype,"filter",filter);function copy(){return this.filter(function(){return true;});};signature(copy,Array);method(Array.prototype,"copy",copy);function indexOf(item,cmpFunc){if(!cmpFunc){cmpFunc=function(a,b){return a==b;};}
for(var i=0;i<this.length;i++){if(cmpFunc(this[i],item))return i;}
return-1;};signature(indexOf,"number","any",["undefined","function"]);method(Array.prototype,"indexOf",indexOf);function contains(item,cmpFunc){var i=this.indexOf(item,cmpFunc);if(i>=0){return true;}
return false;}
signature(contains,"boolean","any",["undefined","function"]);method(Array.prototype,"contains",contains);function remove(item,cmpFunc){var i=this.indexOf(item,cmpFunc);if(i>=0){this.splice(i,1);}
return i;};signature(remove,"number","any",["undefined","function"]);method(Array.prototype,"remove",remove);function replace(replaced,replacing,cmpFunc){var i=this.indexOf(replaced,cmpFunc);if(i<0){this.push(replacing);}else{this.splice(i,1,replacing);}};signature(replace,"undefined","any","any",["undefined","function"]);method(Array.prototype,"replace",replace);function isSubArray(array,cmpFunc){for(var i=0;i<this.length;i++){if(array.indexOf(this[i],cmpFunc)<0){return false;}}
return true;};signature(isSubArray,"boolean",Array,["undefined","function"]);method(Array.prototype,"isSubArray",isSubArray);function equals(array,cmpFunc){if(this.length!=array.length){return false;}
for(var i=0;i<this.length;i++){if(array.indexOf(this[i],cmpFunc)!=i){return false;}}
return true;}
signature(equals,"boolean",Array,["undefined","function"]);method(Array.prototype,"equals",equals);function insertAt(index,item){var moverCount=this.length-index;if(moverCount>0){this.append(this.splice(index,moverCount,item));}else{this[index]=item;}}
signature(insertAt,"undefined","number","any");method(Array.prototype,"insertAt",insertAt);pre(insertAt,function(index,item){check(index>=0,"index must be bigger than or equal to 0.");});function getInsertionIndex(item,comperator){var i=0;var l=this.length;while(comperator(this[i],item)<1&&i<l){i+=1;}
return i;}
signature(getInsertionIndex,"number","any","function");method(Array.prototype,"getInsertionIndex",getInsertionIndex);function sortedInsert(item,comperator){this.insertAt(this.getInsertionIndex(item,comperator),item);}
signature(sortedInsert,"number","any","function");method(Array.prototype,"sortedInsert",sortedInsert);})();