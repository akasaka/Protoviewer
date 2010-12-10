/**
 * Filename    : mergecatalog.js
 * Author      : Robert Cerny
 * Created     : 2007-12-09
 * Last Change : 2007-12-09
 *
 * Description:
 *   This file implements a Ant script task definition for merging a
 *   catalog file. The task has two mandatory attributes:
 *     src-file - the source catalog file
 *     dest-file - the destination file
 *
 * History:
 *   2007-12-09 Created.
 */

CERNY.require("CERNY.ant.mergecatalog",
              "CERNY.apps.MergeCatalog");

var srcFilename = attributes.get("src-file");
var destFilename = attributes.get("dest-file");
CERNY.apps.MergeCatalog.main([srcFilename, destFilename]);
