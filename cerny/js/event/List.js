/**
 * Filename    : List.js
 * Author      : Robert Cerny
 * Created     : 2007-08-10
 * Last Change : 2007-12-09
 *
 * Description:
 *   This script offers an array augmentor which provides methodes to
 *   add and remove items which will notify observers of the
 *   respective event.
 *
 * History:
 *   2007-08-19 Added sortItems and EVT_REARRANGED.
 *   2007-08-10 Created.
 */

CERNY.require("CERNY.event.List",
              "CERNY.js.Array",
              "CERNY.event.Observable");

(function() {

    var Observable = CERNY.event.Observable;

    var method = CERNY.method;
    var signature = CERNY.signature;

    var name = "CERNY.event.List";
    var logger = CERNY.Logger(name);

    /**
     * Event signalling the addition of an item to the list. This
     * means the item was appended to the list.
     */
    var EVT_ITEM_ADDED = name + ".EVT_ITEM_ADDED";

    /**
     * Event signalling the insertion of an item somewhere in the
     * list. The somewhere is specified by the parameter.
     *
     * index - the index of the position where the item was inserted
     */
    var EVT_ITEM_INSERTED = name + ".EVT_ITEM_INSERTED";

    /**
     * Event signalling the removal of an item from the list.
     *
     * index - the index of the position where the item was removed
     */
    var EVT_ITEM_REMOVED = name + ".EVT_ITEM_REMOVED";

    /**
     * Event signalling that the list was rearranged. No item can be
     * assumed to have kept it's position. This event is fired when
     * the list is sorted.
     */
    var EVT_REARRANGED = name + ".EVT_REARRANGED";

    /**
     * Augments an array to signal events regarding its items.
     *
     * array - the array to augment to a List
     */
    function List(array) {

        // A List is an Observable!
        Observable(array);

        method(array, "addItem", addItem);
        method(array, "removeItem", removeItem);
        method(array, "insertItemAt", insertItemAt);
        method(array, "sortItems", sortItems);
    }
    signature(List, "undefined", Array);
    method(CERNY.event, "List", List);

    CERNY.event.List.EVT_ITEM_ADDED = EVT_ITEM_ADDED;
    CERNY.event.List.EVT_ITEM_INSERTED = EVT_ITEM_INSERTED;
    CERNY.event.List.EVT_ITEM_REMOVED = EVT_ITEM_REMOVED;
    CERNY.event.List.EVT_REARRANGED = EVT_REARRANGED;

    /**
     * Add an item to the end of the list. Notify observers of
     * EVT_ITEM_ADDED.
     *
     * item - the item to add
     */
    function addItem(item) {
        this.push(item);
        this.notify(EVT_ITEM_ADDED);
    }
    signature(addItem, "undefined", "any");

    /**
     * Remove an item from the list. Notify observers of
     * EVT_ITEM_REMOVED with the index of the remove item.
     *
     * item - the item to remove
     */
    function removeItem(item) {
        var index = this.remove(item);
        this.notify(EVT_ITEM_REMOVED, index);
    }
    signature(removeItem, "undefined", "any");

    /**
     * Insert an item at a specific position in the list. Notify
     * observers of EVT_ITEM_INSERTED with the index of the inserted
     * item.
     *
     * index - the index of the position at which to insert the item
     * item - the item to insert
     */
    function insertItemAt(index, item) {
        this.insertAt(index, item);
        this.notify(EVT_ITEM_INSERTED, index);
    }
    signature(insertItemAt, "number", "any");

    /**
     * Sort the items of the list according to a comparator. Notify
     * observers of EVT_REARRANGED.
     *
     * comperator - the comparator to use for sorting
     */
    function sortItems(comparator) {
        this.sort(comparator);
        this.notify(EVT_REARRANGED);
    }
    signature(sortItems, "undefined", "function");

})();
