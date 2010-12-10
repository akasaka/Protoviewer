/**
 * Filename    : cerny.js
 * Author      : Robert Cerny
 * Created     : 2006-11-10
 * Last Change : 2008-01-21
 *
 * Description:
 *   This is the file that provides the core functionality of the
 *   Cerny.js library: interception, type checking, logging,
 *   dependency declaration, configuration and dictionaries.
 *
 *   To use the Cerny.js library this file must be included in your
 *   page. The configuration file (a copy of cerny.conf.js) must be
 *   included beforehand.
 *
 *   Some conventions used:
 *   <ul>
 *     <li>
 *       If a current function or member is overwritten in a script,
 *       e.g. 'insertBefore', but will be referred to later, the new name
 *       of the member is composed of an underscore followed by the old
 *       name, e.g. '_insertBefore'.
 *     </li>
 *     <li>
 *       If a simple name is not possible due to keyword restrictions, the
 *       name is proceeded by an underscore, e.g. '_delete'.
 *     </li>
 *     <li>
 *       If a function takes arbitrarily many arguments, the documentation
 *       for these parameters must be called 'arguments'.
 *     </li>
 *     <li>
 *       If the documentation for a function does not specify a return
 *       value, the function returns undefined.
 *     </li>
 *   </ul>
 *
 * History:
 *   2008-01-20 Fixed issue with Profiler.
 *   2007-12-01 Added function CERNY.loadData.
 *   2007-11-21 CERNY.Dictionary.lookup throws an error if a term is not found.
 *   2007-11-17 CERNY.require can resolve external dependencies.
 *   2007-11-02 The Profiler interception collects data about calls.
 *   2007-10-03 CERNY.signature throws an error if called 2x on the same func.
 *   2007-09-28 CERNY.checkType is handling the type undefined better.
 *   2007-09-28 Made definition of CERNY.getResource conditional.
 *   2007-09-20 CERNY.load throws an error if it cannot load a script.
 *   2007-09-20 CERNY.require throws an error if it is missing expressions.
 *   2007-09-20 Refactored dictionary. Added method evaluate. Added include.
 *   2007-06-16 Added typeOf. Improved clone.
 *   2007-05-18 Refactored to use anonymous functions for local namespaces.
 *   2007-05-16 Added clone, pre, post and the ContractChecker interceptor.
 *   2007-05-03 CERNY.namespace is returning the created namespace.
 *   2007-04-10 TypeCheker does not check return value on exceptional calls.
 *   2007-04-03 Exceptions thrown in intercepted functions are always visible.
 *   2007-04-03 Loggers got the enabled functions.
 *   2007-04-02 CERNY.load works for global functions.
 *   2007-03-21 Logging an info when reapplying interception with CERNY.intercept.
 *   2007-03-21 Logging name of the logger of the object that is intercepted in CERNY.intercept.
 *   2007-03-16 Added additional parameter (interceptors) to CERNY.intercept.
 *   2007-03-15 Added additional parameter (interceptors) to CERNY.method.
 *   2007-03-11 Added signature, checkType and the TypeChecker interceptor.
 *   2007-03-02 Added layout and appenders to CERNY.Logger.
 *   2007-03-01 Moved loggers from CERNY to CERNY.Logger.
 *   2007-02-08 Fixed bug in intercept, which caused objects to be intercepted.
 *   2006-12-31 Added the interceptor concept.
 *   2006-12-30 Added the dump method.
 *   2006-11-10 Created.
 */

if (typeof CERNY != 'object') {
    CERNY = {};
}

