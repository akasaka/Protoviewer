/**
 * Filename    : DateFormat.js
 * Author      : Robert Cerny
 * Created     : 2006-07-02
 * Last Change : 2007-10-22
 *
 * Description:
 *   This script provides a constructor to produce date formats. The
 *   constructor has attached some popular date formats.
 *
 * History:
 *   2007-10-22 Added ISO1.
 *   2007-05-17 Refactored.
 *   2007-03-15 Added signatures.
 *   2007-03-09 Removed the new in the DataFormat creations.
 *   2006-07-02 Created.
 */

CERNY.require("CERNY.text.DateFormat",
              "CERNY.util");

(function() {

    var cutNumber = CERNY.util.cutNumber;
    var fillNumber = CERNY.util.fillNumber;
    var identity = CERNY.identity;
    var signature = CERNY.signature;

    CERNY.text.DateFormat = DateFormat;

    /**
     * Create a date format.
     *
     * regexp - the regular expression defining the date format
     * return - an object representing the date format
     */
    function DateFormat(regexp) {
        var self = CERNY.object();
        self.regexp = regexp;
        self.separator = "";
        self.positions = {day: 1,
                          month: 2,
                          year: 3};
        self.formatters =  {day: identity,
                            month: identity,
                            year: identity};
        self.century = 20;
        return self;
    };
    signature(DateFormat, "object", RegExp);

    function cutLast2(x) {
        return cutNumber(x, 2);
    };

    var formatters1 = {day: fillNumber, month: fillNumber, year: identity};
    var formatters2 = {day: fillNumber, month: fillNumber, year: cutLast2};
    var formatters3 = {day: identity, month: identity, year: cutLast2};

    // 15.07.2006
    DateFormat.DE = DateFormat(/(\d\d)\.(\d\d)\.(\d\d\d\d)/);
    DateFormat.DE.separator = ".";
    DateFormat.DE.formatters = formatters1;

    // 15.07.06
    DateFormat.DE1 = DateFormat(/(\d\d).(\d\d).(\d\d)/);
    DateFormat.DE1.separator = ".";
    DateFormat.DE1.formatters = formatters2;

    // 15072006
    DateFormat.DE2 = DateFormat(/(\d\d)(\d\d)(\d\d\d\d)/);
    DateFormat.DE2.formatters = formatters1;

    // 150706
    DateFormat.DE3 = DateFormat(/(\d\d)(\d\d)(\d\d)/);
    DateFormat.DE3.formatters = formatters2;

    // 15.7.2006
    DateFormat.DE4 = DateFormat(/(\d\d?)\.(\d\d?)\.(\d\d\d\d)/);
    DateFormat.DE4.separator = ".";

    // 15.7.06
    DateFormat.DE5 = DateFormat(/(\d\d?)\.(\d\d?)\.(\d\d)/);
    DateFormat.DE5.separator = ".";
    DateFormat.DE5.formatters = formatters3;

    var positionsUS = {month: 1, day: 2, year: 3};

    // 07/15/2006
    DateFormat.US = DateFormat(/(\d\d)\/(\d\d)\/(\d\d\d\d)/);
    DateFormat.US.separator = "/";
    DateFormat.US.positions = positionsUS;
    DateFormat.US.formatters = formatters1;

    // 07/15/06
    DateFormat.US1 = DateFormat(/(\d\d)\/(\d\d)\/(\d\d)/);
    DateFormat.US1.separator = "/";
    DateFormat.US1.positions = positionsUS;
    DateFormat.US1.formatters = formatters2;

    // 07152006
    DateFormat.US2 = DateFormat(/(\d\d)(\d\d)(\d\d\d\d)/);
    DateFormat.US2.positions = positionsUS;
    DateFormat.US2.formatters = formatters1;

    // 071506
    DateFormat.US3 = DateFormat(/(\d\d)(\d\d)(\d\d)/);
    DateFormat.US3.positions = positionsUS;
    DateFormat.US3.formatters = formatters2;

    // 7/15/2006
    DateFormat.US4 = DateFormat(/(\d\d?)\/(\d\d?)\/(\d\d\d\d)/);
    DateFormat.US4.separator = "/";
    DateFormat.US4.positions = positionsUS;

    // 7/15/06
    DateFormat.US5 = DateFormat(/(\d\d?)\/(\d\d?)\/(\d\d)/);
    DateFormat.US5.separator = "/";
    DateFormat.US5.positions = positionsUS;
    DateFormat.US5.formatters = formatters3;

    var positionsISO = {year: 1, month: 2, day: 3 };

    // 2006-07-15
    DateFormat.ISO = DateFormat(/(\d\d\d\d)-(\d\d)-(\d\d)/);
    DateFormat.ISO.separator = "-";
    DateFormat.ISO.positions = positionsISO;
    DateFormat.ISO.formatters = formatters1;

    // 20060715
    DateFormat.ISO1 = DateFormat(/(\d\d\d\d)(\d\d)(\d\d)/);
    DateFormat.ISO1.positions = positionsISO;
    DateFormat.ISO1.formatters = formatters1;

})();
