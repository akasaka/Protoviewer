/**
 * Filename    : Date.js
 * Author      : Robert Cerny
 * Created     : 2006-07-02
 * Last Change : 2007-05-17
 *
 * Description:
 *   Some useful methods for the Date prototype providing date
 *   formatting and parsing.
 *
 * History:
 *   2007-05-17 Using short names for method and signature.
 *   2007-05-03 Refactored.
 *   2007-03-15 Added signatures.
 *   2007-01-06 Added interception.
 *   2006-07-02 Created.
 */

CERNY.require("CERNY.js.Date");

(function() {

    var method = CERNY.method;
    var signature = CERNY.signature;

    CERNY.js.Date = {};

    Date.prototype.logger = CERNY.Logger("CERNY.js.Date");

    Date.logger = CERNY.Logger("CERNY.js.Date");

    /**
     * Format this date according to format.
     *
     * format - the format in which to format this date
     * return - a string containing the date formatted in format
     */
    function format(format) {
        var dateStr = "<1>" + format.separator + "<2>" + format.separator + "<3>";
        var year = this.getFullYear();
        var month = this.getMonth() + 1;
        var day = this.getDate();

        dateStr = dateStr.replace("<" + format.positions.year + ">", format.formatters.year(year));
        dateStr = dateStr.replace("<" + format.positions.month + ">", format.formatters.month(month));
        dateStr = dateStr.replace("<" + format.positions.day + ">", format.formatters.day(day));
        return dateStr;
    }
    signature(format, "string", "object");
    method(Date.prototype, "format", format);

    /**
     * Parse a date out of a dateStr based on the the formats provided.
     * If there there is more than one matches the first format is applied
     * to parse the dateStr.
     *
     * dateStr - the dateStr to parse
     * formats - a DateFormat or an array of DateFormats
     * return - if the dateStr can be parsed, a date is returned
     *          otherwise null is returned
     */
    function parse(dateStr, formats) {
        if (!isArray(formats) && isObject(formats) && formats.regexp) {
            formats = [formats];
        }

        var match = null;

        var i = 0;
        while (i < formats.length && !match) {
            match = dateStr.match(formats[i].regexp);
            if (match === null) {
                i += 1;
            }
        }

        if (match) {
            var format = formats[i];

            var year = match[format.positions.year];
            var month = match[format.positions.month];
            var day = match[format.positions.day];

            year = (year >= 100) ? year : "" + format.century + year;

            var date = new Date(year, month - 1, day);

            var aYear = date.getFullYear();
            var aMonth = date.getMonth();
            var aDay = date.getDay();

            if (year == date.getFullYear() &&
                month == date.getMonth() + 1 &&
                day == date.getDate()) {
                return date;
            }
        }
        return null;
    }
    signature(parse, ["null", Date], "string", "object");
    method(Date, "_parse", parse);

})();
