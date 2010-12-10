/**
 * Filename    : rhino.js
 * Author      : Robert Cerny
 * Created     : 2006-11-04
 * Last Change : 2007-12-07
 *
 * Description:
 *   This script sets up Cerny.js to work with rhino. It needs to be
 *   loaded just before cerny.js and after rhino.conf.js, which also
 *   resides in this package.
 *
 * History:
 *   2006-11-04 Created.
 */

// CERNY.require("CERNY.runtime.rhino");

// The funtion readFile is defined in the rhino shell, but not in
// embedded rhino.
if (typeof readFile == "undefined") {
    function readFile(filename) {
        var reader = new java.io.BufferedReader(new java.io.FileReader(filename));
        var content = "";
        var line = null;
        while ((line = reader.readLine()) !== null) {
            content += line + "\n";
        }
        return content;
    }
}

(function () {

    /**
     * Overwriting CERNY.load to simple read a file from the file
     * system, which is no problem on the Rhino shell.
     */
    function load(filename) {
        eval(readFile(filename));
    };
    CERNY.method(CERNY, "load", load);

})();
