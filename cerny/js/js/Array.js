/**
 * Filename    : Array.js
 * Author      : Robert Cerny
 * Created     : 2006-07-26
 * Last Change : 2007-12-08
 *
 * Description:
 *   Some useful methods for the Array prototype.
 *
 * History:
 *   2007-12-08 Fixed boundaries bug in insertAt.
 *   2007-11-20 Removed the check for function of parameter cmpFunc in indexOf.
 *   2007-08-16 Removed returns the index of the item that is removed.
 *   2007-08-14 Added sortedInsert.
 *   2007-08-10 Added insertAt.
 *   2007-06-27 Added equals.
 *   2007-06-19 Corrected signature of contains.
 *   2007-05-17 Using short names for method and signature.
 *   2007-05-09 Modified append to accept null and undefined.
 *   2007-05-03 Refactored.
 *   2007-03-15 Added signatures.
 *   2007-01-06 Added interception.
 *   2006-12-09 Fixed bug in contains.
 *   2006-12-08 Fixed bug in append.
 *   2006-07-26 Created.
 */

CERNY.require("CERNY.js.Array");

(function() {

    var check = CERNY.check;
    var method = CERNY.method;
    var pre = CERNY.pre;
    var signature = CERNY.signature;

    CERNY.js.Array = {};

    Array.prototype.logger = CERNY.Logger("CERNY.js.Array");

    /**
     * Map an array onto another array based on func.
     *
     * func - the function that should be applied to all elements of this
     *        array
     * return - an array of the results of the applications of func to the
     *          items of this array
     */
    function map(func) {
        var result = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
            result[i] = func(this[i]);
        }
        return result;
    };
    signature(map, Array, "function");
    method(Array.prototype, "map", map);

    /**
     * Append array to this array.
     *
     * array - the array to append
     */
    function append(array) {
        if (array) {
            for (var i = 0; i < array.length; i += 1) {
                this.push(array[i]);
            }
        }
    };
    signature(append, "undefined", ["null", "undefined", Array]);
    method(Array.prototype, "append", append);

    if (!Array.prototype.push) {
        Array.prototype.push = function() {
            for (var i = 0; i < arguments.length; i++) {
                this[this.length] = arguments[i];
            }
            return this.length;
        };
    }

    /**
     * Filter this array through predicate.
     *
     * predicate - the predicate to apply to all items of array
     * return - a new array containing all items that return true on application of predicate
     */
    function filter(predicate) {
        var result = [];
        for (var i = 0; i < this.length; i += 1) {
            if (predicate(this[i])){
                result.push(this[i]);
            }
        }
        return result;
    };
    signature(filter, Array, "function");
    method(Array.prototype, "filter", filter);

    /**
     * Copy this array.
     *
     * return - a copy of this array
     */
    function copy() {
        return this.filter(function() {return true; });
    };
    signature(copy, Array);
    method(Array.prototype, "copy", copy);

    /**
     * Figure out the index of item in array based on cmpFunc.
     *
     * item - the item to look for in this array
     * cmpFunc - the function to use to decide on identity
     * return - the index of the position of item in this array or -1, if
     *          item is not in this array.
     */
    function indexOf(item, cmpFunc) {
        if (!cmpFunc) {
            cmpFunc = function (a, b) { return a == b; };
        }
        for (var i = 0; i < this.length; i++) {
            if (cmpFunc(this[i], item)) return i;
        }
        return -1;
    };
    signature(indexOf, "number", "any", ["undefined", "function"]);
    method(Array.prototype, "indexOf", indexOf);

    /**
     * Figure out whether item is contained in this array.
     *
     * item - the item to look for in this array
     * cmpFunc - the function to use to decide on identity
     * return - true if x is in this array, false otherwise
     */
    function contains(item, cmpFunc) {
        var i = this.indexOf(item, cmpFunc);
        if (i >= 0 ) {
            return true;
        }
        return false;
    }
    signature(contains, "boolean", "any", ["undefined", "function"]);
    method(Array.prototype, "contains", contains);

    /**
     * Remove item from this array.
     *
     * item - the item to remove
     * cmpFunc - the function to use to decide on identity
     * return - the index of the position the item was located
     */
    function remove(item, cmpFunc) {
        var i = this.indexOf(item, cmpFunc);
        if (i >= 0 ) {
            this.splice(i,1);
        }
        return i;
    };
    signature(remove, "number", "any", ["undefined", "function"]);
    method(Array.prototype, "remove", remove);

    /**
     * Replace an item in an array.
     *
     * replaced - the item to be replaced
     * replacing - the item to take the position of the replaced
     * cmpFunc - the function to use to decide on identity
     */
    function replace(replaced, replacing, cmpFunc) {
        var i = this.indexOf(replaced, cmpFunc);
        if (i < 0) {
            this.push(replacing);
        } else {
            this.splice(i, 1, replacing);
        }
    };
    signature(replace, "undefined", "any", "any", ["undefined", "function"]);
    method(Array.prototype, "replace", replace);

    /**
     * Figure out whether array is a sub array of this array based on
     * cmpFunc. Order is insignificant.
     *
     * array - the array that is checked whether it's a sub array
     * cmpFunc - the function to use to decide on identity
     * return - true, if there is no item in array that is not in this
     *          array, false otherwise
     */
    function isSubArray(array, cmpFunc) {
        for (var i = 0; i < this.length; i++) {
            if (array.indexOf(this[i], cmpFunc) < 0) {
                return false;
            }
        }
        return true;
    };
    signature(isSubArray, "boolean", Array, ["undefined", "function"]);
    method(Array.prototype, "isSubArray", isSubArray);

    /**
     * Figure out whether two arrays are equal based on cmpFunc. Order
     * is significant.
     *
     * array - the array to compare this array with
     * cmpFunc - the function to use to decide on identity
     * return - true, if this array is equal to to array, otherwise false
     */
    function equals(array, cmpFunc) {
        if (this.length != array.length) {
            return false;
        }
        for (var i = 0; i < this.length; i++) {
            if (array.indexOf(this[i], cmpFunc) != i) {
                return false;
            }
        }
        return true;
    }
    signature(equals, "boolean", Array, ["undefined", "function"]);
    method(Array.prototype, "equals", equals);

    /**
     * Insert an item at a certain position in the array.
     *
     * index - the index of the position to insert the item at
     * item - the item to insert
     */
    function insertAt(index, item) {

        // Calculate the number of items that have to move.
        var moverCount = this.length - index;

        // Is the index within the current boundaries?
        if (moverCount > 0) {

            // Yes, splice the number of items to move, insert the new
            // one and append the movers.
            this.append(this.splice(index, moverCount, item));
        } else {

            // No, just put it there.
            this[index] = item;
        }
    }
    signature(insertAt, "undefined", "number", "any");
    method(Array.prototype, "insertAt", insertAt);
    pre(insertAt, function(index, item) {
        check(index >= 0, "index must be bigger than or equal to 0.");
    });

    /**
     * Gets the insertion index of an item into this array, depending on the
     * passed comperator.
     *
     * item - the item to insert
     * comperator - the comperator to use for compare items with
     *
     */
    function getInsertionIndex(item, comperator) {
        var i = 0;
        var l = this.length;
        while (comperator(this[i], item) < 1 && i < l) {
            i += 1;
        }
        return i;
    }
    signature(getInsertionIndex, "number", "any", "function");
    method(Array.prototype, "getInsertionIndex", getInsertionIndex);

    /**
     * Performs an insert of an item into this array, depending on the
     * comperator.
     *
     * item - the item to insert
     * comperator - the comperator to use for compare items with
     */
    function sortedInsert(item, comperator) {
        this.insertAt(this.getInsertionIndex(item, comperator), item);
    }
    signature(sortedInsert, "number", "any", "function");
    method(Array.prototype, "sortedInsert", sortedInsert);

}) ();