// The most basic functions
(function() {

    CERNY.CloningException = CloningException;
    CERNY.ContractViolation = ContractViolation;
    CERNY.check = check;
    CERNY.clone = clone;
    CERNY.dump = dump;
    CERNY.instanceOf = instanceOf;
    CERNY.method = method;
    CERNY.object = object;
    CERNY.post = post;
    CERNY.pre = pre;
    CERNY.signature = signature;
    CERNY.typeOf = _typeOf;

    /**
     * Prototypal inheritance [DCP].
     * This alogorithm was developed by Douglas Crockford.
     *
     * obj - the object to be the prototype of the new object.
     * return - the new object
     */
    function object(obj) {
        obj = obj || {};
        function F() {}
        F.prototype = obj;
        return new F();
    };
    // signature(object, "object", "object"); (1)

    // (1) Type checking is dependant on interception which is only
    // available after the configuration cut. For documentation
    // purposes the signature of the functions before the cut is
    // mentioned in a comment.

    /**
     * Attach a function as a method to an object. This allows to create
     * arbitrarliy many functions around the actual function. It aims for
     * separation of concerns. The interceptors are wrapped around the
     * function starting with the last one. This allows a "natural order",
     * when filling the array regarding dependency. So more basic
     * interceptors (e.g. <code>LogIndenter</code>) are pushed first.
     *
     * obj - the obj to attach the function to
     * name - the name under which the function will be known to the object
     * func - the function to attach
     * interceptors - the interceptors to use; defaults to
     *                CERNY.Configuration.Interception.active
     */
    function method(obj, name, func, interceptors) {
        var f = func, interceptor;

        if (!interceptors) {
            interceptors = CERNY.Configuration.Interception.active;
        }

        for (var i = interceptors.length - 1; i >= 0; i--) {
            interceptor = interceptors[i];
            interceptor.create = CERNY.Interceptors.create;
            f = interceptor.create(obj, name, f, i);
        }
        obj[name] = f;
    };
    // signature(method, "undefined", "object", "string", "function", ["undefined", Array]);

    /**
     * Specify the signature of a function. The types can be specified
     * either by a string (<code>"boolean"</code>, <code>"string"</code>,
     * <code>"number"</code>, <code>"object"</code>,
     * <code>"function"</code>, <code>"undefined"</code>,
     * <code>"null"</code>, <code>"any"</code>) or by a function, against
     * which the actual value will be tested against with instanceof.
     *
     * In the future it should be possible to specify an object as a type
     * and the prototype chain is inspected for that object. Even more in
     * the future it Cerny schemas could be used.
     *
     * func - the function to specify the signature for
     * returnType - the type of the return value
     * arguments - the types of the parameters
     */
    function signature(func, returnType) {
        if (func._signature) {
            throw new Error("Signature already defined: " + func);
        }

        var parameterTypes = [];
        for (var i = 2; i < arguments.length; i++) {
            parameterTypes[i-2] = arguments[i];
        }
        func._signature = {
            returnType: returnType,
            parameterTypes: parameterTypes
        }
    };
    // signature(signature, "undefined", "function", ["string", "function", Array], ["undefined", "string", "function", Array]);

    /**
     * Specify the conditions that must be met in order to decide whether
     * a call to func can succeed. These conditions are collected in one
     * function which is called the precondition. The precondition
     * supports the author of a function in communicating the intent of
     * the function to the consumer.
     *
     * Precondition is a function which is a sequence of calls to
     * <code>CERNY.check</code>.
     *
     * Precondition is passed the arguments of the call and
     * <code>this</code> has the same meaning as in the function
     * called.
     *
     * func - the function for which the precondition is specified
     * pre - the precondition
     */
    function pre(func, pre) {
        func._pre = pre;
    }
    // signature(pre, "undefined", "function", "function");

    /**
     * Specify the conditions that must be met in order to decide whether
     * a function call was a success.
     *
     * Postcondition is a function which is a sequence of calls to
     * <code>CERNY.check</code>.
     *
     * <code>this</code> has the same meaning as in the function called.
     *
     * Postcondition is passed the following parameters:
     *    <ol>
     *      <li>the return value,</li>
     *      <li>the old version of the object the call is made on, and then</li>
     *      <li>the arguments of the call.</li>
     *    </ol>
     *
     * func - the function for which the postcondition is specified
     * post - the postcondition
     */
    function post(func, post) {
        func._post = post;
    }
    // signature(post, "undefined", "function", "function");

    /**
     * Check whether expr evaluates to true. If not throw a
     * <code>CERNY.ContractViolation</code>. Only to be used in
     * preconditions, postconditions and invariants.
     *
     * expr - the expression to evaluate
     * message - the message to add to the contract violation
     */
    function check(expr, message) {
        if (expr === false) {
            throw new CERNY.ContractViolation(message);
        }
    }
    // signature(check, "undefined", "boolean", "string");

    /**
     * Constructor for a contract violation.
     *
     * message - the nature of the violation in natural language
     * return - the violation
     */
    function ContractViolation(message) {
        this.message = message;
    }
    // signature(ContractViolation, "object", "string");

    /**
     * Constructor for a cloning exception.
     *
     * type - the type which cannot be cloned
     * return - the exception
     */
    function CloningException(type) {
        this.message = "Cloning not available for that type: "  + type;
    }
    // signature(CloningException, "object", "string");

    /**
     * Clone an object. Works for most cases with some restrictions:
     * <ul>
     *   <li>
     *     Custom types may provide a clone method. This method will be
     *     called with no parameters and the result will be returned.
     *   </li>
     *   <li>
     *     Cyclic references cannot be handeled: infinite recursion!
     *   </li>
     *   <li>
     *     Partial cloning is supported, if something is referenced in
     *     the object tree that cannot be cloned, an message is
     *     printed on the console and the referring property is
     *     undefined.
     *   </li>
     * </ul>
     *
     * subject - the value to clone
     * return - a clone of the value
     */
    function clone(subject) {

        switch (_typeOf(subject)) {

        case Array:
            var clone = [];
            for (var i = 0, l = subject.length; i < l; i++) {
                try {
                    clone[i] = CERNY.clone(subject[i]);
                } catch (e) {
                    if (e instanceof CERNY.CloningException) {
                        CERNY.print("When cloning array item at position: " + i + ": " + e.message);
                    }
                }
            }
            return clone;

        case Object:
            var clone = {};
            for (var name in subject) {
                if (subject.hasOwnProperty(name)) {
                    try {
                        clone[name] = CERNY.clone(subject[name]);
                    } catch (e) {
                        if (e instanceof CERNY.CloningException) {
                            CERNY.print("When cloning value of property '" + name + "': " + e.message);
                        }
                    }
                }
            }
            return clone;

        case Date:
            return new Date(subject.getTime());

        case "boolean":
        case "function":
        case "null":
        case "number":
        case "string":
        case "undefined":
            return subject;

        default:
            if (typeof subject.clone == "function") {
                return subject.clone();
            }
            throw new CERNY.CloningException(_typeOf(subject));
        }
    }
    // signature(clone, "any", "any");

    /**
     * Dump a value for logging purposes. Returns the value of the
     * variable followed by its type in braces. If the variable is a
     * string, the value is enclosed by a single quote.
     *
     * value - the value to dump
     * return - a string useful for logging
     */
    function dump(value) {
        var encloser = "";
        if (isString(value)) {
            encloser = "'";
        }
        return encloser + value + encloser + " (" + typeof value + ")";
    };
    // signature(dump, "string", "any");

     function instanceOf(obj, func) {
        if (isObject(obj)) {
            return obj instanceof func;
        }
    };
    // signature(instanceOf, "boolean", "object", "function");

     /*
      * Return the type of a value. For primitive values it returns
      * the result of typeof, for objects it returns their
      * constructor.
      *
      * value - the value for which the type should be determined.
      * return - the type of the value
      */
     function _typeOf(value) {
         var type = typeof value;
         if (type == "object") {
             if (value === null) {
                 return "null";
             }
             return value.constructor;
         }
         // Firefox types Regexps as "function" whereas other browsers
         // type it as "object"
         if (type == "function") {
             if (value.constructor === RegExp) {
                 return value.constructor;
             }
         }
         return type;
     }

})();

