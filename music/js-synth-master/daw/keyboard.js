
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oLastEvent;
    var heldKeys = {};
    var aKeyPressCallbacks = [];
    var aKeyReleaseCallbacks = [];

    document.onkeyup = function(oEvent) {
        console.log(oEvent.keyCode);
        oLastEvent = null;
        delete heldKeys[oEvent.keyCode];
        for (var i = 0; i < aKeyReleaseCallbacks.length; i++) {
            aKeyReleaseCallbacks[i](oEvent.keyCode);
        }
        var sCurrentActiveTag = document.activeElement.tagName.toLowerCase();
        if (sCurrentActiveTag !== 'input' &&
            sCurrentActiveTag !== 'textarea'
        ) {
            oEvent.preventDefault();
            oEvent.stopImmediatePropagation();
        }
    };

    document.onkeydown = function(oEvent) {
        if (oLastEvent && oLastEvent.keyCode == oEvent.keyCode) {
            return;
        }
        oLastEvent = oEvent;
        heldKeys[oEvent.keyCode] = true;
        for (var i = 0; i < aKeyPressCallbacks.length; i++) {
            aKeyPressCallbacks[i](oEvent.keyCode);
        }
        if (oEvent.keyCode >= Lazerbahn.keyboard.KEY_LEFT
            && oEvent.keyCode <= Lazerbahn.keyboard.KEY_DOWN
            || oEvent.keyCode <= Lazerbahn.keyboard.KEY_SPACE
        ) {
            var sCurrentActiveTag = document.activeElement.tagName.toLowerCase();
            if (sCurrentActiveTag !== 'input' &&
                sCurrentActiveTag !== 'textarea'
                ) {
                oEvent.preventDefault();
                oEvent.stopImmediatePropagation();
            }
        }
    };

    Lazerbahn.keyboard = {
        onKeyPress: function (cCallable) {
            aKeyPressCallbacks.push(cCallable);
        },
        onKeyRelease: function (cCallable) {
            aKeyReleaseCallbacks.push(cCallable);
        },
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_LEFT: 37,
        KEY_SPACE: 32
    }

})();