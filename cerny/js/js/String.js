/**
 * Filename    : String.js
 * Author      : Robert Cerny
 * Created     : 2004-10-27
 * Last Change : 2007-05-17
 *
 * Description:
 *   Adds some useful methods for the String prototype.
 *
 * History:
 *   2007-05-17 Using short names for method and signature.
 *   2007-05-03 Refactored.
 *   2007-03-15 Added signatures.
 *   2007-01-06 Added interception.
 *   2007-01-05 Fixed bug in require statement.
 *   2004-10-27 Created.
 */

CERNY.require("CERNY.js.String");

(function() {

    var method = CERNY.method;
    var signature = CERNY.signature;

    CERNY.js.String = {};

    String.prototype.logger = CERNY.Logger("CERNY.js.String");

    function entityify() {
        return this.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g, "&gt;");
    }
    signature(entityify, "string");
    method(String.prototype, "entityify", entityify);

    function trim() {
        return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
    }
    signature(trim, "string");
    method(String.prototype, "trim", trim);

    /**
     * Pad a string.
     *
     * padChr - the character which should be used for padding
     * length - how many characters should the string have after padding
     * front - if true, padding is added before the string
     * return - the padded string
     */
    function pad(padChr, length, front) {
        padChr = padChr.substring(0,1);
        if (!isBoolean(front)) {
            front = true;
        }
        var padSize = length - this.length;
        if (padSize > 0) {
            var padStr = "";
            for (var i = 0; i < padSize; i++) {
                padStr += padChr;
            }
            if (front) {
                return padStr + this;
            }
            return this + padStr;
        }
        return "" + this;
    }
    signature(pad, "string", "string", "number", ["undefined", "boolean"]);
    method(String.prototype, "pad", pad);

})();

function isNonEmptyString(s) {
    return !isNull(s) && isString(s) && s.trim().length > 0;
}
