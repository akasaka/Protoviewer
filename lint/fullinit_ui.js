// init_ui.js
// 2010-11-29


// This is the web browser companion to fulljslint.js. It is an ADsafe
// lib file that implements a web ui by adding behavior to the widget's
// html tags.

// It stores a function in lib.init_ui. Calling that function will
// start up the JSLint widget ui.

// option = {adsafe: true, fragment: false}

/*members check, cookie, each, edition, get, getTitle, getValue, indent,
    isArray, join, jslint, lib, maxerr, maxlen, on, passfail, predef, push,
    q, select, set, split, value, white
*/

"use strict";

ADSAFE.lib("init_ui", function (lib) {
    return function (dom) {
        var checkboxes = '0',
            goodparts = '0',
            indent = '4',
            input = dom.q('#JSLINT_INPUT'),
            jslintstring = '',
            maxerr = '50',
            maxlen = '',
            option = lib.cookie.get(),
            output = dom.q('#JSLINT_OUTPUT'),
            predefined = '';




// Add click event handlers to the [JSLint] and [clear] buttons.

        dom.q('input&jslint').on('click', function (e) {



// Call JSLint and display the report.

            lib.jslint(input.getValue(), {}, output);
            input.select();
            return false;
        }); 

        input
            .on('change', function (e) {
                output.value('');
            })
            .select();
    };
});
