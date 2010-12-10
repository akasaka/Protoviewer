/**
 * Filename    : MergeCss.js
 * Author      : Robert Cerny
 * Created     : 2007-11-17
 * Last Change : 2007-12-09
 *
 * Description:
 *   Merge a CSS file. Scan the file for import directives and include
 *   the content of the imported file instead of the directive. But
 *   only if the imported file does not contain any URLs.
 *
 * History:
 *   2007-11-17 Created.
 */

CERNY.require("CERNY.apps.MergeCss",
              "CERNY.apps",
              "CERNY.js.Array");

(function () {

    var read = CERNY.apps.read;
    var write = CERNY.apps.write;
    var method = CERNY.method;
    var signature = CERNY.signature;

    var logger = CERNY.Logger("CERNY.apps.MergeCss");

    var MergeCss = {};
    CERNY.apps.MergeCss = MergeCss;
    MergeCss.logger = logger;

    /**
     * Runs the application. The argument array needs two strings:
     * 0 - the filename of the CSS file to merge
     * 1 - the filename of the merged CSS file
     *
     * args - an array of two strings
     */
    function main(args) {
        var srcFilename = args[0];
        var destFilename = args[1];
        var mergedCss = mergeCss(srcFilename);
        write(destFilename, mergedCss);
    }
    signature(main, "undefined", Array);
    method(MergeCss, "main", main);

    /*
     * Merge a CSS file. Scan the file for import directives and
     * include the content of the imported file instead of the
     * directive. But only if the imported file does not contain any
     * URLs.
     *
     * filename - the filename of the CSS file
     * return - merged content of the CSS file
     */
    function mergeCss(filename) {

        // A place for the imports that cannot be merged, because they
        // have a URL in them, which might not resolve correctly after
        // the CSS content is moved.
        var ignoredImports = [];

        var cssContent = readCss(filename, ignoredImports);

        // Prepend the imports which were not merged
        cssContent = ignoredImports.join("\n") + "\n" + cssContent;
        return cssContent;
    }

    /*
     * Read a CSS file and replace import directives by the content of
     * the imported file. If the content contains a URL, then put the
     * file in the ignoredImports array.
     *
     * filename - the filename of the CSS file to read
     * ignoredImports - an array for the ignored CSS imports
     * return - merged content of the CSS file
     */
    function readCss(filename, ignoredImports) {
        var cssContent = read(filename);
        var cssDirname = dirname(filename);

        var matches = cssContent.match(/@import url\(\".*\"\);/gm);
        if (matches) {
            matches.map(function(match) {
                var importFilename = match.match(/\"(.*)\"/)[1];
                var importDirname = dirname(importFilename);
                var importPathname = cssDirname + "/" + importFilename;
                var importContent = readCss(importPathname, ignoredImports);

                // Ignore imports which have a url and do not reside
                // in the same directory.
                if (containsUrls(importContent) && importDirname !== "") {
                    logger.info("import ignored: " + importFilename);

                    // Remember them and then replace them anyway,
                    // because imports have to be in the beginning of
                    // a CSS file.
                    ignoredImports.push(match);
                    cssContent = cssContent.replace(match, "");
                } else {
                    cssContent = cssContent.replace(match, importContent);
                }
            });
        }

        return cssContent;
    }

    function containsUrls(cssStr) {
        if (cssStr.match(/url\(/)) {
            return true;
        } else {
            return false;
        }
    }

    function dirname(filename) {
        return filename.substring(0, filename.lastIndexOf("/"));
    }

})();
