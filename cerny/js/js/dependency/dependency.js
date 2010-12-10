/**
 * Filename    : dependency.js
 * Author      : Robert Cerny
 * Created     : 2007-11-18
 * Last Change : 2007-12-08
 *
 * Description:
 *   This script provides functionality for creating a list of
 *   dependencies of an expression.
 *
 * History:
 *   2007-11-18 Created.
 */

CERNY.namespace("js.dependency");

CERNY.require("CERNY.js.dependency",
              "CERNY.js.Array");

(function() {

    var method = CERNY.method;
    var signature = CERNY.signature;

    var logger = CERNY.Logger("CERNY.js.dependency");
    CERNY.js.dependency.logger = logger;

    var definedTerms = [];

    /**
     * List dependencies for an expression as defined in catalog.
     *
     * expression - the expression to list dependencies for
     * catalog - the catalog to lookup expressions and load files
     * return - a list of expressions
     */
    function listDependencies(expression, catalog) {
        var dependencies = [];
        definedTerms = [];

        // Intercept require.
        CERNY.intercept(CERNY, "require", [createDependencyInterceptor(dependencies, catalog)]);

        // Define require globally
        require = CERNY.require;

        // Bend load and catalog
        var oldLoad = CERNY.load;
        method(CERNY, "load", load);
        var oldCatalog = CERNY.Catalog;
        CERNY.Catalog = catalog;

        // Load the file holding the expression
        CERNY.load(catalog.lookup(expression));

        // Straigthen load and catalog
        method(CERNY, "load", oldLoad);
        CERNY.Catalog = oldCatalog;

        // Undefined require globally
        delete(require);

        // Delete defined terms in opposite order
        definedTerms.reverse().map(function(term) {
            eval("delete(" + term + ");");
        });

        return dependencies;
    }
    signature(listDependencies, Array, "string", "object");
    method(CERNY.js.dependency, "listDependencies", listDependencies);

    function createDependencyInterceptor(sequence, catalog) {
        return {
            before: function(call) {
            },
            after: function(call) {
                var requiring = call.arguments[0];

                // Define the expression so that they are not loaded more
                // than once. Remember the actual content of the source
                // code file is not evaluated, only the require statement
                // is!
                call.returnValue.map(function(exp) {
                    if (!sequence.contains(exp)) {
                        sequence.push(exp);
                    }

                    // Make sure the expression is defined in the catalog
                    catalog.lookup(exp);
                    define(exp);
                });
                if (!sequence.contains(requiring)) {
                    sequence.push(requiring);
                }
            }
        }
    }

    /*
     * Define a term in the global scope. Assigns an object to the
     * term. Defines parent terms as well and does not overwrite
     * existing terms.
     *
     * term - the term to be defined
     */
    function define(term) {
        var subTerms = term.split("."), parentTerm;
        if (subTerms.length > 1) {
            subTerms.pop();
            parentTerm = subTerms.join(".");
            define(parentTerm);
        }
        if (!CERNY.isPresent(term)) {
            eval(term + " = {}");
            definedTerms.push(term);
        }
    }
    // signature(defined, "undefined", "string");

    /*
     * Load a script, but do not execute the script, only the require
     * statement.
     *
     * location - the location of the script
     */
    function load(location) {
        var source = CERNY.getResource(location);
        var requireStatement = extractRequireStatement(source);
        if (requireStatement) {
            eval(requireStatement);
        }
    }
    // signature(load, "undefined", "string");

    /*
     * Extract the require statement from sourcecode.
     *
     * sourcecode - the sourcecode (or fragment) to extract the require statement from
     * return - the first require statement or undefined, it there is none
     */
    function extractRequireStatement(sourcecode) {
        var matches = sourcecode.match(new RegExp("^((CERNY\.)?require[^\\)]*)\\)", "gmi"));
        if (matches) {
            return matches[0];
        }
    }
    // signature(extractRequireStatement, ["string", "undefined"], "string");

})();
