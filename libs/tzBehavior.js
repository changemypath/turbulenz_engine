var TzBehavior = (function () {
    function TzBehavior(parent) {
        this.gameObject = parent;
        Dispatch.Register(this);
    }
    return TzBehavior;
})();
