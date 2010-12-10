<![CDATA[
/**
 * Filename    : bootstrap.js
 * Author      : Robert Cerny
 * Created     : 2007-11-17
 * Last Change : 2007-12-08
 *
 * Description:
 *   This script provides access to the features of Cerny.js when
 *   using JavaScript (Rhino) with Ant. In order to work it needs two
 *   Ant properties set:
 *    cerny.js.configuration - the filename to a cerny.conf.js
 *    cerny.js.dir - the directory where cerny.js resides
 *
 * History:
 *   2007-11-17 Created.
 */

// CERNY.require("CERNY.ant.bootstrap");

/**
 * Read a file.
 *
 * filename - the filename of the file
 * return - the content of the file
 */
function readFile(filename) {
    var reader = new java.io.BufferedReader(new java.io.FileReader(filename));
    var content = "";
    var line = null;
    while ((line = reader.readLine()) !== null) {
        content += line + "\n";
    }
    return content;
}
// signature(readFile, "string", "string");

var t = this;

/**
 * Load a script.
 *
 * filename - the filename of the script
 */
function load(filename) {

    // The following is complicated, but therefore it works. The
    // simple eval(script) did not provide global functions defined in
    // script outside of the script. Since there a few of those
    // (isString, isNumber, ...), the loading procedure has to look
    // like this.
    var script = readFile(filename);
    var cx = Packages.org.mozilla.javascript.Context.enter();
    cx.evaluateString(t, script, "<" + filename + ">", 1, null);
};
// signature(load, "undefined", "string");

var cernyjsConfiguration = project.getProperty("cerny.js.configuration");
if (!cernyjsConfiguration) {
    throw "The property 'cerny.js.configuration' must point to a valid configuration of the Cerny.js lib.";
}

var cernyjsDir = project.getProperty("cerny.js.dir");
if (!cernyjsDir) {
    throw "The property 'cerny.js.dir' must point to the directory of the Cerny.js lib.";
}

load(cernyjsConfiguration);
load(cernyjsDir + "/js/runtime/rhino.conf.js");
load(cernyjsDir + "/js/cerny.js");
CERNY.method(CERNY, "load", load);
]]>
