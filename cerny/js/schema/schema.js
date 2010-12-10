/**
 * Filename    : schema.js
 * Author      : Robert Cerny
 * Created     : 2006-07-25
 * Last Change : 2007-09-11
 *
 * Description:
 *   The schema package provides functions for validating a JavaScript
 *   object against a schema. A schema is a JavaScript object
 *   describing a shape (form, schema, pattern). It is composed of
 *   constraints, which have a name and a value. These constraints are
 *   the members of the schema. The name of the constraint is mapped
 *   on an constraint value, which can be a primitive value, a
 *   function, a regular expression or a schema.
 *
 *   The function validate is used to perform validation of an object
 *   against a schema. It returns an object (called validation
 *   report), which contains an error message for every constraint of
 *   the schema, that the object does not conform to. Thus the report
 *   builds up the *same structure* as the the schema. If the object
 *   conforms to the schema, validate returns an empty object. For
 *   convenience the function isValid takes a validation report and
 *   returns true for an empty result and false, if the report
 *   contains errors.
 *
 *   If the constraint value is a function this can be used within the
 *   function to navigate to properties within the object. With
 *   this._parent you can navigate up the object tree. Thus it is not
 *   recommended to perform validation on objects that do contain a
 *   _parent property. When specifying a schema, you should not use
 *   the _parent property either.
 *
 *   If the constraint value is a function the following rules
 *   apply. The function must return true, if the value of the object
 *   fulfills the constraint, otherwise the function should return a
 *   String containing an error message or false, which will produce a
 *   generic error message. Exceptions that occur within the function
 *   are considered an error message also.
 *
 * Usage:
 *   var firefox = {vendor: "Firefox"};
 *   var report = CERNY.schema.validate(window.navigator, firefox);
 *   var valid = CERNY.schema.isValid(report);
 *
 * History:
 *   2007-05-17 Using short names for method and sigmature.
 *   2007-03-15 Added signatures.
 *   2007-02-12 Renamed aspect to constraint.
 *   2007-01-01 Apdated to interceptor concept.
 *   2006-12-13 Generalized optional to work with any type of constraint
 *   2006-12-13 Refactored validate to allow easier access to
 *              validation of a single constraint.
 *   2006-12-08 Modified arrayOf to accept boundaries.
 *   2006-07-25 Created.
 */

CERNY.require("CERNY.schema",
              "CERNY.text.DateFormat",
              "CERNY.js.Date",
              "CERNY.js.String",
              "CERNY.js.Array");

