/**
 * Filename    : DomElement.js
 * Author      : Robert Cerny
 * Created     : 2007-03-31
 * Last Change : 2007-04-06
 *
 * Description:
 *   The DomElement console prints to an element inside a HTML page.
 *
 *   The user of the DomElement console has to
 *   <ul>
 *     <li>
 *       provide an element with id 'console' (can be configured) in
 *       the page. The element can be of any type that can hold
 *       paragraphs. A div is most common.
 *     </li>
 *     <li>
 *       import the stylesheet css/console.css into the page.
 *     </li>
 *   </ul>
 *
 *   Configuration of the DomElement console should be performed in
 *   <strong>your</strong> cerny.conf.js to avoid problems on
 *   upgrading Cerny.js.
 *
 * History:
 *   2007-03-31 Created.
 */

// CERNY.require("CERNY.console.DomElement", "CERNY.console");

CERNY.console.DomElement =  {

    // Holds the DOM element that is the container for the print
    // messages
    element: null,

    // The console is inited, once the init function was called no
    // matter if it was successful.
    inited: false,

    // The default configuration for the DomElement console. Can be
    // adjusted to your needs in *your* cerny.conf.js.
    Configuration: {
        Element: {

            // The id of the element
            id: "console",

            // The css class the element will receive, if set to null
            // no changes to the class attribute of the element will
            // be made
            cssClass: "console"
        }
    },

    init: function() {
        if (!this.inited) {
            this.inited = true;

            var id = this.Configuration.Element.id;
            this.element = document.getElementById(id);

            if (!this.element) {
                alert("Failed to create DomElement console, " +
                      "because document misses element with id '" + id  + "'!");
                this.corrupt = true;
            } else {
                // Set the css class if present
                var cssClass = this.Configuration.Element.cssClass;
                if (cssClass) {
                    this.element.className = cssClass;
                }
            }
        }
    }
};

CERNY.console.DomElement.clear = function() {
    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }
};
// CERNY.signature(CERNY.console.DomElement.clear, "undefined");

/**
 * Print a message to the DomElement console.
 *
 * message - the message to print
 */
CERNY.console.DomElement.print = function(message) {
    this.init();
    if (this.element) {
        var p = document.createElement("p");
        p.innerHTML = message;
        p.className = CERNY.console.getCssClass(message);
        this.element.appendChild(p);
    }
};
// CERNY.signature(CERNY.console.DomElement.print, "undefined", "string");
