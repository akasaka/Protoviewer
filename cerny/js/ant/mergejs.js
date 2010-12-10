<![CDATA[
/**
 * Filename    : mergejs.js
 * Author      : Robert Cerny
 * Created     : 2007-11-19
 * Last Change : 2007-12-08
 *
 * Description:
 *   This file implements an Ant script definition for merging
 *   JavaScript files. The task takes an expression for a catalog and
 *   creates the dependency sequence of all file that are required to
 *   run provide the functionality of the expression. It is mandatory
 *   that the file which contains the expression has a require
 *   statement.
 *
 *   The task <code>mergejs</code> has the following mandatory
 *   attributes:
 *      expression - the expression to merge functionality in one file
 *      dest-file - the destination file, a JavaScript file
 *      catalog-file - the catalog to resolve expressions with
 *      base-dir - the base dir to successfully concatenate files
 *
 *   This procedure does not evaluate all source code. It loads only
 *   the first 200 lines of a script and looks for a require
 *   statement, which will be execute and connect the dependency chain.
 *
 *  History:
 *   2007-11-19 Created.
 */

CERNY.require("CERNY.ant.mergejs",
              "CERNY.js.Array",
              "CERNY.js.dependency");

(function() {
    var method = CERNY.method;
    var intercept = CERNY.intercept;

    var expression = attributes.get("expression");
    var destFile = attributes.get("dest-file");
    var catalogFile = attributes.get("catalog-file");
    var baseDir = attributes.get("base-dir");

    var catalog = CERNY.Dictionary(CERNY.loadData(catalogFile));

    var listDependencies = CERNY.js.dependency.listDependencies;

    var logger = CERNY.Logger("CERNY.ant.MergeJs");

    /*
     * For performance reasons overwrite getResource to only get the first 200 lines. That
     * should be enough for a require statement.
     *
     * filename - the filename of the file
     * lines - the number of lines to read
     * return - the content of the file
     */
    function getResource(filename, lines) {
        filename =  baseDir + "/" + filename;
        lines = lines || 200;
        var reader = new java.io.BufferedReader(new java.io.FileReader(filename));
        var content = "";
        var line = null;
        var i = 0;
        while ((line = reader.readLine()) !== null && i < lines) {
            content += line + "\n";
            i += 1;
        }
        return content;
    }
    var origGetResource = CERNY.getResource;
    method(CERNY, "getResource", getResource);

    var dependencies = listDependencies(expression, catalog);

    method(CERNY, "getResource", origGetResource);

    var filenames = dependencies.map(function(exp) {
        var value = catalog.lookup(exp);
        var v = value.split(",");
        return v.pop();
    });

    // Concat the files
    var files = filenames.join(",");
    var concatTask = project.createTask("concat");
    concatTask.setDestfile(new java.io.File(destFile));
    importClass(Packages.org.apache.tools.ant.types.FileList);
    var fileList = new FileList();
    fileList.setDir(new java.io.File(baseDir));
    fileList.setFiles(files);
    concatTask.addFilelist(fileList);
    concatTask.execute();

})();
]]>
