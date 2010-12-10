/**
 * Filename    : Revertable.js
 * Author      : Robert Cerny
 * Created     : 2007-08-03
 * Last Change : 2007-12-09
 *
 * Description:
 *   This script provides a function <code>Revertable</code> to make
 *   an object revertable. Given a list of properties and their types
 *   (optional), it creates getters and setters for these
 *   properties. These setters will notify observers, whether the
 *   instance has been changed or reverted. Thus a Revertable is
 *   always an Observable.
 *
 *   Revertable should be called on the prototype of a constructor,
 *   see <code>Observable</code> for more information.
 *
 *   The object receives the methods <code>set</code>,
 *   <code>get</code>, <code>commit</code>, <code>revert</code> and
 *   <code>hasChanged</code>. <code>set</code> and <code>get</code>
 *   are called by the setters respectively getters, but can also be
 *   called directly.
 *
 *   The object will receive the property
 *   <code>_revertableProperties</code> on calling Revertable. On the
 *   first setter call, it will additionally receive the properties
 *   <code>_revertableChangeCount</code> and
 *   <code>_revertableOriginal</code>.
 *
 *   Provided type information, the setters and getters will receive a
 *   signature.
 *
 * History:
 *   2007-10-30 Changed order of notification and setting in set.
 *   2007-08-03 Created.
 */

CERNY.require("CERNY.event.Revertable",
              "CERNY.event.Observable",
              "CERNY.js.Array");

(function() {

    var check = CERNY.check;
    var method = CERNY.method;
    var signature = CERNY.signature;
    var pre = CERNY.pre;

    var Observable = CERNY.event.Observable;

    var name = "CERNY.event.Revertable";
    var logger = CERNY.Logger(name);

    /**
     * Event signalling that the object has changed.
     */
    var EVT_CHANGE = name + ".change";

    /**
     * Event signalling that the object has reverted to its original
     * state.
     */
    var EVT_REVERT = name + ".revert";

    /**
     * Makes an object revertable.
     *
     * The object will be able to keep track of its changed status,
     * given that properties are set with the provided set method.
     *
     * The properties which are of interest and contribute to the
     * identity of the object must be passed to this function.
     *
     * On setting values by the means of set the object will announce
     * the events Revertable.EVT_CHANGE and Revertable.EVT_REVERT.
     *
     * If type is ommited for a property by passing just the name of
     * the property in the properties array, no signature will be
     * defined on the getter and setter
     *
     * obj - the object to be made revertable
     * properties - an array of property names or objects with the
     *              properties 'name' and 'type'
     */
    function Revertable(obj, properties) {

        // A Revertable is an Observable!
        Observable(obj);

        method(obj, "set", set);
        method(obj, "get", get);
        method(obj, "commit", commit);
        method(obj, "revert", revert);
        method(obj, "hasChanged", hasChanged);

        // Allow just strings to be passed in as properties
        properties = properties.map(function(property) {
            if (isString(property)) {
                return {name: property};
            }
            return property;
        });

        if (obj._revertableProperties) {
            properties.append(obj._revertableProperties);
        }
        obj._revertableProperties = properties;
        createGetterAndSetters(obj);
    }
    signature(Revertable, "undefined", "object", Array);
    method(CERNY.event, "Revertable", Revertable);
    pre(Revertable, function(obj, properties) {
        check(!obj._revertableChangeCount || obj._revertableChangeCount > 0,
              "Revertable cannot be called on changed objects.");
    });

    CERNY.event.Revertable.EVT_CHANGE = EVT_CHANGE;
    CERNY.event.Revertable.EVT_REVERT = EVT_REVERT;

    /*
     * Initialize this object.
     */
    function init(t) {
        delete(t._revertableOriginal);
        t._revertableOriginal = {};
        t._revertableChangeCount = 0;
    }

    function set(name, value) {
        if (this[name] !== value) {
            var event = EVT_CHANGE;

            // First call of set?
            if (!this._revertableOriginal) {
                init(this);
            }

            // Has this property been touched before?
            if (this._revertableOriginal[name]) {

                // Yes!
                // Is the new value the same as the original?
                if (value === this._revertableOriginal[name]) {

                    // Yes!
                    delete(this._revertableOriginal[name]);
                    this._revertableChangeCount -= 1;
                    if (this._revertableChangeCount === 0) {
                        event = EVT_REVERT;
                    }
                }
            } else {

                // No, the property has not been touched yet!
                // Store the original value and increase the change
                // count.
                this._revertableOriginal[name] = this[name];
                this._revertableChangeCount += 1;
            }

            // Set the value
            this[name] = value;

            // Notify observers of the event
            this.notify(event);
        }
    }
    signature(set, "undefined", "string", "any");
    pre(set, function(name, value) {
        check(this._revertableProperties.contains({name: name}, propertyComperator),
              "the property '" + name + "' is not revertable");
    });

    function get(name) {
        return this[name];
    }
    signature(get, "any", "string");

    /**
     * Commit the object. The current state becomes the original state.
     */
    function commit() {
        init(this);
    }
    signature(commit, "undefined");

    /**
     * Revert the object to its orignial state.
     *
     */
    function revert() {
        var t = this;
        this._revertableProperties.map(function(property) {
            var name = property.name;
            if (t._revertableOriginal.hasOwnProperty(name)) {
                t[name] = t._revertableOriginal[name];
            }
        });
        init(this);
    }
    signature(revert, "undefined");

    /**
     * Determine, if this object has changed.
     *
     * return - true, if the object has changed, false otherwise
     */
    function hasChanged() {
        return this._revertableChangeCount > 0;
    }
    signature(hasChanged, "boolean");

    function createGetterAndSetters(obj) {

        obj._revertableProperties.map(function(property) {

            // Figure out the name of the getter and setter
            var name = capitalize(property.name);
            var setterName = "set" + name;
            var getterName = "get";
            if (property.type === "boolean" || property.type === Boolean) {
                getterName = "is";
            }
            getterName += name;

            // Define the getter and setter function
            function getter() {
                return this[property];
            }
            function setter(value) {
                this.set(property.name, value);
            }

            // Define a signature, if the property comes with a type
            if (property.type) {
                signature(getter, property.type);
                signature(setter, "undefined", property.type);
            }

            // Attach the getter and setter to the object
            method(obj, getterName, getter);
            method(obj, setterName, setter);
        });
    }

    function cap(str) {
        return str.substring(0,1).toUpperCase() + str.substring(1);
    }

    function capitalize(str) {
        var result = "";
        var segments = str.split("_");
        for (var i = 0; i < segments.length; i++) {
            result += cap(segments[i]);
        }
        return result;
    }

    function propertyComperator(a,b) {
        return a.name === b.name;
    }

})();
