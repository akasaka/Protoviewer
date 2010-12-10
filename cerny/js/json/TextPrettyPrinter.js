/**
 * Filename    : TextJsonPrettyPrinter.js
 * Author      : Robert Cerny
 * Created     : 2006-10-30
 * Last Change : 2007-05-17
 *
 * Description:
 *   Prettyprints a JavaScript object for better human understanding. It
 *   takes care of indentation.
 *
 * Usage:
 *   var printer = CERNY.json.TextPrettyPrinter();
 *   var prettyJsonStr = printer.print(myObject);
 *
 * History:
 *   2007-05-17 Refactored.
 *   2007-03-21 Added interception and signature.
 *   2006-10-30 Created.
 */

CERNY.require("CERNY.json.TextPrettyPrinter",
              "CERNY.json.Printer",
              "CERNY.util");

(function() {

    var Printer = CERNY.json.Printer;
    var identity = CERNY.identity;
    var indent = CERNY.util.indent;
    var method = CERNY.method;
    var signature = CERNY.signature;

    CERNY.json.TextPrettyPrinter = TextPrettyPrinter;

    function TextPrettyPrinter(indentIncrease, obj) {
        indentIncrease = indentIncrease || 4;

        var self = Printer(obj);
        self.logger = CERNY.Logger("CERNY.json.TextPrettyPrinter");
        self.indentIncrease = indentIncrease;

        method(self, "startObject", startObject);
        method(self, "endObject", endObject);
        method(self, "endValue", endValue);

        return self;
    };

    function startObject(str) {
        if (this.state.current() === this.STATES.START) {
            return identity(str);
        } else {
            this.indent += this.indentIncrease;
            return indent(this.indent) + str;
        }
    };
    signature(startObject, "string", "string");

    function endObject(str) {
        this.indent -= this.indentIncrease;
        return identity(str);
    };
    signature(endObject, "string", "string");

    function endValue(str) {
        return str + indent(this.indent + 1);
    };
    signature(endValue, "string", "string");

})();
