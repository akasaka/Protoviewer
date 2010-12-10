/**
 * Filename    : GenerateDoc.js
 * Author      : Robert Cerny
 * Created     : 2006-11-05
 * Last Change : 2007-12-08
 *
 * Description:
 *   GenerateDoc is an application for creating the library
 *   documentation in JSON format. It also writes out the catalog,
 *   which is a mapping from the main product of a script to the
 *   filename. The catalog is the base for dependency management.
 *
 * History:
 *   2007-12-04 Moved from rhino/js/doc to apps.
 *   2007-02-18 Complete refactoring.
 *   2006-11-05 Created.
 */

CERNY.require("CERNY.apps.GenerateDoc",
              "CERNY.apps",
              "CERNY.js.doc.Schema",
              "CERNY.js.Array",
              "CERNY.js.String",
              "CERNY.schema",
              "CERNY.util",
              "CERNY.js.doc.Generator",
              "CERNY.json.TextPrettyPrinter");

(function() {

    var Generator = CERNY.js.doc.Generator;
    var Script = CERNY.js.doc.Script;
    var TextPrettyPrinter = CERNY.json.TextPrettyPrinter;
    var getNameFromFqName = CERNY.util.getNameFromFqName;
    var isValid = CERNY.schema.isValid;
    var loadData = CERNY.loadData;
    var method = CERNY.method;
    var print = CERNY.print;
    var read = CERNY.apps.read;
    var write = CERNY.apps.write;
    var signature = CERNY.signature;
    var validate = CERNY.schema.validate;

    var logger = CERNY.Logger("CERNY.apps.GenerateDoc");

    var GenerateDoc = {};
    CERNY.apps.GenerateDoc = GenerateDoc;
    GenerateDoc.logger = logger;

    var packages = {};
    var catalog = {};
    var srcDirname = "";
    var destDirname = "";

    /**
     * Run the application. The argument array needs two strings:
     * 0 - the source directory of the library
     * 1 - the destination directory for writing the results
     *
     * args - an array of two strings
     */
    function main(args) {
        srcDirname = args[0];
        destDirname = args[1];

        logger.info("srcDirname: " + srcDirname);
        logger.info("destDirname: " + destDirname);

        var manifestFilename = srcDirname + "/manifest.json";
        var manifest = loadData(manifestFilename);

        var printer = TextPrettyPrinter(4);

        var library = {name: manifest.name,
                       namespace: manifest.namespace,
                       version: manifest.version,
                       packages: []
        };

        packages.getPackage = function(scriptName) {
            var packs = getPackage(scriptName);
            var packageName = packs.join(".");
            if (packageName == "") {
                packageName = manifest.namespace;
            } else {
                packageName = manifest.namespace + "." + packageName;
            }
            var packageUrl = packs.join("/");
            if (isUndefined(packages[packageName])) {
                packages[packageName] = {fqName: packageName,
                                         path: packageUrl,
                                         scripts: []
                };
            }
            return packages[packageName];
        };

        manifest.files.map(process);

        for (var name in packages) {
            library.packages.push(packages[name]);
        }

        write(destDirname + "/" + manifest.name + ".doc.json", TextPrettyPrinter().print(library));
        write(destDirname + "/" + manifest.name + ".catalog.json", TextPrettyPrinter().print(catalog));
    }
    signature(main, "undefined", Array);
    method(GenerateDoc, "main", main);

    // TODO: See if this can be replaced by CERNY.util.getNameFromFqName
    function getPackage(fqName) {
        var _package = fqName.split("\.");
        _package.pop();
        return _package;
    }

    function process(filename) {
        logger.info("filename: " + filename);

        var srcFilename = srcDirname + "/" + filename;
        var qualifiedScriptName = filename.replace(/\//g, ".").replace(/.js$/, "");
        var scriptName = getNameFromFqName(qualifiedScriptName);

        try {

            // Read the source file
            var source = readFile(srcFilename);
            if (!isNonEmptyString(source)) {
                throw new Error("Source code file not present or empty: '" + filename + "'");
            }

            var scriptDoc = new Generator(source).create();
            var validatationReport = validate(scriptDoc, Script);

            if (!isValid(validatationReport)) {
                print(printer.print(validatationReport));
            } else {
                if (scriptDoc.name != scriptName) {
                    logger.warn("Script name does not match filename. Using filename as script name: " + scriptName);
                    scriptDoc.name = scriptName;
                }
                var _package = packages.getPackage(qualifiedScriptName);
                if (!_package.mainScript) {
                    _package.mainScript = scriptDoc.name;
                }
                _package.scripts.push(scriptDoc);
            }

            // Update the catalog
            if (scriptDoc.fqName != "CERNY") {
                catalog[scriptDoc.fqName] = "{cerny.js.path}/" + filename;
            }

        } catch (e) {
            logger.error(e.message);
            throw e;
        }
    }

})();
