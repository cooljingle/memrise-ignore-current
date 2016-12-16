// ==UserScript==
// @name           Memrise Ignore Previous
// @namespace      https://github.com/cooljingle
// @description    Lets you ignore the last word you did
// @match          http://www.memrise.com/course/*/garden/*
// @match          http://www.memrise.com/garden/review/*
// @version        0.0.2
// @updateURL      https://github.com/cooljingle/memrise-ignore-previous/raw/master/Memrise_Ignore_Previous.user.js
// @downloadURL    https://github.com/cooljingle/memrise-ignore-previous/raw/master/Memrise_Ignore_Previous.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function() {

    var shortcutKeyCode = 192; //corresponds to ` but you can replace this with your own shortcut key; see http://keycode.info/

    var b = MEMRISE.garden.boxes,
        ignorePressed = false;

    $('#left-area').append("<a id='ignore-previous'>Ignore Previous Word</a>");
    $('#ignore-previous').click(function() {
        onIgnorePress();
    });

    $(window).keydown(function(e) {
        if(e.which === shortcutKeyCode) {
            onIgnorePress();
        }
    });

    function onIgnorePress() {
        if(b.num > 0) {
            MEMRISE.garden.box_types.PresentationBox.prototype.ignore_press.apply(b._list[b.num - 1].thinguser);
            ignorePressed = true;
        }
    }

    //this gets called as part of ignore_press, we want to skip it
    MEMRISE.garden.boxes.advance = (function() {
        var cached_function = MEMRISE.garden.boxes.advance;
        return function() {
            var skipAdvance = ignorePressed && !b._list[b.num].answered;
            ignorePressed = false; //reset
            if(skipAdvance) {
                var box = b._list[b.num - 1];
                MEMRISE.garden.stats.show_message("ignored word! " + box.thing.columns[box.thinguser.column_a].val);
            } else {
                return cached_function.apply(this, arguments);
            }
        };
    }());
});
