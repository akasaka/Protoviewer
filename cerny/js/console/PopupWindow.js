/**
 * Filename    : PopupWindow.js
 * Author      : Robert Cerny
 * Created     : 2007-03-30
 * Last Change : 2007-12-08
 *
 * Description:
 *   The PopupWindow console prints to a popup window. It appears on
 *   the first call of print.
 *
 *   The user of the PopupWindow console has to
 *   <ul>
 *     <li>allow it's browser to open popup windows</li>
 *     <li>import the stylesheet css/console.css into the page</li>
 *   </ul>
 *
 *   Configuration of the PopupWindow console should be performed in
 *   <strong>your</strong> cerny.conf.js to avoid problems on
 *   upgrading Cerny.js.
 *
 * History:
 *   2007-05-22 Added event handler to console window to allow closing the window.
 *   2007-03-30 Created.
 */

// CERNY.require("CERNY.console.PopupWindow", "CERNY.console");

CERNY.console.PopupWindow =  {

    // Holds a reference to the popup window
    window: null,

    // The console is inited, once the init function was called no
    // matter if it was successful.
    inited: false,

    // The default configuration for the PopupWindow console. Can be
    // adjusted to your needs in *your* cerny.conf.js.
    Configuration: {
        Window: {
            openParameters: "height=600,width=800,resizable=yes,scrollbars=yes",
            name: "CERNY_JS_CONSOLE",
            title: "Cerny.js console"
        },
        Css: {
            location: "css/console.css"
        }
    },

    init: function() {
        if (!this.inited) {
            this.inited = true;

            var conf = this.Configuration;
            this.window = window.open('about:blank', conf.Window.name,  conf.Window.openParameters);
            this.window.document.write('<html><head><title>' + conf.Window.title + '</title>' +
                                       '<link rel="stylesheet" type="text/css" media="screen" href="' + conf.Css.location + '"/>' +
                                       '</head><body class="console"></body></html>');
            var t = this;
            this.window.onunload = function() {
                t.inited = false;
            }
            var currentOnunload = window.onunload;
            var f = function() {
                t.window.close();
                if (currentOnunload) {
                    return currentOnunload();
                }
            };
            window.onunload = f;
        }
    },

    clear: function() {
        // Not implemented yet
    }
};

/**
 * Print a message to the PopupWindow console.
 *
 * message - the message to print
 */
CERNY.console.PopupWindow.print = function(message) {
    this.init();
    if (this.window) {
        var cssClass = CERNY.console.getCssClass(message);
        this.window.document.write("<p class='" + cssClass + "'>" + message + "</p>");
    }
};
// CERNY.signature(CERNY.console.PopupWindow.print, "undefined", "string");