// Logging
(function() {

    CERNY.Logger = Logger;

    /**
     * Create a logger. For every category there exists exactly one
     * logger.
     *
     * name - the name of the category
     * return - the logger for the category identified by <code>name</code>
     */
    function Logger(name) {

        // Does a logger for this category exist already ?
        if (isObject(CERNY.Logger[name])) {
            return CERNY.Logger[name];
        }

        // A small function to look for the appropriate category and log
        // level in the configuration
        function getLogLevelStr(name) {
            var segments = name.split("."), part;
            var logLevelStr = null;
            for (var i = segments.length; i > 0 && logLevelStr == null; i--) {
                part = "";
                for (var j = 0; j < i; j++) {
                    if (part != "") {
                        part += ".";
                    }
                    part += segments[j];
                }
                logLevelStr = CERNY.Configuration.Logger[part];
            }

            return logLevelStr || CERNY.Configuration.Logger["ROOT"] || "OFF";
        };

        // Create the logger
        var self = CERNY.object(CERNY.Logger.Logger);
        self.name = name;

        // The log level
        var logLevelStr = getLogLevelStr(name);
        self.logLevel = CERNY.Logger[logLevelStr];
        if (!isNumber(self.logLevel)) {
            CERNY.print("Invalid log level '" + logLevelStr + "' for '" + name + "'. Defaults to FATAL." +
                        "Log level must be one of 'OFF', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG' or 'TRACE'.");
            self.logLevel = CERNY.Logger.FATAL;
        }

        // Store the logger
        CERNY.Logger[name] = self;
        return self;
    }
    // signature(Logger, "object", "string");

    // The log levels
    CERNY.Logger.OFF   = 10;
    CERNY.Logger.FATAL = 20;
    CERNY.Logger.ERROR = 30;
    CERNY.Logger.WARN  = 40;
    CERNY.Logger.INFO  = 50;
    CERNY.Logger.DEBUG = 60;
    CERNY.Logger.TRACE = 70;
    CERNY.Logger.indent = -1;
    CERNY.Logger.indentStr = CERNY.Configuration.Logger.indentStr || "  ";

    // Appenders and layout for logging
    CERNY.Logger.appenders = [CERNY.print];
    CERNY.Logger.layout = function(date, levelName, indentStr, message, loggerName) {
        return date.getTime() + ", " + levelName + ": " + indentStr + message + " | " + loggerName;
    };

    // A function for creating logging functions
    function createLogFunction(level, levelStr) {
        return function(message, time) {
            if (level  <= this.logLevel) {
                var indentStr = "";
                for (var i = 0; i < CERNY.Logger.indent; i++) {
                    indentStr += CERNY.Logger.indentStr;
                }
                for (var i = 0; i < CERNY.Logger.appenders.length; i++) {
                    CERNY.Logger.appenders[i](CERNY.Logger.layout(new Date(), levelStr, indentStr, message, this.name));
                }
            }
        }
    };
    // CERNY.signature(createLogFunction, "function", "number", "string");

    function createEnabledFunction(level) {
        return function() {
            return level <= this.logLevel;
        }
    };
    // CERNY.signature(createEnabledFunction, "function", "number");

    CERNY.Logger.Logger = {
        fatal: createLogFunction(CERNY.Logger.FATAL, "FATAL"),
        warn:  createLogFunction(CERNY.Logger.WARN,  "WARN "),
        info:  createLogFunction(CERNY.Logger.INFO,  "INFO "),
        error: createLogFunction(CERNY.Logger.ERROR, "ERROR"),
        debug: createLogFunction(CERNY.Logger.DEBUG, "DEBUG"),
        trace: createLogFunction(CERNY.Logger.TRACE, "TRACE"),
        isFatalEnabled: createEnabledFunction(CERNY.Logger.FATAL),
        isWarnEnabled:  createEnabledFunction(CERNY.Logger.WARN),
        isInfoEnabled:  createEnabledFunction(CERNY.Logger.INFO),
        isErrorEnabled: createEnabledFunction(CERNY.Logger.ERROR),
        isDebugEnabled: createEnabledFunction(CERNY.Logger.DEBUG),
        isTraceEnabled: createEnabledFunction(CERNY.Logger.TRACE)
    };

    CERNY.logger = CERNY.Logger("CERNY");

})();


