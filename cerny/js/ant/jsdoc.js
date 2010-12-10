<![CDATA[
/**
 * Filename    : jsdoc.js
 * Author      : Robert Cerny
 * Created     : 2007-12-05
 * Last Change : 2007-12-08
 *
 * Description:
 *   This file implements a Ant script task definition for generating
 *   the documentation for a JavaScript library. The documentation
 *   must adhere to the documentation style of Cerny.js. The task is
 *   called jsdoc and has two mandatory attributes:
 *     src-dir - the source directory holding a <code>manifest.json</code>
 *     dest-dir - the destination directory where the documention in JSON
 *                will be written to
 *
 * History:
 *   2007-12-05 Created.
 */

CERNY.require("CERNY.ant.jsdoc",
              "CERNY.apps.GenerateDoc");

var src = attributes.get("src-dir");
var dest = attributes.get("dest-dir");
CERNY.apps.GenerateDoc.main([src, dest]);
]]>
