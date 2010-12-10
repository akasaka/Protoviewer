// (c) 2006-2008 Robert Cerny
CERNY.require("CERNY.event.Observable","CERNY.js.Array");(function(){var check=CERNY.check;var method=CERNY.method;var signature=CERNY.signature;var pre=CERNY.pre;var logger=CERNY.Logger("CERNY.event.Observable");function Observable(obj){method(obj,"addObserver",addObserver);method(obj,"removeObserver",removeObserver);method(obj,"removeObservers",removeObservers);method(obj,"notify",notify);}
signature(Observable,"undefined","object");method(CERNY.event,"Observable",Observable);pre(Observable,function(obj){check(!obj._observableObservers,"Observable cannot be called on object with observers.");});function addObserver(event,observer){if(!this._observableObservers){this._observableObservers={};}
if(!this._observableObservers[event]){this._observableObservers[event]=[];}
this._observableObservers[event].push(observer);}
signature(addObserver,"undefined","string","function");function removeObserver(event,observer){if(this._observableObservers[event]){this._observableObservers[event].remove(observer);}}
signature(removeObserver,"undefined","string","function");function removeObservers(event){if(event){delete(this._observableObservers[event]);}else{delete(this._observableObservers);}}
signature(removeObservers,"undefined",["undefined","string"]);function notify(event){var args=[];for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}
if(this._observableObservers&&this._observableObservers[event]){this._observableObservers[event].map(function(observer){observer.apply(null,args);});}}
signature(notify,"undefined","string","any");})();