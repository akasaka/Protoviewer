/**
 * Filename    : apps.js
 * Author      : Robert Cerny
 * Created     : 2007-11-17
 * Last Change : 2007-12-08
 *
 * Description:
 *   Base package file for applications. Defines function for reading
 *   and writing to the filesystem. Currently relies on rhino.
 *
 * History:
 *   2007-11-17 Created.
 */

CERNY.namespace("apps");

CERNY.require("CERNY.apps");

(function () {

    var method = CERNY.method;
    var signature = CERNY.signature;

    var logger = CERNY.Logger("CERNY.apps");
    CERNY.apps.logger = logger;

    /**
     * Read a file from the filesystem.
     *
     * Line endings are replaced by unix line endings.
     *
     * filename - the name of the file
     * return - the content of the file
     */
    function read(filename) {
        var reader = new java.io.BufferedReader(new java.io.FileReader(filename));
        var content = "";
        var line = null;
        while ((line = reader.readLine()) !== null) {
            content += line + "\n";
        }
        return content;
    }
    signature(read, "string", "string");
    method(CERNY.apps, "read", read);

    /**
     * Write a file to the filesytem.
     *
     * filename - the name of the file to write
     * content - the content to write in to the file
     */
    function write(filename, content) {
        var writer = new java.io.BufferedWriter(new java.io.FileWriter(filename));
        writer.write(content, 0, content.length);
        writer.close();
    }
    signature(write, "string", "string", "string");
    method(CERNY.apps, "write", write);

}) ();
