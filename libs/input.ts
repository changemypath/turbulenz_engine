import g = require('./globals.ts');

// Allows for the use of IsKeyDown, etc.
export class Input {
    static keyCodes: any;
    static intToKeyCode: any = {};
    static keysPressed: any = {}; //Keys currently pressed.
    static keysJustPressed: any = {};   //keys pressed down this frame

    static initComplete: any;

    //Use these to determine whether or not keys are pressed
    public static IsKeyDown(keycode) { return Input.keysPressed[keycode]; }
    public static IsKeyJustDown(keycode) { return Input.keysJustPressed[keycode]; }

    public static Init() {
        if (Input.initComplete)
            return;

        g.inputDevice.addEventListener('keydown', Input.OnKeyDown.bind(this));
        g.inputDevice.addEventListener('keyup', Input.OnKeyUp.bind(this));

        Input.keyCodes = g.inputDevice.keyCodes;
        for (var keyCode in Input.keyCodes)
        {
            if (Input.keyCodes.hasOwnProperty(keyCode))
            {
                Input.intToKeyCode[Input.keyCodes[keyCode]] = keyCode;
            }
        }

        Input.initComplete = true;
    }

    //Called from UpdateManager's Update function
    public static UpdateKeysJustPressed() {
        //Set all keysJustPressed to false (there's gotta be a better way to check for new input presses)
        for (var property in Input.keysJustPressed)
            Input.keysJustPressed[property] = false;
    }

    private static OnKeyDown(controlCode) {
        var unicodeObject = g.inputDevice.convertToUnicode([controlCode]);
        var unicode = unicodeObject[controlCode];
        var keyCode = Input.intToKeyCode[controlCode];

        Input.keysPressed[keyCode] = true;
        Input.keysJustPressed[keyCode] = true;

        if (g.g_logKeyboardInput)
            console.log("onKeyDown unicode: " + unicode + ", keyCode: " + keyCode);
    }

    private static OnKeyUp(controlCode) {
        var unicodeObject = g.inputDevice.convertToUnicode([controlCode]);
        var unicode = unicodeObject[controlCode];
        var keyCode = Input.intToKeyCode[controlCode];
        delete Input.keysPressed[keyCode];
        delete Input.keysJustPressed[keyCode];
    }
}