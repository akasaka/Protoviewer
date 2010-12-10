/**
 * Filename    : Number.js
 * Author      : Robert Cerny
 * Created     : 2006-07-02
 * Last Change : 2007-05-17
 *
 * Description:
 *   Some useful methods for the Number prototype providing number
 *   formatting and parsing.
 *
 * History:
 *   2007-05-17 Using short names for method and signature.
 *   2007-05-03 Refactored.
 *   2007-03-15 Added signatures.
 *   2007-01-06 Added interception.
 *   2006-07-02 Created.
 */

CERNY.require("CERNY.js.Number",
              "CERNY.js.Array",
              "CERNY.js.String");

(function () {

    var method = CERNY.method;
    var signature = CERNY.signature;

    CERNY.js.Number = {};

    Number.prototype.logger = CERNY.Logger("CERNY.js.Number");
    Number.logger = CERNY.Logger("CERNY.js.Number");

    /**
     * Format this number according to format.
     *
     * format - the format in which to format this number
     * return - a string containing the number formatted in format
     */
    function format(format) {
        var matches = this.toString().match(/(\d+)(.(\d+))?/);
        var integer = matches[1];
        var fraction = matches[3];

        // The formatted integer part
        var integerF = "";
        if (integer) {
            if (format.digits.grouping === null) {
                integerF = integer;
            } else {
                if (integer.length <= format.digits.grouping) {
                    integerF = integer;
                } else {
                    var intArray = [];
                    var intDigits = integer.split("").reverse();
                    var i = 0;
                    intDigits.map(function(_digit) {
                        intArray.push(_digit);
                        if (((i + 1) % format.digits.grouping) === 0 &&
                            (i + 1) != intDigits.length) {
                            intArray.push(format.separators.grouping);
                        }
                        i += 1;
                    });
                    integerF = intArray.reverse().join("");
                }
            }
        }

        // The formatted fraction part
        var fractionF = "";
        if (fraction) {
            if (format.digits.fraction === null) {
                fractionF = fraction;
            } else {
                if (fraction.length == format.digits.fraction) {
                    fractionF = fraction;
                } else if (fraction.length > format.digits.fraction) {
                    // TODO: Rounding
                    fractionF = fraction.substr(0, format.digits.fraction);
                } else {
                    fractionF = fraction;
                }
            }
        }

        if (format.digits.fraction) {
            fractionF = fractionF.pad("0", format.digits.fraction, false);
        }

        // Put the two together
        var r = integerF;
        if (fractionF != "") {
            r += format.separators.decimal + fractionF;
        }
        return r;
    };
    signature(format, "string", "object");
    method(Number.prototype, "format", format);


    /**
     * Parse a number out of a numStr based on the the formats provided.
     * If there there is more than one matches the first format is applied
     * to parse the numStr.
     *
     * numStr - the numStr to parse
     * formats - a NumberFormat or an array of NumberFormats
     * return - if the numStr can be parsed, a number is returned
     *          otherwise null is returned
     */
    function parse(numStr, formats) {
        if (!isArray(formats) && isObject(formats) && formats.regexp) {
            formats = [formats];
        }

        var match = null;

        var i = 0;
        while (i < formats.length && !match) {
            match = numStr.match(formats[i].regexp);
            if (match === null) {
                i += 1;
            }
        }

        if (match) {
            var format = formats[i];
            return format.parse(numStr);
        }
        return null;
    };
    signature(parse, ["number", "null"], "string", "object");
    method(Number, "_parse", parse);

})();
