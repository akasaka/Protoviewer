/**
 * Filename    : console.js
 * Author      : Robert Cerny
 * Created     : 2007-03-30
 * Last Change : 2007-09-14
 *
 * Description:
 *   Package script for console concept in Cerny.js. Every console
 *   exposes a method print and allows the user of Cerny.js access to
 *   vital information when programming, most important log messages.
 *
 *   In a browser environment, a style sheet is available to color
 *   code log messages according to their level. The stylesheet is
 *   found in <code>css/console.css</code>.
 *
 * History:
 *   2007-03-30 Created.
 */

// CERNY.require("CERNY.console");

CERNY = {
    console: {
        styleRules: [
            {match: "FATAL:",
             cssClass: "fatal"},
            {match: "ERROR:",
             cssClass: "error"},
            {match: "WARN :",
             cssClass: "warn"},
            {match: "INFO :",
             cssClass: "info"},
            {match: "DEBUG:",
             cssClass: "debug"},
            {match: "TRACE:",
             cssClass: "trace"}
        ],
        getCssClass: function(message) {
            for (var i = 0; i < this.styleRules.length; i++) {
                var styleRule = this.styleRules[i];
                if (typeof styleRule.match == "string") {
                    if (message && message.indexOf(styleRule.match) >= 0) {
                        return styleRule.cssClass;
                    }
                }
            }
            return "";
        }
    }
}

// CERNY.signature(CERNY.console.getCssClass, "string", "string");
