/**
 * Filename    : rhino.conf.js
 * Author      : Robert Cerny
 * Created     : 2007-11-17
 * Last Change : 2007-11-17
 *
 * Description:
 *   Additional configuration of Cerny.js for rhino. Include this file
 *   after cerny.conf.js and before cerny.js.
 */

CERNY.print = function(message) {
    java.lang.System.out.println(message);
}

CERNY.getResource = function(location) {
    return readFile(location);
}
