/**
 * Filename    : MergeCatalog.js
 * Author      : Robert Cerny
 * Created     : 2007-11-17
 * Last Change : 2007-12-09
 *
 * Description:
 *   MergeCatalog is an application that merges catalog files. It
 *   processes the includes in a catalog to generate one catalog.
 *
 * History:
 *   2007-11-17 Created.
 */

CERNY.require("CERNY.apps.MergeCatalog",
              "CERNY.json.TextPrettyPrinter",
              "CERNY.apps");

(function () {

    var read = CERNY.apps.read;
    var write = CERNY.apps.write;
    var method = CERNY.method;
    var signature = CERNY.signature;

    var logger = CERNY.Logger("CERNY.apps.MergeCatalog");

    var MergeCatalog = {};
    CERNY.apps.MergeCatalog = MergeCatalog;
    MergeCatalog.logger = logger;

    /**
     * Runs the application. The argument array needs two strings:
     * 0 - the filename of the catalog to merge
     * 1 - the filename of the merged catalog
     *
     * args - an array of two strings
     */
    function main(args) {
        var srcFilename = args[0];
        var destFilename = args[1];

        // Read the catalog, two entries have to be mocked
        var catalog = CERNY.loadData(srcFilename);

        // Create the Catalog, resolve the inlcudes
        var dict = CERNY.Dictionary(catalog);

        // Remove unwanted properties from the catalog
        delete(dict.include);
        delete(dict.logger);
        delete(dict["topincs.path"]);
        delete(dict["base.path"]);

        // Write the complete catalog in *one* file
        write(destFilename, CERNY.json.TextPrettyPrinter().print(dict));
    }
    signature(main, "undefined", Array);
    method(MergeCatalog, "main", main);

}) ();
