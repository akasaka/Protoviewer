/**
 * Filename    : util.js
 * Author      : Robert Cerny
 * Created     : 2006-11-12
 * Last Change : 2007-12-08
 *
 * Description:
 *   Some general purpose utility functions.
 *
 * History:
 *   2007-06-15 Added compare, createComparator.
 *   2007-05-17 Refactored.
 *   2007-04-30 Added getUriParameterValue
 *   2007-03-20 Corrected signature of CERNY.util.indent.
 *   2007-03-15 Added signatures.
 *   2007-02-23 Fixed bug in CERNY.parseUri (Result of "dev/".split(/\//) differs in IE and Firefox).
 *   2007-02-23 Added logger to CERNY.util.
 *   2007-02-19 Added getNameFromFqName.
 *   2007-02-09 Added parseUri.
 *   2006-11-12 Created.
 *
 */

CERNY.namespace("util");

CERNY.require("CERNY.util",
              "CERNY.js.Array",
              "CERNY.js.String");

(function() {

    var method = CERNY.method;
    var signature = CERNY.signature;

    var logger = CERNY.Logger("CERNY.util");
    CERNY.util.logger = logger;

    /**
     * Create an indentation string, a line feed followed by n spaces,
     * where n = indentation.
     *
     * indentation - the number of spaces to append to the line feed
     * return - a string
     */
    function indent(indentation) {
        var result = "\n";
        for (var i = 0; i < indentation; i++) {
            result += " ";
        }
        return result;
    };
    method(CERNY.util, "indent", indent);
    signature(indent, "string", "number");

    /**
     * Return (at least) two digit number as a String. If number smaller
     * than 10 return "0" + number.
     *
     * number - the number to fill
     * return - the filled number
     */
    function fillNumber(number) {
        var str = number.toString();
        return str.pad("0", 2);
    };
    method(CERNY.util, "fillNumber", fillNumber);
    signature(fillNumber, "string", "number");


    /**
     * Return the last n digits from the decimal String representation
     * of number.
     *
     * number - the number to get the digits from
     * n - how many digits to get
     * return - the last n digits
     */
    function cutNumber(number, size) {
        var str = "" + number.toString();
        return str.slice(str.length - size, str.length);
    };
    method(CERNY.util, "cutNumber", cutNumber);
    signature(cutNumber, "string", "number", "number");


    function escapeStrForRegexp(str) {
        if (str == ".") {
            return '\\' + str;
        }
        return str;
    };
    method(CERNY.util, "escapeStrForRegexp", escapeStrForRegexp);
    signature(escapeStrForRegexp, "string", "string");

    /**
     * Parses an URI into its components.
     *
     * Right now it cannot handle:
     *    "mailto:mduerst@ifi.unizh.ch"
     *    "news:comp.infosystems.www.servers.unix"
     *
     * uri - the uri to parse
     * return - an object containing the parts of the uri
     */
    function parseUri(uri) {

        // This regular expression is defined in RFC 2396 Appendix
        // B. Every slash in the original regexp was escaped by a
        // backslash. Furthermore it was surrounded by slash.
        var r = new RegExp(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
        var m = r.exec(uri);

        var ensure = function (_str) {
            return _str != null ? _str : "";
        }

        var i = {};
        i.scheme = ensure(m[2]);
        i.authority = ensure(m[4]);
        i.path = ensure(m[5]);
        i.query = ensure(m[7]);
        i.fragment = ensure(m[9]);

        // The authority
        var ra = new RegExp(/^(([^@]+)@)?([^:]+)(:([0-9]*))?/);
        var ma = ra.exec(i.authority);

        if (ma) {
            i.userinfo = ensure(ma[2]);
            i.host = ensure(ma[3]);
            i.port = ensure(ma[5]);
        }

        // The path segments
        i.path_segments = i.path.replace(/^\//, "").split("/");

        return i;
    };
    method(CERNY.util, "parseUri", parseUri);
    signature(parseUri, "object", "string");


    /**
     * Return the short name from a fully qualified name.
     *
     * fqName - the fully qualified name
     * return - the short name
     */
    function getNameFromFqName(fqName) {
        var lastSegment = fqName.split("\.").pop();
        if (lastSegment.indexOf("_") >= 0) {
            lastSegment = lastSegment.split("_").pop();
        }
        return lastSegment;
    }
    method(CERNY.util, "getUriParameterValue", getUriParameterValue);
    signature(getNameFromFqName, "string", "string");


    /**
     * Return the value of a paramter passed in the query part of an URL.
     *
     * parameter - the name of the parameter
     * url - the url to look in, if undefined the url of the current document
     */
    function getUriParameterValue(parameter, url) {
        if (!url) {
            url = document.URL;
        }

        var regex = "/.*" + parameter + "=([^&]*).*/";
        var match = new RegExp(eval(regex)).exec(url);
        if (match != null && match[1] != null) {
            return decodeURIComponent(match[1]);
        } else {
            return null;
        }
    }
    method(CERNY.util, "getNameFromFqName", getNameFromFqName);
    signature(getUriParameterValue, ["null","string"], ["string"], ["string", "undefined"]);


    /*
     * Returns -1, if a is smaller than b.
     * Returns 0, if a is equal to b.
     * Returns 1, if a is bigger than b.
     */
    function compare(a, b) {
        if (a == b) return 0;
        if (a > b) return 1;
        return -1;
    }
    method(CERNY.util, "compare", compare);
    signature(compare, "number", "any", "any");

    /**
     * Create a compare function, that allows sorting according to an
     * arbitrary order.
     *
     * order - the arbitrary order, an array of numbers
     * compare - the compare function, default is natural order
     * return - the comparator
     */
    function createComparator(order, compare) {

        if (!compare) {
            compare = CERNY.util.compare;
        }

        return function(a, b) {
            var indexA = order.indexOf(a);
            var indexB = order.indexOf(b);
            if (indexA < 0) {
                if (indexB < 0) {
                    return compare(a, b);
                }
                return 1;
            }
            if (indexB < 0) {
                return -1;
            }
            return compare(indexA, indexB);
        }
    }
    method(CERNY.util, "createComparator", createComparator);
    signature(createComparator, "function", Array, ["undefined", "function"]);

})();
