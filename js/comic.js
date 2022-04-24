Murnesty = Murnesty || {};
Murnesty.Comic = function() {

    function test() {
        $.get("https://cors.bridged.cc/https://www.manhuagui.com/")
            .done(function(html) {
                console.log(html);
            });
    }

    function init() {
        test();
    }

    return {
        init: init
    };
}