var Log = (function () {
    function Log() {
    }
    Log.errorCallback = function (msg) {
        console.error(msg);
        alert(msg);
    };
    Log.error = function (msg, showStack) {
        if (showStack === void 0) { showStack = true; }
        if (showStack) {
            var err = new Error();
            msg = msg + "\n" + (err.stack);
        }
        console.error(msg);
    };
    Log.warning = function (msg, showStack) {
        if (showStack === void 0) { showStack = true; }
        if (showStack) {
            var err = new Error();
            msg = msg + "\n" + (err.stack);
        }
        console.warn(msg);
    };
    Log.trace = function (msg, showStack) {
        if (showStack === void 0) { showStack = false; }
        if (showStack) {
            var err = new Error();
            msg = msg + "\n" + (err.stack.replace("Error\n", ""));
        }
        console.log(msg);
    };
    //Spits out values of a v3 instead of [float32array] garbage
    Log.traceV3 = function (msg, vec) {
        console.log(msg + vec[0] + ", " + vec[1] + ", " + vec[2]);
    };
    return Log;
})();
