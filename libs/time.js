// Keeps track of basic time information
var Time = (function () {
    function Time() {
    }
    Time.OnFirstFrame = function () {
        Time.programStartTime = TurbulenzEngine.time;
        Time.time = 0;
        Time.deltaTime = 0;
        Time.frameCount = 0;
        Time.lastFrameTime = Time.programStartTime;
    };
    Time.OnNextFrame = function () {
        Time.deltaTime = TurbulenzEngine.time - Time.lastFrameTime;
        Time.lastFrameTime = TurbulenzEngine.time;
        Time.time = TurbulenzEngine.time - Time.programStartTime;
        Time.frameCount++;
    };
    return Time;
})();
