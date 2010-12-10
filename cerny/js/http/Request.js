/**
 * Filename    : Request.js
 * Author      : Robert Cerny
 * Created     : 2007-06-18
 * Last Change : 2007-12-08
 *
 * Description:
 *  This script provides Ajax functionality to send HTTP requests to a
 *  server.
 *
 * History:
 *   2007-12-08 Split into two scripts, Request and Response.
 *   2007-07-07 Fixed bug caused by json.js when setting request headers.
 *   2007-06-18 Created.
 */

CERNY.require("CERNY.http.Request",
              "CERNY.http.Response");

(function() {

    var signature = CERNY.signature;
    var method = CERNY.method;
    var Response = CERNY.http.Response;

    CERNY.http.Request = Request;

    var logger = CERNY.Logger("CERNY.http.Request");

    /**
     * This class represents the HTTP request. This is a wrapper to add
     * some convenience and avoid the word XML.
     *
     * method - the method of the request
     * url - the URL of the request
     * return - an instance of this class
     */
    function Request(method, url) {

        /**
         * The method (verb) of this HTTP request. Valid values are
         * all methods defined in RFC 2616.
         */
        this.method = method;

        /**
         * The URL of this HTTP request. Only URLs within the current
         * domain can be processed, due to browser security.
         */
        this.url = url;

        /**
         * The headers that should be sent with this request. The
         * browser will add some more.
         */
        this.headers = {};

        /**
         * The body of this request.
         */
        this.body = null;

        /**
         * The content type of the body of this request. If present
         * this header will be set automatically before sending the
         * request.
         */
        this.contentType = null;
    }
    // signature(Request, "object", "string", "string");

    Request.prototype.logger = logger;

    // See http://www.w3.org/TR/XMLRequest/
    Request.UNSENT = "0";
    Request.OPEN = "1";
    Request.SENT = "2";
    Request.LOADING = "3";
    Request.DONE = "4";

    /**
     * Set the body of the request, optionally pass the content type
     * of the body. It is recommended to pass the content type.
     *
     * body - the body the request should transport
     * contentType - the content type of the body
     */
    function setBody(body, contentType) {
        this.body = body;
        this.contentType = contentType;
    }
    signature(setBody, "undefined", "string", ["undefined", "string"]);
    method(Request.prototype, "setBody", setBody);

    /**
     * Set a header of the request.
     *
     * name - the name of the header
     * value - the value of the header
     */
    function setHeader(name, value) {
        this.headers[name] = value;
    }
    signature(setHeader, "undefined", "string", "string");
    method(Request.prototype, "setHeader", setHeader);

    /**
     * Send this request synchronously. The browser will wait for the
     * response with further execution.
     *
     * return - the response of the server
     */
    function sendSynch() {
        this.request = new XMLHttpRequest();
        this.request.open(this.method, this.url, false);
        setHeaders(this, this.request);
        this.request.send(this.body);
        return new Response(this.request);
    }
    signature(sendSynch, CERNY.http.Response);
    method(Request.prototype, "sendSynch", sendSynch);

    /**
     * Send this request asynchronously. The browser will continue to
     * execute the script without waiting for the response.
     *
     * The parameter <code>callback</code> is an object that may
     * contain a function for each phases of the request. The name of
     * the property is the number of the phase, so UNSET is "0", OPEN
     * is "1", SENT is "2", LOADING is "3" and DONE is "4". If a
     * function is passed instead of an object, it is interpreted as a
     * callback when the request is done (complete, the response has
     * arrived, a status is available).
     *
     * callback - handler(s) for the request processing phases
     */
    function sendAsynch(callback) {
        var handler = callback;
        if (isFunction(callback)) {
            handler = {};
            handler[Request.DONE] = callback;
        }
        this.request = new XMLHttpRequest();
        this.request.open(this.method, this.url, true);
        setHeaders(this, this.request);
        var req = this.request;
        this.request.onreadystatechange = function () {
            if (isFunction(handler["" + req.readyState])) {
                handler["" + req.readyState](req);
            }
        }
        this.request.send(this.body);
    }
    signature(sendAsynch, "undefined", ["function", "object"]);
    method(Request.prototype, "sendAsynch", sendAsynch);

    /*
     * Set the headers for the request.
     */
    function setHeaders(t, request) {
        if (t.contentType) {
            request.setRequestHeader("Content-Type", t.contentType);
        }
        for (var name in t.headers) {
            // Check for own property, because otherwise toJSONString
            // is considered as well.
            if (t.headers.hasOwnProperty(name)) {
                request.setRequestHeader(name, t.headers[name]);
            }
        }
    }

})();
