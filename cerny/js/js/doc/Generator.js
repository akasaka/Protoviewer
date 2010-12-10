/**
 * Filename    : Generator.js
 * Author      : Robert Cerny
 * Created     : 2006-11-04
 * Last Change : 2007-12-08
 *
 * Description:
 *   Generates documentation for a single script. The
 *   documentation should adhere to the rules presented by example in
 *   this file.
 *
 * Usage:
 *   var jsDocGenerator = CERNY.js.doc.Generator();
 *   var sourceCodeDoc = jsDocGenerator.create(sourceCodeString);
 *
 * History:
 *   2007-12-08 Improved Unix newline handling and fixed some bugs.
 *   2007-05-17 Refactored.
 *   2006-11-04 Created.
 */

CERNY.require("CERNY.js.doc.Generator",
              "CERNY.js.String",
              "CERNY.js.Array",
              "CERNY.util");

(function () {

    var check = CERNY.check;
    var getNameFromFqName = CERNY.util.getNameFromFqName;
    var method = CERNY.method;
    var pre = CERNY.pre;
    var signature = CERNY.signature;

    var PRIVATE_COMMENT_START = "/" + "*";
    var PUBLIC_COMMENT_START = PRIVATE_COMMENT_START + "*";
    var NEWLINE_DOS = "\r\n";
    var NEWLINE_UNIX = "\n";

    CERNY.js.doc.Generator = Generator;
    var logger = CERNY.Logger("CERNY.js.doc.Generator");
    CERNY.js.doc.Generator.prototype.logger = logger;

    function Generator(source) {
        this.source = source;
        var t = this;
        this.signatures = new Cache(function(name) {
            return t.extractSignature(name);
        });

        this.methods = new Cache(function(name) {
            return t.extractMethod(name);
        });

        this.signatureDocumentations = new Cache(function(name) {
            return t.extractSignatureDocumentation(name);
        });

        this.functionComments = new Cache(function(name) {
            return t.extractFunctionComment(name);
        });

        this.fqName = this.extractFqName();

        return this;
    };

    /**
     * Create documentation for sourceCode.
     *
     * sourceCode - a string containing the source code to document
     * return - an object conforming to <code>CERNY.js.doc.Script</code>
     */
    function create() {
        var doc = {}, attr, value, matches, aspect;

        // The documentation pattern.
        // Is redefined here every time, because rhino seems to have a bug
        // with regular expressions.
        this.docPattern = {
            author: {regexp: new RegExp("author.*: +(.*)", "gmi")},
            creationDate: {regexp: new RegExp("created.*:\s*(.+)", "gmi")},
            modificationDate: {regexp: new RegExp("last change.*:\s*(.+)", "gmi")},
            documentation: {regexp: new RegExp("description:([\\w\\W]*?) \\* [a-zA-Z]", "mi")}
        };


        // Iterate over all attributes in the pattern.
        for (attr in this.docPattern) {
            logger.debug("attr: " + attr);

            if (this.docPattern.hasOwnProperty(attr)) {
                aspect = this.docPattern[attr];

                // Apply the regular expression
                matches = aspect.regexp.exec(this.source);
                logger.debug("matches: " + matches);
                if (matches) {
                    value = matches[1];
                    logger.debug("value: " + value);
                    doc[attr] = value;
                }
            }
        }

        doc.fqName = this.fqName;
        doc.name = getNameFromFqName(doc.fqName);
        doc.history = this.extractHistory();
        doc.uses = this.extractUses();
        doc.documentation = this.extractDocumentation();

        this.fqName = doc.fqName;
        doc.functions = this.extractFunctions();
        return doc;
    };
    signature(create, "object", "string");
    method(Generator.prototype, "create", create);

    /**
     * Extract the fully qualified function name of the script. It
     * depends on a CERNY.require statement, where the first parameter
     * is the name of the current script.
     *
     * return - the fully qualified name of the script
     */
    function extractFqName() {
        var match = this.source.match(/require\(\u0022(.*?)\u0022/);
        if (match === null) {
            throw new Error("Could not extract fully qualified name of script.");
        }
        return match[1];
    }
    signature(extractFqName, "string");
    method(Generator.prototype, "extractFqName", extractFqName);


    function extractDocumentation() {

        var docString = this.source.match(new RegExp("description:([\\w\\W]*?) \\* [a-zA-Z]", "mi"));
        if (!docString) {
            throw new Error("No documentation for script.");
        }
        docString = docString[1];

        var documentation =[];

        // Functions come with a leading start comment marker
        docString = docString.replace(new RegExp("/\\*", "g"), "");

        // Remove the leading comment markers
        docString = docString.replace(new RegExp(" \\*   ", "g"), "");

        // Split the paragraphs
        documentation = docString.split(new RegExp("\\*$", "m"));

        // Clean up the paragraphs
        documentation = documentation.map(function(doc) {
            return cleanMultilineDoc(doc);
        });

        // Documentation has unnecessary content at the end and the
        // beginning
        if (documentation[0] == "") {
            documentation.shift();
        }
        documentation.pop();
        return documentation;
    }
    signature(extractDocumentation, Array);
    method(Generator.prototype, "extractDocumentation", extractDocumentation);


    /**
     * Extract the function documentations from the source code.
     *
     * return - an array of objects conforming to <code>CERNY.js.doc.Function</code>
     */
    function extractFunctions() {
        var functions = this.discoverPublicFunctions().sort();
        var t = this;
        return functions.map(function(functionName) {
            return t.extractFunctionDocumentation(functionName);
        });
    }
    signature(extractFunctions, Array);
    method(Generator.prototype, "extractFunctions", extractFunctions);

    /**
     * Extract the history from the source code.
     * Cannot handle multiline entries yet.
     *
     * return - an array of <code>CERNY.js.doc.HistoryEntry</code>
     */
    function extractHistory() {
        var history = [];

        try {
            // Find the history
            var historyString = this.source.split("History:")[1].split("*/")[0];
            matches = historyString.match(new RegExp("([0-9]{4}-[0-9]{2}-[0-9]{2} .+)","gmi"));

            if (matches) {
                matches.map(function(match) {
                    var segments = match.match(new RegExp("([0-9]{4}-[0-9]{2}-[0-9]{2}) (.*)"));
                    var date = segments[1];
                    var entry = segments[2].trim();

                    history.push({date: date, entry: entry});
                });
            }
        } catch (e) {
            logger.warn("History was not extracted without error.");
        }

        return history;
    }
    signature(extractHistory, Array);
    method(Generator.prototype, "extractHistory", extractHistory);

    /**
     * Extract the dependecies of the script.
     *
     * return - an array of expressions, that this file is dependant on
     */
    function extractUses() {

        var uses = [];

        // Find the require call
        var matches = this.source.match(new RegExp("^((CERNY\.)?require[^\\)]*)\\)", "gmi"));

        if (matches) {
            // Remove duplicate whitespace from string
            var usesString = matches[0];
            usesString = usesString.replace(new RegExp("\\s+", "gm"), "");

            // Split by comma
            var segments = usesString.split(new RegExp(","));

            // The first segment is the require call and the requiring script, so we skip it
            segments.shift();

            // Clean up the segments
            uses = segments.map(function(segment) {
                return segment.replace(new RegExp("\"", "g"), "").replace(")", "");
            });
        }

        return uses;
    }
    signature(extractUses, Array);
    method(Generator.prototype, "extractUses", extractUses);

    /**
     * Discover the public functions in the source. A function is
     * public, if the comment starts with a slash followed by two
     * asterisks.
     *
     * return - an array of function names
     */
    function discoverPublicFunctions() {
        var functions = [];

        // Discover named functions
        var matches = this.source.match(/function \w+\(/gm);
        if (matches) {
            functions = matches.map(function(match) {
                return match.replace("function ", "").replace("(","");
            });
        }

        // Discover anonymous functions assigned to a variable
        matches = this.source.match(/[\w.]+\ = function\(/gm);
        if (matches) {
            functions.append(matches.map(function(match) {
                return match.replace(" = function(", "");
            }));
        }

        var t = this;
        functions = functions.filter(function(f) {
            return t.isPublic(f);
        });

        return functions;
    }
    signature(discoverPublicFunctions, Array);
    method(Generator.prototype, "discoverPublicFunctions", discoverPublicFunctions);

    function isPublic(name) {
        if (this.functionComments.get(name)) {
            return true;
        }
        return false;
    }
    signature(isPublic, "boolean", "string");
    method(Generator.prototype, "isPublic", isPublic);

    /**
     * Extract the documentation for a function.
     *
     * name - the name (short or fq) of the function
     * return - the function documentation, conforming to
     *          <code>CERNY.js.doc.Function</code>
     */
    function extractFunctionDocumentation(name) {
        var doc = {};

        if (name.match(/\./)) {
            doc.fqName = name;
            doc.name = getNameFromFqName(name);
        } else {
            doc.fqName = this.fqName + "." + name;
            doc.name = name;
        }
        doc.documentation = this.extractFunctionDescription(name);

        // Parameters
        doc.parameters = [];
        var i = 0;
        var paramDoc;
        do {
            paramDoc = this.extractParameterDocumentation(name, i);
            if (paramDoc) {
                doc.parameters.push(paramDoc);
                i++;
            }
        } while (paramDoc);

        // Return values
        var returnValueDoc = this.extractReturnValueDocumentation(name);
        if (returnValueDoc) {
            doc.returnValue = returnValueDoc.documentation;
            doc.returnType = returnValueDoc.type;
        }
        return doc;
    }
    signature(extractFunctionDocumentation, "object", "string");
    pre(extractFunctionDocumentation, function() {
        check(isNonEmptyString(this.fqName), "fqName must be a non empty string.");
    });
    method(Generator.prototype, "extractFunctionDocumentation", extractFunctionDocumentation);

    /**
     * Extract the description for a function. The description are all
     * paragraphs from the function comment excluding the signature
     * documentation.
     *
     * functionName - the name of the function for which to extract
     *                the description for
     * return - the description of the function
     */
    function extractFunctionDescription(functionName) {
        var comment = this.functionComments.get(functionName);

        var documentation = splitCommentIntoParagraphs(comment);

        if (documentation.length == 0) {
            throw new Error("Function description not found for: " + functionName);
        }

        documentation.shift();

        // Remove the last one, if it's the signature documentation
        var lastOne = documentation.pop();
        if (lastOne.match(" - ") === null) {
            documentation.push(lastOne);
        }

        // Clean up the paragraphs
        documentation = documentation.map(function(doc) {
            return cleanMultilineDoc(doc).trim();
        });
        documentation = documentation.filter(isNonEmptyString);

        return documentation;
    }
    signature(extractFunctionDescription, Array, "string");
    pre(extractFunctionDescription, function(functionName) {
        check(this.isPublic(functionName), "function must be public");
    });
    method(Generator.prototype, "extractFunctionDescription", extractFunctionDescription);


    /**
     * Extract the documentation for a parameter.
     *
     * functionName - the name of the function the parameter belongs to
     * position - the position of the parameter
     * return - a parameter documentation conforming to <code>CERNY.js.doc.Parameter</code>
     */
    function extractParameterDocumentation(functionName, position) {
        var documentation = this.signatureDocumentations.get(functionName);
        if (!documentation) {
            return;
        }

        var positionOfLastParameter = documentation.length - 1;

        // Is there a return value in the signature documentation
        if (documentation.returnValue === true) {
            positionOfLastParameter -= 1;
        }

        // The signature documentation holds also the return value
        if (position > positionOfLastParameter) {
            return;
        }
        var signature = this.signatures.get(functionName);
        if (!signature) {
            throw new Error("No signature present for: " + functionName);
        }

        var doc = {};
        doc.name = documentation[position].name;
        doc.documentation = documentation[position].documentation;
        doc.type = signature[position + 1];
        return doc;
    }
    signature(extractParameterDocumentation, "object", "string", "number");
    pre(extractParameterDocumentation, function(functionName, position) {
        check(position >= 0, "Position must be positive");
    });
    method(Generator.prototype, "extractParameterDocumentation", extractParameterDocumentation);

    /**
     * Extract return value documentation.
     *
     * functionName - the name of the function the return value belongs to
     * return - a return value documentation
     */
    function extractReturnValueDocumentation(functionName) {
        var documentation = this.signatureDocumentations.get(functionName);
        if (!documentation) {
            return;
        }

        var signature = this.signatures.get(functionName);

        var doc = {};
        if (documentation[documentation.length - 1].name == "return") {
            doc.documentation = documentation[documentation.length - 1].documentation;
            doc.type = signature[0];
            return doc;
        }
    }
    signature(extractReturnValueDocumentation, "undefined,object", "string");
    method(Generator.prototype, "extractReturnValueDocumentation", extractReturnValueDocumentation);

    /**
     * Extract the signature for a function. The line might start with
     * signature or CERNY.signature.
     *
     * functionName - the name of the function the signature belongs to
     * return - an array of strings
     */
    function extractSignature(functionName) {

        var signature;

        // Signature
        var signatureRegexp = "(CERNY\\.)?signature." + functionName + ",.*";
        signatureMatch = this.source.match(new RegExp(signatureRegexp, "gmi"));
        if (signatureMatch) {
            signatureLine = signatureMatch[0];
            var typeMatches = signatureLine.match(new RegExp(",[^,]+", "g"));
            signature = [];
            var inArray = false;
            var compoundTypeName = "";
            typeMatches.map(function(typeMatch) {
                    var typeName = typeMatch.replace(/[^A-Za-z.]/g, "");
                    if (typeMatch.indexOf("[") >= 0) {
                        inArray = true;
                    }
                    if (typeMatch.indexOf("]") >= 0) {
                        inArray = false;
                        compoundTypeName += "," + typeName;

                        // Remove the first comma
                        typeName = compoundTypeName.slice(1);
                        compoundTypeName = "";
                    }
                    if (inArray) {
                        compoundTypeName += "," + typeName;
                    } else {
                        signature.push(typeName);
                    }
                });
        }
        return signature;
    }
    signature(extractSignature, ["undefined", Array], "string");
    method(Generator.prototype, "extractSignature", extractSignature);

    /**
     * Extract the ...
     *
     * functionName - the name of the function
     * return - an object ...
     */
    function extractMethod(functionName) {

        var method;

        // Signature
        var methodRegexp = "(CERNY\\.)?method\\(.*" + functionName + "\\)";
        methodMatch = this.source.match(new RegExp(methodRegexp, "gmi"));
        if (methodMatch) {
            methodLine = methodMatch[0];

            methodLine = methodLine.split("(")[1];

            var params = methodLine.split(",");
            method = {
                object: params[0],
                name: params[1].replace(/\"/g, "").trim()
            }

        }
        return method;
    }
    signature(extractMethod, "object", "string");
    method(Generator.prototype, "extractMethod", extractMethod);

    /**
     * Extract the signature documentation for a certain function.
     *
     * functionName - the name of the function
     * return - an array of objects holding <code>name</code> and
     *          <code>documentation</code>
     */
    function extractSignatureDocumentation(functionName) {
        var doc = [];
        var comment = this.functionComments.get(functionName);
        var paragraphs = splitCommentIntoParagraphs(comment);
        var signatureDoc = paragraphs[paragraphs.length - 1];

        // Is there a signature documentation?
        var matches = signatureDoc.match(/ - /gm);
        if (matches === null) {
            return;
        }
        var expected = matches.length;

        // Split it into lines
        var lines = signatureDoc.split(NEWLINE_DOS);
        if (lines.length == 1 && expected > 1) {
            lines = signatureDoc.split(NEWLINE_UNIX);
        }
        var next = {};
        lines.map(function(line) {
            if (line.match(new RegExp(" - "))) {
                if (next.name) {
                    doc.push(next);
                    next = {};
                }
                var parts = line.split(" - ");
                next.name = cleanMultilineDoc(parts[0]);
                next.documentation = cleanMultilineDoc(parts[1]);
            } else {
                if (line.match(/\w/)) {
                    next.documentation += " " + cleanMultilineDoc(line);
                }
            }
        });
        doc.push(next);
        if (next.name == "return") {
            doc.returnValue = true;
        }
        return doc;
    }
    signature(extractSignatureDocumentation, ["undefined", Array], "string");
    method(Generator.prototype, "extractSignatureDocumentation", extractSignatureDocumentation);

    /**
     * Extract the function comment for a function, in case it is
     * public (starts with a slash followed by two asterisks).
     *
     * functionName - the name of the function to extract the comment for
     * return - the comment of the function
     */
    function extractFunctionComment(functionName) {

        // Split up the sourcecode in two parts at the defintion of
        // the function. Accept named and anonymous functions.
        var sourceSplit = this.source.split(new RegExp("function " + functionName + "\\("));
        if (sourceSplit.length != 2) {
            sourceSplit = this.source.split(new RegExp(functionName + " = function"));
            if (sourceSplit.length != 2) {
                throw new Error("Function definition not found for: " + functionName);
            }
        }

        // Slice the first part into pieces at the occurrences of the
        // public comment start string. Consider the last slice to be
        // the comment of our function.
        var before = sourceSplit[0];
        var comments = before.split(PUBLIC_COMMENT_START);
        var comment = PUBLIC_COMMENT_START + comments.pop();

        // Return the comment if it is indeed public
        if (isPublicComment(comment)) {
            // Clean up the end of the comment
            comment = comment.replace(/\*\/[^°]*/m, "*/");
            return comment;
        }
    }
    signature(extractFunctionComment, ["undefined", String], "string");
    method(Generator.prototype, "extractFunctionComment", extractFunctionComment);

    function isPublicComment(str) {
        if (str.match(new RegExp(NEWLINE_DOS  + NEWLINE_DOS))) {
            return false;
        }
        if (str.match(new RegExp(NEWLINE_UNIX  + NEWLINE_UNIX))) {
            return false;
        }
        if (str.match(/function \w+\(/)) {
            return false;
        }
        return true;
    }
    signature(isPublicComment, "boolean", "string");

    function cleanMultilineDoc(doc) {
        return doc.replace(/\r?\n/g, " ").replace(/ \* /g, " ").replace(/ +/g, " ").replace(/^ /, "").replace(/ $/, "").replace(/\*\//, "");
    }
    // signature(cleanMultilineDoc, "string", "string");

    function splitCommentIntoParagraphs(comment) {

        // Split the paragraphs DOS line endings
        var paragraphs = comment.split("*\r\n");
        if (paragraphs.length < 2) {

            // Try unix line endings
            paragraphs = comment.split("*\n");
        }
        return paragraphs;
    }
    signature(splitCommentIntoParagraphs, Array, "string");

    function Cache(retrieveFunction) {
        this.store = {};
        this.retrieveFunction = retrieveFunction;
    }
    Cache.prototype.logger = CERNY.Logger("CERNY.js.doc.Generator.Cache");

    function get(name) {
        if (!this.store[name]) {
            var result = this.retrieveFunction(name);
            this.store[name] = result;
        }
        return this.store[name];
    }
    method(Cache.prototype, "get", get);

}) ();