// Interception
(function() {

    /*
     * The Interceptor concept allows to dynamically add aspects to the
     * function calls. This concept is a very valueable help for debugging
     * and supports separations of concerns.
     */
    CERNY.Interceptors = {};

    CERNY.Interceptors.create = create;

    /*
     * Create an interceptor.
     *
     * obj - the object to create the intercepted method on
     * name - the name under which the intercepted method will be available
     * func - the function which holds the definition of the method
     * position - the position of the interceptor in the interceptors
     * return - an interceptor
     */
    function create(obj, name, func, position) {
        var t = this;

        // Obtain the logger name
        var loggerName = "NONE";
        if (isObject(obj.logger) && isString(obj.logger.name)) {
            loggerName = obj.logger.name;
        }
        return function() {

            // The object holding information about the function call
            var call = {
                arguments: arguments,
                func: func,
                subject: this,
                logger: CERNY.Logger(loggerName + "." + name)
            }

            t.before(call);

            // func must be applied to this and not obj, so that the
            // mechanism also works for definitions on prototype
            try {
                call.returnValue = func.apply(this, arguments);
            } catch (e) {

                // Mark this call as exceptional, so that interceptors can
                // react to it, e.g. TypeCheker does not check the return
                // value on exceptional calls, because the real reason
                // would be disguised.
                call.exception = e;

                // Log the exception *one* time on the outermost interceptor
                if (position == 0) {

                    // Exceptions should never be unnoticed either log it
                    // or print it
                    if (call.logger.isErrorEnabled()) {
                        call.logger.error("Exception: " + e.message);
                    } else {
                        CERNY.print("Exception: " + e.message + " | " + call.logger.name);
                    }
                }
                throw e;
            } finally {
                t.after(call);
            }
            return call.returnValue;
        };
    };
    // signature(create, "function", "object", "string", "function", "number");

    /*
     * This interceptor traces the depth of the log level
     * indentation. Each function call that <strong>is reported to the
     * logger</strong> increases the depth in the beginning and decreases
     * it at the end.
     *
     * It should be pushed into the interceptors array before any logging
     * interceptor.
     */
    CERNY.Interceptors.LogIndenter = {
        before: function(call) {
            if (call.logger.logLevel >= CERNY.Logger.TRACE) {
                CERNY.Logger.indent += 1;
            }
        },
        after: function(call) {
            if (call.logger.logLevel >= CERNY.Logger.TRACE) {
                CERNY.Logger.indent -= 1;
            }
        }
    }

    /*
     * This interceptor traces function calls and logs the arguments and
     * the return value.
     */
    CERNY.Interceptors.Tracer = {
        before: function(call) {
            call.logger.trace("entry");
            for (var i = 0; i < call.arguments.length; i++) {
                call.logger.trace("arg " + i + ": " + CERNY.dump(call.arguments[i]));
            }
        },
        after: function(call) {
            call.logger.trace("return: " + CERNY.dump(call.returnValue));
        }
    }

    /*
     * This interceptor profiles function calls. It reports the
     * execution duration of the call in ms to the logger. It also
     * collectes data about calls in an object on the function. This
     * data can later be used for a report by the means of (TODO:
     * mention name of the function).
     */
    CERNY.Interceptors.Profiler = {
        before: function(call) {

            // Set up a data store for the Profiler on the function executed
            var func = call.func;
            if (!func._ProfilerData) {
                func._ProfilerData = {
                    count: 0,
                    total: 0
                }

                // Register this function as profiled
                // TODO!
            }
            func._ProfilerData.count += 1;

            // Log the start of the execution and store the start time
            call.logger.trace("start");
            call.start = new Date();
        },
        after: function(call) {

            // Calculate the duration of the the call and store it
            var duration = new Date().getTime() - call.start.getTime();
            call.func._ProfilerData.total += duration;

            // Log the end of this function call
            call.logger.trace("stop: " + duration + " ms");
        }
    }

    /*
     * This interceptor checks the type of arguments and return value as
     * defined by <code>CERNY.signature</code>.
     */
    CERNY.Interceptors.TypeChecker = {
        before: function(call) {
            var type, argument;
            if (isObject(call.func._signature)) {
                var signature = call.func._signature;
                for (var i = 0; i < signature.parameterTypes.length; i++) {
                    type = signature.parameterTypes[i];
                    argument = call.arguments[i];

                    try {
                        CERNY.checkType(type, argument);
                    } catch (te) {
                        if (te instanceof TypeError) {
                            call.logger.fatal("arg " + i + ": " + te.message);
                        }
                        throw te;
                    }
                }

                // All exceeding arguments are checked against the last type
                for (var j = i; j < call.arguments.length; j++) {
                    argument = call.arguments[j];

                    try {
                        CERNY.checkType(type, argument);
                    } catch (te) {
                        if (te instanceof TypeError) {
                            call.logger.fatal("arg " + i + ": " + te.message);
                        }
                        throw te;
                    }
                }
            }
        },
        after: function(call) {

            // Do not check the signature if an exception occurred, this
            // will cover up the cause and the type is always undefined
            if (isObject(call.func._signature) && !call.exception) {
                try {
                    CERNY.checkType(call.func._signature.returnType, call.returnValue);
                } catch (te) {
                    if (te instanceof TypeError) {
                        call.logger.fatal("return: " + te.message);
                    }
                    throw te;
                }
            }
        }
    }

    /**
     * This interceptor checks contracts, that were made by the
     * programmer, by the means of <code>CERNY.pre</code> and
     * <code>CERNY.post</code>, and the invariant of the object, the
     * method is called upon.
     */
    CERNY.Interceptors.ContractChecker = {

        // Check the precondition before entering the function
        before: function(call) {
            try {
                call.old = CERNY.clone(call.subject);
            } catch (e) {
                if (e instanceof CERNY.CloningException) {
                    call.logger.warn(e.message);
                } else {
                    throw e;
                }
            }
            if (isFunction(call.func._pre)) {
                try {
                    call.func._pre.apply(call.subject, call.arguments);
                } catch (e) {
                    if (e instanceof CERNY.ContractViolation) {
                        e.message = "Precondition violated: " + e.message;
                        call.logger.fatal(e.message);
                    }
                    throw e;
                }
            }
        },

        // Check the postcondition and the invariant on returning from the
        // function
        after: function(call) {
            if (!call.exception) {

                // Postcondition
                if (isFunction(call.func._post)) {
                    try {
                        if (!call.old) {
                            call.logger.warn("no old version of the object available.");
                        }
                        var args = [call.old, call.returnValue];
                        for (var i = 0; i < call.arguments.length; i++) {
                            args.push(call.arguments[i]);
                        }
                        call.func._post.apply(call.subject, args);
                    } catch (e) {
                        if (e instanceof CERNY.ContractViolation) {
                            e.message = "Postcondition violated: " + e.message;
                            call.logger.fatal(e.message);
                        }

                        // Really throw everything? Even the
                        // ContractViolation? For now: yes, otherwise
                        // the violation might go unnoticed.
                        throw e;
                    }
                }

                // Invariant
                if (isFunction(call.subject.invariant)) {
                    try {
                        call.subject.invariant();
                    } catch (e) {
                        if (e instanceof CERNY.ContractViolation) {
                            e.message = "Invariant violated: " + e.message;
                            call.logger.fatal(e.message);
                        }
                        throw e;
                    }
                }
            }
            delete(call.old);
        }
    }

})();

