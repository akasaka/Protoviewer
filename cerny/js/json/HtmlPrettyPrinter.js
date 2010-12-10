/**
 * Filename    : HtmlPrettyPrinter.js
 * Author      : Robert Cerny
 * Created     : 2006-10-30
 * Last Change : 2007-05-17
 *
 * Description:
 *   Prettyprints a JavaScript Object for display in HTML. Creates a
 *   div with class json and put names and null in spans with
 *   according class attributes.
 *
 * Example:
 *   var printer = CERNY.json.HtmlPrettyPrinter();
 *   var prettyJsonHtml = printer.print(myObject);
 *
 * History:
 *   2007-05-17 Refactored.
 *   2007-03-21 Added interception and signature.
 *   2006-10-30 Inital release
 */

CERNY.require("CERNY.json.HtmlPrettyPrinter",
              "CERNY.json.TextPrettyPrinter",
              "CERNY.json.Printer");

(function() {

    var Printer = CERNY.json.Printer;
    var TextPrettyPrinter = CERNY.json.TextPrettyPrinter;
    var method = CERNY.method;
    var signature = CERNY.signature;

    CERNY.json.HtmlPrettyPrinter = HtmlPrettyPrinter;

    function HtmlPrettyPrinter(indentIncrease, obj) {

        var self = TextPrettyPrinter(indentIncrease, obj);
        self.logger = CERNY.Logger("CERNY.json.HtmlPrettyPrinter");

        method(self, "print", print);
        method(self, "startName", startName);
        method(self, "endName", endName);
        method(self, "printNull", printNull);

        return self;
    };

    function print(object) {
        // TODO: Refactor this when the inheritance mechanism is incorporated.
        return '<div class="json">' + Printer.print.call(this, object) + '</div>';
    };
    signature(print, "string", "object");

    function startName(str) {
        return '<span class="name">' + str;
    };
    signature(startName, "string", "string");

    function endName(str) {
        return str + '</span>';
    };
    signature(endName, "string", "string");

    function printNull(str) {
        return '<span class="null">' + str + '</span>';
    };
    signature(printNull, "string", "string");

})();
