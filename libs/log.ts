export class Log {
    public static errorCallback(msg) {
        console.error(msg);
        alert(msg);
    }

    public static error(msg, showStack: boolean = true) {
        if (showStack) {
            var err: any = new Error();
            msg = msg + "\n" + (err.stack);
        }
        console.error(msg);
    }

    public static warning(msg, showStack: boolean = true) {
        if (showStack) {
            var err: any = new Error();
            msg = msg + "\n" + (err.stack);
        }
        console.warn(msg);
    }

    public static trace(msg, showStack: boolean = false) {
        if (showStack) {
            var err: any = new Error();
            msg = msg + "\n" + (err.stack.replace("Error\n", ""));
        }
        console.log(msg);
    }

    //Spits out values of a v3 instead of [float32array] garbage
    public static traceV3(msg, vec) {
        console.log(msg + vec[0] + ", " + vec[1] + ", " + vec[2]);
    }
}