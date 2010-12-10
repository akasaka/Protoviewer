/**
 * Filename    : NumberFormat.js
 * Author      : Robert Cerny
 * Created     : 2006-07-03
 * Last Change : 2007-05-19
 *
 * Description:
 *   This script provides a constructor to produce number formats. The
 *   constructor has attached some popular number formats.
 *
 * History:
 *   2007-05-17 Refactored.
 *   2007-03-23 Removed silly dependency to CERNY.text.
 *   2007-03-15 Added signatures.
 *   2006-07-03 Created.
 */

CERNY.require("CERNY.text.NumberFormat",
              "CERNY.util");

(function() {

    var signature = CERNY.signature;
    var escapeStrForRegexp = CERNY.util.escapeStrForRegexp;

    CERNY.text.NumberFormat = NumberFormat;

    /**
     * Create a number format.
     *
     * return - an object representing the number format
     */
    function NumberFormat() {
        var self = CERNY.object();
        self.separators = {grouping: "",
                           decimal: "," };
        self.digits = {grouping: null,
                       fraction: null };

        self.init = init;
        self.parse = parse;

        return self;
    };
    signature(NumberFormat, "object");

    function init() {
        var r = "";

        if (!this.digits.grouping) {
            r = "\\d+";
        } else {
            rFirstGroup = "\\d{1," + this.digits.grouping + "}";
            rOtherGroups = "\\d{" + this.digits.grouping + "}";
            r = rFirstGroup + "(" + escapeStrForRegexp(this.separators.grouping) + rOtherGroups + ")*";
        }

        var decimalSeparator = escapeStrForRegexp(this.separators.decimal);
        if (!this.digits.fraction) {
            r = r + "(" + decimalSeparator + "\\d*)?";
        } else {
            r = r + decimalSeparator + "\\d{" + this.digits.fraction + "}";
        }

        this.regexp = new RegExp("^[+-]?" + r + "$");
    };

    /**
     * Parse a String into a number.
     *
     * numStr - the string to parse
     * _type - the type of the number ("Float" or "Int"); default is "Float"
     *
     */
    function parse(numStr, _type) {
        // If _type is invalid, set it to Float.
        _type = (_type == "Float" || _type == "Int") ? _type : "Float";

        var num = numStr;
        if (this.separators.grouping != "") {
            var regexp = escapeStrForRegexp(this.separators.grouping);
            num = num.replace(new RegExp(regexp, "g"), "");
        }

        var regexp = escapeStrForRegexp(this.separators.decimal);
        num = num.replace(new RegExp(regexp), ".");

        var func = "parse" + _type;

        return eval(func)(num);
    };
    signature(parse, "number", "string", "string");

    // 12232
    // 1234,56789
    NumberFormat.DE = NumberFormat();
    NumberFormat.DE.separators = {grouping: "", decimal: ","};
    NumberFormat.DE.init();

    // 13.001,32
    NumberFormat.DE1 = NumberFormat();
    NumberFormat.DE1.separators = {grouping: ".", decimal: ","};
    NumberFormat.DE1.digits = {grouping: 3, fraction: 2};
    NumberFormat.DE1.init();

    // 123212321,12
    NumberFormat.DE2 = NumberFormat();
    NumberFormat.DE2.separators = {grouping: ".", decimal: ","};
    NumberFormat.DE2.digits = {grouping: null, fraction: 2};
    NumberFormat.DE2.init();

})();
