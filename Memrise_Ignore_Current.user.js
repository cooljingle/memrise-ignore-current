// ==UserScript==
// @name           Memrise Ignore Current
// @namespace      https://github.com/cooljingle
// @description    Lets you ignore the current item you're reviewing
// @match          https://www.memrise.com/course/*/garden/*
// @match          https://www.memrise.com/garden/review/*
// @match          https://app.memrise.com/course/*/garden/*
// @match          https://app.memrise.com/garden/review/*
// @version        0.0.4
// @updateURL      https://github.com/cooljingle/memrise-ignore-current/raw/master/Memrise_Ignore_Current.user.js
// @downloadURL    https://github.com/cooljingle/memrise-ignore-current/raw/master/Memrise_Ignore_Current.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function() {

    var shortcutKeyCode = 192; //corresponds to ` but you can replace this with your own shortcut key; see http://keycode.info/

    let onIgnorePress;

    $('#left-area').append("<a id='ignore-current'>Ignore</a>");
    $('#ignore-current').click(function() {
        onIgnorePress();
    });

    $(window).keydown(function(e) {
        if(e.which === shortcutKeyCode) {
            onIgnorePress();
        }
    });

    MEMRISE.garden._events.start.push(() => {
        MEMRISE.garden.session.make_box = (function () {
            var cached_function = MEMRISE.garden.session.make_box;
            return function() {
                const { learnable_id } = arguments[0];
                if(!!learnable_id) {
                    const presentationBox = cached_function.apply(this, [{learnable_id: learnable_id, template: "presentation"}]);
                    onIgnorePress = () => presentationBox.ignore_press.apply({learnable_id: learnable_id});
                }
                var result = cached_function.apply(this, arguments);
                return result;
            };
        }());
    });
});
