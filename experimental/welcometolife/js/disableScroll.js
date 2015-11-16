var UserScrollDisabler = function() {

    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    // left: 37, up: 38, right: 39, down: 40
    this.scrollEventKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
    this.$window = $(window);
    this.$document = $(document);

};
UserScrollDisabler.prototype = {

    disable_scrolling : function() {
        var t = this;
        t.$window.on("mousewheel.UserScrollDisabler DOMMouseScroll.UserScrollDisabler", this._handleWheel);
        t.$document.on("mousewheel.UserScrollDisabler touchmove.UserScrollDisabler", this._handleWheel);
        t.$document.on("keydown.UserScrollDisabler", function(event) {
            t._handleKeydown.call(t, event);
        });
    },

    enable_scrolling : function() {
        var t = this;
        t.$window.off(".UserScrollDisabler");
        t.$document.off(".UserScrollDisabler");
    },

    _handleKeydown : function(event) {
        for (var i = 0; i < this.scrollEventKeys.length; i++) {
            if (event.keyCode === this.scrollEventKeys[i]) {
                event.preventDefault();
                return;
            }
        }
    },

    _handleWheel : function(event) {
        event.preventDefault();
    }

};
