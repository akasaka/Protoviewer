/**
 * Filename    : Observable.js
 * Author      : Robert Cerny
 * Created     : 2007-06-13
 * Last Change : 2007-12-08
 *
 * Description:
 *   This script provides a function <code>Observable</code> to make
 *   an object call observers when events occur.
 *
 *   <code>Observable</code> should be called on the prototype of a
 *   constructor, but it can also be called on individual objects. The
 *   first option is preferable, because it is faster and only
 *   attaches the methods to the prototype and not to every single
 *   instance.
 *
 *   Observable attaches the methods <code>addObserver</code>,
 *   <code>removeObserver</code>, <code>removeObservers</code> and
 *   <code>notify</code> to the object.
 *
 *   On the first call to <code>addObserver</code> the object receives
 *   a property <code>_observableObservers</code>.
 *
 * History:
 *   2007-08-17 Added removeObservers.
 *   2007-06-13 Created.
 */

CERNY.require("CERNY.event.Observable",
              "CERNY.js.Array");

(function() {

    var check = CERNY.check;
    var method = CERNY.method;
    var signature = CERNY.signature;
    var pre = CERNY.pre;

    var logger = CERNY.Logger("CERNY.event.Observable");

    /**
     * Makes an object observable.
     *
     * obj - the object to make observable
     */
    function Observable(obj) {
        method(obj, "addObserver", addObserver);
        method(obj, "removeObserver", removeObserver);
        method(obj, "removeObservers", removeObservers);
        method(obj, "notify", notify);
    }
    signature(Observable, "undefined", "object");
    method(CERNY.event, "Observable", Observable);
    pre(Observable, function(obj) {
        check(!obj._observableObservers,
              "Observable cannot be called on object with observers.");
    });

    /**
     * Add an observer (a function) to to be called when event occurs.
     *
     * event - the event that is observed
     * observer - the function that should be called on the event
     */
    function addObserver(event, observer) {
        if (!this._observableObservers) {
            this._observableObservers = {};
        }
        if (!this._observableObservers[event]) {
            this._observableObservers[event] = [];
        }
        this._observableObservers[event].push(observer);
    }
    signature(addObserver, "undefined", "string", "function");

    /**
     * Remove an observer.
     *
     * event - the event that the observer observes
     * observer - the observer to be removed
     */
    function removeObserver(event, observer) {
        if (this._observableObservers[event]) {
            this._observableObservers[event].remove(observer);
        }
    }
    signature(removeObserver, "undefined", "string", "function");

    /**
     * Remove observers. If an event is passed, only observers of that
     * event will be removed. Otherwise all observers will be removed.
     *
     * event - the event for which observers should be removed
     */
    function removeObservers(event) {
        if (event) {
            delete(this._observableObservers[event]);
        } else {
            delete(this._observableObservers);
        }
    }
    signature(removeObservers, "undefined", ["undefined", "string"]);

    /**
     * Notify all observers of event.
     *
     * event - the event that occurs
     * arguments - arguments that will be passed to the observers
     */
    function notify(event) {
        var args = [];
        for (var i = 1; i < arguments.length; i++) {
            args[i-1] = arguments[i];
        }
        if (this._observableObservers && this._observableObservers[event]) {
            this._observableObservers[event].map(function(observer) {
                observer.apply(null, args);
            });
        }
    }
    signature(notify, "undefined", "string", "any");

})();
