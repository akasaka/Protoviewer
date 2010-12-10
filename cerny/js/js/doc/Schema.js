/**
 * Filename    : Schema.js
 * Author      : Robert Cerny
 * Created     : 2006-11-17
 * Last Change : 2007-03-20
 *
 * Description:
 *   Defines a schema for script documentation. Servers as an example
 *   for a schema as well. See source code for more information.
 *
 * History:
 *   2007-03-20 Removed unnecessary dependency to TextFormat.
 *   2007-03-08 Package.path can be empty (at the top level package).
 *   2007-03-08 Corrected error in Libarary.version.
 *   2007-02-20 Added Package, Library and VersionNumber.
 *   2006-11-17 Created.
 *
 * License:
 */

CERNY.require("CERNY.js.doc.Schema",
              "CERNY.schema");

// The dependency is fullfilled when this object is present!
// TODO: Not optimal solution, file name != main product of the file.
CERNY.js.doc.Schema = {};

arrayOf = CERNY.schema.arrayOf;
optional = CERNY.schema.optional;
nonEmptyString = CERNY.schema.nonEmptyString;
isoDate = CERNY.schema.isoDate;

CERNY.js.doc.Parameter = {
    name: nonEmptyString,
    type: optional(nonEmptyString),
    documentation: nonEmptyString
};

CERNY.js.doc.Function = {
    fqName: nonEmptyString,
    name: nonEmptyString,
    documentation: arrayOf(nonEmptyString),
    parameters: arrayOf(CERNY.js.doc.Parameter),
    returnValue: optional(nonEmptyString),
    returnType: optional(nonEmptyString)
};

CERNY.js.doc.HistoryEntry = {
    date: isoDate,
    entry: nonEmptyString
};

CERNY.js.doc.Script = {
    fqName: nonEmptyString,
    name: nonEmptyString,
    author: nonEmptyString,
    creationDate: isoDate,
    modificationDate: optional(isoDate),
    documentation: arrayOf(nonEmptyString),
    history: arrayOf(CERNY.js.doc.HistoryEntry),
    functions: arrayOf(CERNY.js.doc.Function),
    uses: arrayOf(nonEmptyString)
};

CERNY.js.doc.Package = {
    fqName: nonEmptyString,
    path: isString,
    mainScript: nonEmptyString,
    scripts: arrayOf(CERNY.js.doc.Script, 1)
};

CERNY.js.doc.VersionNumber = {
    major: isNumber,
    minor: isNumber,
    bugfix: isNumber
};

CERNY.js.doc.Library = {
    name: nonEmptyString,
    namespace: nonEmptyString,
    version: CERNY.js.doc.VersionNumber,
    packages: arrayOf(CERNY.js.doc.Package, 1)
};
