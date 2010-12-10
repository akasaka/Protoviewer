/**
 * Filename    : Response.js
 * Author      : Robert Cerny
 * Created     : 2007-12-08
 * Last Change : 2007-12-08
 *
 * Description:
 *  Provides a wrapper around a HTTP response.
 *
 * History:
 *   2007-12-08 Created.
 */

CERNY.require("CERNY.http.Response");

(function() {

    var signature = CERNY.signature;
    var method = CERNY.method;

    CERNY.http.Response = Response;

    var logger = CERNY.Logger("CERNY.http.Response");

    /**
     * This class represents the HTTP response. A response must have a
     * status.
     *
     * request - the request that belongs to this response
     * return - an instance of this class
     */
    function Response(request) {

        /**
         * The request that issued this response.
         */
        this.request = request;

        /**
         * The body of this response.
         */
        this.body = request.responseText;

        /**
         * The status code of this response.
         */
        this.status = request.status;
    }
    // signature(Response, "object", CERNY.http.Request);

    Response.prototype.logger = logger;

    /**
     * Return the status of this response.
     *
     * return - the response status
     */
    function getStatus() {
        return this.status;
    }
    signature(getStatus, "number");
    method(Response.prototype, "getStatus", getStatus);

    /**
     * Return the body of this response.
     *
     * return - the response body
     */
    function getBody() {
        return this.body;
    }
    signature(getBody, "string");
    method(Response.prototype, "getBody", getBody);

    /**
     * Return a header of the response.
     *
     * name - the name of the header to return
     * return - the value of the response header
     */
    function getHeader(name) {
        return this.request.getResponseHeader(name);
    }
    signature(getHeader, "string", "string");
    method(Response.prototype, "getHeader", getHeader);

    /**
     * Interpret the body of the response as a JSON document and
     * return the evaluation result.
     *
     * return - the value of the JSON document in the body
     */
    function getValue() {
        eval("var o = " + this.body);
        return o;
    }
    signature(getValue, "any");
    method(Response.prototype, "getValue", getValue);

})();
