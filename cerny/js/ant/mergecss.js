/**
 * Filename    : mergecss.js
 * Author      : Robert Cerny
 * Created     : 2007-11-17
 * Last Change : 2007-12-09
 *
 * Description:
 *   This file implements a Ant script task definition for merging a
 *   CSS file. The task has two mandatory attributes:
 *     src-file - the source CSS file
 *     dest-file - the destination file
 *
 *   The resulting CSS file will have included the content of all
 *   imports that do not contain relative paths.
 *
 * History:
 *   2007-11-17 Created.
 */

CERNY.require("CERNY.ant.mergecss",
              "CERNY.apps.MergeCss");

var srcFilename = attributes.get("src-file");
var destFilename = attributes.get("dest-file");
CERNY.apps.MergeCss.main([srcFilename, destFilename]);