/*
 * The configuration cut.
 *
 * Anything that depends on something that is done in CERNY.configure
 * must be defined after this cut. Anything that is defined in
 * CERNY.configure will only apply after this cut.
 */
if (isFunction(CERNY.configure)) {
    CERNY.configure();
}

// From now on everything can be subject to interception
// Interception cont., more basic function
(function() {

    var dump = CERNY.dump;
    var method = CERNY.method;
    var print = CERNY.print;
    var signature = CERNY.signature;

    /**
     * Instrument methods of an object for interception. Can be called
     * multiple times with the same effect, only depending on
     * <code>CERNY.Configuration.Interception.active</code> or the passed
     * interceptors.
     *
     * This function does not work on the <code>window</code> object in IE.
     *
     * If one overrides methods of an existing object, where interception
     * was already installed with this function and use this function
     * again to intercept the method, the old method will be installed and
     * a information will be logged. This is unfortunate, but is necessary
     * so that interception always has the same effect. Workaround: Use
     * <code>CERNY.method</code> to attach the methods (best to both, but
     * definitely when overriding) instead.
     *
     * obj - the object to intercept methods of
     * arguments - strings or regexps specifying which functions to intercept. If none are specified
     *             all functions are intercepted; or an array of interceptors, if not present configured
     *             interceptors are used, if more than one array is given, the last one will be used.
     * return - an array of the names of the intercepted functions
     */
    function intercept(obj) {
        var intercepted = [], specs = [], spec, intercept, i, j, name, newName, interceptors, count, logger = CERNY.Logger("CERNY.intercept");

        // Check if obj features hasOwnProperty
        // In IE the window object doesn't.
        if (!isFunction(obj.hasOwnProperty)) {
            print("The object of interception does not feature the method 'hasOwnProperty'.");
            print("Interception cannot be applied.");
            return intercepted;
        }

        // Output the name of the logger, so identify of obj can be determined
        if (obj.logger) {
            logger.debug("obj.logger.name: " + obj.logger.name);
        }

        for (var i = 1; i < arguments.length; i++) {
            if (isArray(arguments[i])) {
                interceptors = arguments[i];
            } else {
                specs.push(arguments[i]);
            }
        }

        if (specs.length == 0) {
            specs.push(/.*/);
        }

        // Iterate over all parameters, that specify a function name
        for (i = 0; i < specs.length; i++) {
            spec = specs[i];

            var count = 0;

            // Iterate over all properties in object and install
            // interceptions on all functions which follow the current
            // specification
            for (name in obj) {
                intercept = false;
                if (isFunction(obj[name]) && obj.hasOwnProperty(name)) {
                    if (isString(spec)) {
                        if (name == spec) {
                            intercept = true;
                        }
                    } else if (isRegexp(spec)) {
                        if (name.match(spec)) {
                            intercept = true;
                        }
                    }
                }

                if (intercept) {

                    count += 1;

                    // Create a garage for intercepted methods
                    if (!isObject(obj["_intercepted"])) {
                        obj._intercepted = {};
                    }

                    // If interception was already installed on this
                    // object for this function, get it from the garage!
                    if (isFunction(obj._intercepted[name])) {
                        logger.info("Intercepted method '" + name + "' already existing . Using existing one, not passed one.");
                        obj[name] = obj._intercepted[name];
                    }

                    // Park the intercepted method
                    obj._intercepted[name] = obj[name];

                    // Install interception
                    CERNY.method(obj, name, obj._intercepted[name], interceptors);
                    intercepted.push(name);
                }
            }

            if (isString(spec) && count == 0) {
                logger.error("Method specified, but not intercepted: " + spec);
            }

        }

        return intercepted;
    };
    signature(intercept, Array, ["object", "function"], ["undefined", "string", RegExp, Array]);
    method(CERNY, "intercept", intercept);

    /*
     * Check the type of a value. Throws a <code>TypeError</code> if type
     * of value does not match type.
     *
     * type - the type to check the value against
     * value - the value to check the type of
     * throwException - whether to throw an TypeError Exception or not; defaults to true
     * return - true, if the value is of the type; false, otherwise and if
     *          throwException is false
     */
    function checkType(type, value, throwException) {
        if (!isBoolean(throwException)) {
            throwException = true;
        }

        var logger = CERNY.Logger("CERNY.checkType"), message = null;
        switch (typeof type) {
        case "string":
            switch (type) {
            case "any":
                break;

            case "null":
                if (value !== null) {
                    message = "Type error: " + dump(value) + "should be of type null";
                }
                break;

            default:
                if (typeof value != type) {
                    message = "Type error: " + dump(value) + " should be of type " + type;
                }
                break;
            }
            break;

        case "function":
            if (!CERNY.instanceOf(value, type)) {
                message = "Type error: " + dump(value);
                if (type.prototype.constructor.name) {
                    message += " should be of type "  + type.prototype.constructor.name;
                }
            }
            break;

        case "object":
            if (isArray(type)) {
                var typeError = true;
                for (var i = 0; i < type.length && typeError; i++) {
                    typeError = !CERNY.checkType(type[i], value, false);
                }

                if (typeError) {
                    message = "Type error (Array): " + dump(value);
                }
            }
            break;

        case "undefined":
            if (typeof value !== "undefined") {
                message = "Type error: " + dump(value) + " should be undefined";
            }
            break;


        default:
            logger.error("Type not handled: " + dump(type));
        }

        if (message) {
            if (throwException) {
                throw new TypeError(message);
            }
            return false;
        }
        return true;
    };
    // signature(checkType, "boolean", "any", ["string","function"], ["undefined", "boolean"]);
    method(CERNY, "checkType", checkType);

    /**
     * Create a namespace in <code>CERNY</code>.
     * This function is inspired by the Yahoo! UI Library [YUI].
     *
     * name - the name of the namespace to create
     * parentNameSpace - the parent name space, default is <code>CERNY</code>
     */
    function namespace(name, parentNameSpace) {
        var i,
        parentNameSpace = parentNameSpace || CERNY,
        segments = name.split(".");

        for (i = 0; i < segments.length; i++) {
            if (!parentNameSpace.hasOwnProperty(segments[i])) {
                parentNameSpace[segments[i]] = {};

            }
            parentNameSpace = parentNameSpace[segments[i]];
        }
        return parentNameSpace;
    };
    signature(namespace, "object", "string", ["undefined", "object"]);
    method(CERNY, "namespace", namespace);

    /**
     * Join functions into one function. The new function returns the
     * return value of the last function.
     *
     * arguments - the functions to join
     * return - the new function
     */
    function joinFunctions() {
        var args = arguments;
        return function() {
            var result;
            for (var i = 0; i < args.length; i++) {
                result = args[i].apply(this, arguments);
            }
            return result;
        };
    };
    signature(joinFunctions, "function", "function");
    method(CERNY, "joinFunctions", joinFunctions);

    /**
     * Returns the argument.
     *
     * arg - argument
     * return - returns the argument
     */
    function identity(arg) {
        return arg;
    }
    signature(identity, "any", "any");
    method(CERNY, "identity", identity);

    /**
     * The empty function.
     *
     */
    function empty() {
    };
    signature(empty, "undefined");
    method(CERNY, "empty", empty);

    /**
     * Check whether an expression is present during runtime.
     *
     * exp - the expression to check, a string
     * return - <code>false</code>, if the string does not reference anything
     *          or the string references <code>undefined</code>
     */
    function isPresent(exp) {
        var present = true, result, logger= CERNY.Logger("CERNY.isPresent");
        try {
            result = eval(exp);
            if (isUndefined(result)) {
                present = false;
            }
            logger.debug("result: "+ dump(result));
        } catch (e) {
            logger.debug("exception: " + e);
            present = false;
        }
        return present;
    };
    signature(isPresent, "boolean", "string");
    method(CERNY, "isPresent", isPresent);

    /**
     * Check for the presence of expressions. Loads an expression by
     * looking it up in the catalog.
     *
     * Resolve external dependencies declared in the catalog.
     *
     * script - the script that requires the expression
     * arguments - the exressions that are required for further execution
     * return - an array of missing expressions with 0 or more items
     */
    function require(script) {
        var exp, present, i, missing = [], missingMsg, logger = CERNY.Logger("CERNY.require"), value, values, location;

        for (i = 1; i < arguments.length; i++) {

            exp = arguments[i];
            logger.debug("exp: '" + exp + "'");

            if (isString(exp)) {
                present = CERNY.isPresent(exp);
                if (!present) {

                    // Lookup the expression in the catalog
                    try {
                        value = CERNY.Catalog.lookup(exp);
                    } catch (e) {
                        throw new Error("Catalog does not resolve: '" + exp + "'");
                    }

                    // Split it by comma to get external dependencies
                    values = value.split(",");

                    // Are dependecies present in the value of the expression?
                    if (values.length == 1) {

                        // No, there is only the location present!
                        location = values[0];
                    } else {

                        // Yes, at the end there is the
                        // location of the file!
                        location = values.pop();

                        // Call require with all but the last and
                        // the current required expression as the
                        // first argument
                        values.unshift(exp);
                        CERNY.require.apply(CERNY, values);
                    }
                    CERNY.load(location);
                    present = CERNY.isPresent(exp);
                }
                if (!present) {
                    logger.error("Expression missing: " + exp);
                    missing.push(exp);
                }
            }
        }
        if (missing.length > 0) {
            for (i = 0; i < missing.length; i++) {
                if (missingMsg) {
                    missingMsg += ", ";
                } else {
                    missingMsg = script + " is missing ";
                }
                missingMsg += missing[i];
            }
            logger.fatal(missingMsg + "!");
            CERNY.print(missingMsg + "!");
        }

        return missing;
    };
    signature(require, Array, "string", ["undefined", "string"]);
    method(CERNY, "require", require);

    // ie6
    if (typeof XMLHttpRequest == 'undefined') {
        XMLHttpRequest = function() {
            return new ActiveXObject("Microsoft.XMLHTTP");
        };
    }

    /**
     * Load a script. This function is called in
     * <code>require</code>. It has different implementations in
     * various environments (browser, Rhino [RHI]). The default
     * runtime enviornment is the browser.
     *
     * location - the location of the script to load
     */
    function load(location) {
        if (isUndefined(location)) {
            return;
        }
        var logger = CERNY.Logger("CERNY.load");
        try {
            var sourceCode = CERNY.getResource(location);
            if (window.execScript) {
                window.execScript(sourceCode);
            } else {
                window.eval(sourceCode);
            }
        } catch (e) {
            var msg = "Script at location '" + location + "' could not be loaded. " +
                "Exception: " + e.message;
            logger.error(msg);
            throw new Error(msg);
        }
    };
    signature(load, "undefined", ["undefined", "string"]);
    method(CERNY, "load", load);

    /**
     * Load some data, can be an object, an array, a function or a
     * primitive value.
     *
     * location - the location of the data
     * return - the evaluated data
     */
    function loadData(location) {
        eval("var obj = " + CERNY.getResource(location));
        return obj;
    }
    signature(loadData, "any", "string");
    method(CERNY, "loadData", loadData);

    /**
     * Get a resource.
     *
     * location - the location of the resource
     * return - the content of the resource
     */
    function getResource(location) {
        var request = new XMLHttpRequest();
        request.open("GET", location, false);
        request.send(null);
        if (request.status >= 400) {
            throw new Error("HTTP status code: " + request.status + " " + request.statusText);
        }
        return request.responseText;
    };
    signature(getResource, "string", "string");

    // This method is not overwritten if present for the following
    // reason: this method is used when reading the catalog at the end
    // of this file, it must therefore be specified before this file
    // in other enviroments.
    if (!CERNY.getResource) {
        method(CERNY, "getResource", getResource);
    }

    /**
     * Dictionary augmentor.
     *
     * A dictionary is a mapping from terms to
     * definitions. Definitions may contain variables, which are terms
     * with curly braces. A term can be looked up in a dictionary to
     * get its definition by <code>lookup</code>. Any string can be
     * evaluated by <code>evaluate</code>.
     *
     * A dictionary may contain a property <code>include</code>
     * holding an array of strings denoting paths of dictionaries that
     * will be included.
     *
     * obj - the obj that will be augmented
     * return - obj
     */
    function Dictionary(obj) {
        obj.logger = CERNY.Logger("CERNY.Dictionary");
        method(obj, "lookup", lookup);
        method(obj, "evaluate", evaluate);
        processInclude(obj);
        return obj;
    };
    signature(Dictionary, "object", "object");
    CERNY.Dictionary = Dictionary;

    /**
     * Lookup a term in this dictionary.
     *
     * Before 1.5: Return undefined if a term is not found.
     * Staring with 1.5: Throw error if a term is not found.
     *
     * term - the term to lookup
     * return - the value of the term in the dictionary
     *          or <code>undefined</code> if the term is unknown
     */
    function lookup(term) {
        var value = this[term];
        if (isString(value)) {
            return this.evaluate(value, term);
        } else {
            throw new Error("Term '" + term + "' could not be found in this dictionary.");
        }
    };
    signature(lookup, ["undefined", "string"], "string");

    /**
     * Evaluate a string. Replaces all variables
     * in the string by its definitions in this dictionary.
     *
     * str - the string to evaluate
     * context - the context in which the evaluation takes place, a
     *           term; too avoid recursion
     * return - the evaluated string
     */
    function evaluate(str, context) {
        var subTerms = str.match(/{.*?}/g),
        subTerm,
        subTermStr;
        if (subTerms) {
            for (var i = 0; i < subTerms.length; i++) {

                // Lookup the next sub term
                subTerm = subTerms[i].substring(1, subTerms[i].length - 1);

                // Break recursion
                if (context && context === subTerm) {
                    continue;
                }

                subTermStr = this.lookup(subTerm);

                // Replace all occurrences
                while (str.indexOf(subTerm) >= 0) {
                    str = str.replace("{" + subTerm + "}",
                                          subTermStr);
                }
            }
        }
        return str;
    }
    signature(evaluate, "string", "string", ["undefined", "string"]);

    /*
     * Process the include property in dictionary. When successful
     * dictionary knows all terms of included dictionaries.
     *
     * dictionary - the dictionary to process the includes
     */
    function processInclude(dictionary) {
        var include = dictionary.include;
        if (include) {
            for (var i = 0; i < include.length; i++) {

                // Load included dictionary
                eval ("var inclDict = " + CERNY.getResource(dictionary.evaluate(include[i])));

                // Copy all known terms to the included dictionary,
                // before augmentation, so that processInclude will
                // benefit from them.
                copyTerms(dictionary, inclDict);

                // Process includes and augment dictionary with lookup and evaluate.
                Dictionary(inclDict);

                // Copy all terms from the included dictionary
                copyTerms(inclDict, dictionary);
            }
        }
    }

    /*
     * Copy all unknown terms from source into destination.
     *
     * source - the object that will provide terms
     * destination - the object that will receive terms
     */
    function copyTerms(source, destination) {
        for (var term in source) {
            if (isString(source[term]) && typeof destination[term] === "undefined") {
                destination[term] = source[term];
            }
        }
    }

    CERNY.Catalog = Dictionary(CERNY.Configuration.Catalog);

    CERNY.require("CERNY");

    CERNY.namespace("event");
    CERNY.namespace("http");
    CERNY.namespace("js");
    CERNY.namespace("js.doc");
    CERNY.namespace("json");
    CERNY.namespace("text");

})();

