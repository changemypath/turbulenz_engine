// Allows for the use of IsKeyDown, etc.
var Input = (function () {
    function Input() {
    }
    //Use these to determine whether or not keys are pressed
    Input.IsKeyDown = function (keycode) {
        return Input.keysPressed[keycode];
    };
    Input.IsKeyJustDown = function (keycode) {
        return Input.keysJustPressed[keycode];
    };
    Input.Init = function () {
        if (Input.initComplete)
            return;
        inputDevice.addEventListener('keydown', Input.OnKeyDown.bind(this));
        inputDevice.addEventListener('keyup', Input.OnKeyUp.bind(this));
        Input.keyCodes = inputDevice.keyCodes;
        for (var keyCode in Input.keyCodes) {
            if (Input.keyCodes.hasOwnProperty(keyCode)) {
                Input.intToKeyCode[Input.keyCodes[keyCode]] = keyCode;
            }
        }
        Input.initComplete = true;
    };
    //Called from UpdateManager's Update function
    Input.UpdateKeysJustPressed = function () {
        for (var property in Input.keysJustPressed)
            Input.keysJustPressed[property] = false;
    };
    Input.OnKeyDown = function (controlCode) {
        var unicodeObject = inputDevice.convertToUnicode([controlCode]);
        var unicode = unicodeObject[controlCode];
        var keyCode = Input.intToKeyCode[controlCode];
        Input.keysPressed[keyCode] = true;
        Input.keysJustPressed[keyCode] = true;
        if (g_logKeyboardInput)
            console.log("onKeyDown unicode: " + unicode + ", keyCode: " + keyCode);
    };
    Input.OnKeyUp = function (controlCode) {
        var unicodeObject = inputDevice.convertToUnicode([controlCode]);
        var unicode = unicodeObject[controlCode];
        var keyCode = Input.intToKeyCode[controlCode];
        delete Input.keysPressed[keyCode];
        delete Input.keysJustPressed[keyCode];
    };
    Input.intToKeyCode = {};
    Input.keysPressed = {}; //Keys currently pressed.
    Input.keysJustPressed = {}; //keys pressed down this frame
    return Input;
})();