(function() {

    var method = CERNY.method;
    var signature = CERNY.signature;

    CERNY.namespace("schema");

    CERNY.schema.logger = CERNY.Logger("CERNY.schema");

    /**
     * Validate an object against a schema.
     *
     * The schema is a JavaScript object, which is seen as map of
     * properties to either values, functions, regular expressions or
     * schemas. The values of the properties in a schema are called
     * constraints. The object is said to confirm to schema, if all properties
     * of schema exist in object and all values of object match the
     * corresponding constraint.
     *
     * object - the object to validate
     * schema - the schema to validate the object against
     * parent - the parent object; should be absent - only used internally
     * return - a report of the validation results, if the report is empty
     *          the object confirms to the schema, otherwise it contains the
     *          validation errors
     */
    function validate(object, schema, parent) {
        var constraintName, constraint, value, result = {}, str,
        subResult, message, log = CERNY.Logger("CERNY.schema.validate");

        if (!isObject(object) || isNull(object)) {
            throw new Error("object must be an Object.");
        }

        if (!isObject(schema) || isNull(schema)) {
            throw new Error("schema must be an Object.");
        }

        object._parent = parent;

        for (constraintName in schema) {
            if (schema.hasOwnProperty(constraintName)) {
                constraint = schema[constraintName];
                value = object[constraintName];
                log.debug("constraintName: " + constraintName);
                log.debug("value: " + value);

                var subResult = validateConstraint(value, constraint, object);
                log.debug("subResult: " + subResult);
                if (subResult !== null) {
                    result[constraintName] = subResult;
                }
            }
        }

        delete(object._parent);

        return result;
    };
    signature(validate, "object", "object", "object", ["undefined", "object"]);
    method(CERNY.schema, "validate", validate);

    function validateConstraint(value, constraint, object) {

        var result = null, subResult, log = CERNY.Logger("CERNY.schema.validateConstraint");

        // First check if it is a RegExp. Mozilla treats RegExps as
        // functions, thus one can write /\.txt/("info.txt"). In
        // this sense we could skip the distinction between
        // RegExps and Functions, but Opera does not treat them as
        // functions, so we have to treat RegExps separately.
        if (constraint && isRegexp(constraint)) {
            str = value + "";
            if (!str.match(constraint)) {
                result = "'" + str + "' must match " + constraint + ".";
                log.debug("result: " + result);
            }

            // If the value of the property of the schema is a
            // function, apply the function to the value of the
            // object. Bind object to this in the function.
        } else if (isFunction(constraint)) {

            // Since validation is gathering all the errors, it might be
            // that exceptions occur within a function call. These must be
            // caught in order to complete validation.
            try {
                subResult = constraint.call(object, value);
                if (isString(subResult)) {
                    result = subResult;
                } else if (subResult === false) {
                    result = CERNY.schema.printValue(value) + " does not conform to constraint.";
                }
            } catch (e) {
                result = "" + e.message;
            }

            // If the constraint is an object (meaning a schema), check if the
            // value matches that pattern
        } else if (constraint && isObject(constraint)) {
            if (!isUndefined(value)) {
                subResult = CERNY.schema.validate(value, constraint, object);
                if (!CERNY.schema.isValid(subResult)) {
                    log.debug("subResult: " + subResult);
                    result = subResult;
                }
            }

            // Finally if the constraint is just a primitive value, check if
            // they are equal
        } else {
            if (constraint !== value) {
                result = "Must be " + CERNY.schema.printValue(constraint) + " " +
                "but is " + CERNY.schema.printValue(value) + ".";
                log.debug("result: " + result);
            }
        }

        return result;
    }


    /**
     * Return true, if a validation result is empty (containing no
     * validation errors). False, otherwise.
     *
     * validationResult - a return value of CERNY.schema.validate
     * return - True, if no validation errors are in result and false,
     *          otherwise.
     */
    function isValid(validationResult) {
        for (var propertyName in validationResult) {
            if (validationResult.hasOwnProperty(propertyName)) {
                return false;
            }
        }
        return true;
    };
    signature(isValid, "boolean", "object");
    method(CERNY.schema, "isValid", isValid);

    /**
     * Defines the term optional for use in schemas.
     *
     * constraint - the constraint that is optional, can be any type of constraint
     * return - a function that applies the constraint only if the
     *          argument is not undefined or null
     */
    function optional(constraint) {
        return function(value) {
            if (value === null || isUndefined(value)) {
                return true;
            } else {
                return validateConstraint(value, constraint, this);
            }
        }
    };
    // TODO: really any? Definitly not: undefined is not permitted
    signature(optional, "function", "any");
    method(CERNY.schema, "optional", optional);

    /**
     * Defines the term arrayOf for use in schemas. The type can be a
     * function or a schema.
     *
     * type - the schema or function the array should consist of
     * min - the minimum number of items the array should consist of,
     *       if omitted no limit is assumed
     * max - the maximum number of items the array should consist of,
     *       if omitted no limit is assumed
     * return - a function that tests it's arguments against type
     */
    function arrayOf(type, min, max) {
        return function(x) {
            var result = {}, subResult;
            if (!isNumber(min)) {
                min = null;
            }
            if (!isNumber(max)) {
                max = null;
            }

            if (isArray(x)) {

                // Check the limits
                if (min !== null && x.length < min) {
                    return "Must have at least " + min + " items, but has only " + x.length + ".";
                }
                if (max !== null && x.length > max) {
                    return "Must have no more than " + max + " items, but has " + x.length + ".";
                }

                // Check the types
                for (var i = 0; i < x.length; i++) {
                    subResult = validateConstraint(x[i], type, this);

                    if (subResult !== null) {
                        result[i] = subResult;
                    }
                }
            } else {
                return "Must be an array.";
            }
            return result;
        }
    };
    signature(arrayOf, "function", "any", ["undefined","number"], ["undefined","number"]);
    method(CERNY.schema, "arrayOf", arrayOf);

    function oneOf(array) {
        return function(x) {
            if (isArray(array)) {
                if (array.contains(x)) {
                    return true;
                } else {
                    return false;
                }
            }
        };
    };
    signature(oneOf, "function", Array);

    function number(x) {
        if (isNumber(x)) {
            return true;
        }
        return CERNY.schema.printValue(x) + " must be a number.";
    };
    method(CERNY.schema, "number", number);

    function nonEmptyString(value) {
        if (value && isNonEmptyString(value)) {
            return true;
        }
        return CERNY.schema.printValue(value) + " must be a non empty string.";
    };
    method(CERNY.schema, "nonEmptyString", nonEmptyString);

    /**
     * Defines the term ISO date for use in Schemas.
     *
     * str - the string value to check if it is an ISO date
     * return - true, if str is an ISO date string, an error message
     *          otherwise
     */
    function isoDate(str) {
        if (str && Date._parse(str, CERNY.text.DateFormat.ISO) !== null) {
            return true;
        }
        return CERNY.schema.printValue(str) + " must be an ISO date string (yyyy-mm-dd).";
    };
    signature(isoDate, ["boolean", "string"], "string");
    method(CERNY.schema, "isoDate", isoDate);

    function printValue(value) {
        return "Value " + CERNY.dump(value);
    };
    method(CERNY.schema, "printValue", printValue);

}) ();