/*
 * The following functions make type checking shorter. They are taken
 * from [DCR]. With type checking available their usage should be
 * reduced to a minimum.
 */
function isAlien(a) {
    return isObject(a) && typeof a.constructor != 'function';
}

function isArray(a) {
    return isObject(a) && a.constructor == Array;
}

function isBoolean(a) {
    return typeof a == 'boolean';
}

function isFunction(a) {
    return typeof a == 'function';
}

function isNull(a) {
    return typeof a == 'object' && !a;
}

function isNumber(a) {
    return typeof a == 'number' && isFinite(a);
}

function isObject(a) {
    return (a && typeof a == 'object') || isFunction(a);
}

function isString(a) {
    return typeof a == 'string';
}

function isUndefined(a) {
    return typeof a == 'undefined';
}

function isRegexp(a) {
    return isObject(a) && a.constructor == RegExp;
}

function isDate(a) {
    return isObject(a) && a.constructor == Date;
}


CERNY.Glossary = {
    "Appender": "A function used for log output. It must take one string parameter.",
    "Fulfilling a predicate": "An object or value is said to fulfill a predicate, if it returns true on application.",
    "Interception": "Method call interception. A programming technique to allow separation of concerns.",
    "Predicate": "A function which takes an argument and returns true or false.",
    "Script": "A file containing JavaScript code."
};

CERNY.References = {
    "DCP": {title: "Prototypal Inheritance in JavaScript",
            author: "Douglas Crockford",
            uri: "http://javascript.crockford.com/prototypal.html"},
    "DCR": {title: "Remedial JavaScript",
            author: "Douglas Crockford",
            uri: "http://javascript.crockford.com/remedial.html"},
    "JSO": {title: "Introducing JSON",
            author: "Douglas Crockford",
            uri: "http://www.json.org/"},
    "RHI": {title: "Rhino: JavaScript for Java",
            uri: "http://www.mozilla.org/rhino/"},
    "YUI": {title: "The YUI library",
            uri: "http://sourceforge.net/projects/yui"}
};
