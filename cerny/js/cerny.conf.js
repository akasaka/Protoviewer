/**
 * Filename    : cerny.conf.js
 * Author      : Robert Cerny
 * Created     : 2007-01-03
 * Last Change : 2007-12-09
 *
 * Description:
 *   This is the configuration file for the Cerny.js JavaScript
 *   library. It must be provided to the JavaScript enginge before the
 *   cerny.js file. In a browser environment this means, that the
 *   script tag for the configuration must be included in the HTML
 *   page *before* the cerny.js tag.
 *
 *   The configuration consits of one object CERNY.Configuration and
 *   one function CERNY.configure. The function will be called in
 *   cerny.js. This function call is named the configuration
 *   cut. Everything before that is not affected by the effects of
 *   configure. This means e.g. that interception is not available
 *   before the cut.
 *
 *   This file should not be used in place, but rather be copied in the
 *   context (e.g. the scripts dir in your application) and modified
 *   there.
 */

if (typeof CERNY != 'object') {
    CERNY = {};
}

CERNY.Configuration = {
    Logger: {

        // The indent string for logging. For logging to a HTML
        // document "&nbsp;&nbsp;" might be appropriate.
        "indentStr": "  ",

        // The root category takes effect if there is no level specified
        // for the category or any parent category of a logger. If ROOT
        // is not present, those loggers are set to "OFF".
        "ROOT": "FATAL",

        // The top category of the Cerny.js library
        "CERNY": "FATAL",

        // We want to be informed about dependencies that cannot be
        // resolved and why this is.
        "CERNY.require": "FATAL",
        "CERNY.load": "ERROR",

        // Some examples
        "CERNY.schema": "OFF",
        "CERNY.schema.validate": "OFF",
        "CERNY.schema.validateConstraint": "OFF",

        // The category NONE is used as a base for loggers which are
        // forced onto objects with some intercepted functions, but do
        // not have a Logger stored in the member "logger".
        "NONE": "TRACE"
    },

    // The catalog is use to resolve dependencies, which are stated in
    // a script by the means of CERNY.require.
    Catalog: {
        "include":["{cerny.js.path}/catalog.json"],
        "cerny.js.path": "{configure-manually}"
    },
    Interception: {
        active: []
    }
};

/**
 * Configure the Cerny.js lib. Takes effect only after the
 * configuration cut (call of this function in cerny.js).
 */
CERNY.configure = function() {

    // Define the interceptors of your choice
    // var interceptors = CERNY.Configuration.Interception.active;
    // interceptors.push(CERNY.Interceptors.LogIndenter);
    // interceptors.push(CERNY.Interceptors.Tracer);
    // interceptors.push(CERNY.Interceptors.TypeChecker);
    // interceptors.push(CERNY.Interceptors.ContractChecker);
    // interceptors.push(CERNY.Interceptors.Profiler);

    // Redefine the log layout. The default is copied here from
    // cerny.js. Modify to match your requirements.
    // CERNY.Logger.layout = function(date, levelName, indentStr, message, loggerName) {
    //     return date.getTime() + ", " + levelName + ": " + indentStr + message + " | " + loggerName;
    // };

    // Redefine the log appenders. The default is [CERNY.print]. An
    // appender is a function taking one string parameter, the message
    // to be logged.
    // CERNY.Logger.appenders = [];
}

/**
 * Print a message. This function is the primary channel of
 * communication of the library and user of the library.
 *
 * message - the message to be printed
 */
CERNY.print = function(message) {

    // Very annoying, use a conosle instead
    // alert(message);

    // PopupWindow console
    // CERNY.console.PopupWindow.print(message);

    // DomElement console
    // CERNY.console.DomElement.print(message);

    // JsUnit
    // debug(message);

    // Rhino
    // print(message);
}
//CERNY.signature(CERNY.print, "undefined", "string");
