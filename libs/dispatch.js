//
// Dispatcher. Register to hear about main events such as ProgramStart, Awake, Start, Update, etc.
//
var DispatchEvent;
(function (DispatchEvent) {
    DispatchEvent[DispatchEvent["ProgramStart"] = 0] = "ProgramStart";
    DispatchEvent[DispatchEvent["Awake"] = 1] = "Awake";
    DispatchEvent[DispatchEvent["Start"] = 2] = "Start";
    DispatchEvent[DispatchEvent["PostStart"] = 3] = "PostStart";
    DispatchEvent[DispatchEvent["Update"] = 4] = "Update";
    DispatchEvent[DispatchEvent["Render"] = 5] = "Render";
    DispatchEvent[DispatchEvent["ResolutionChange"] = 6] = "ResolutionChange";
    DispatchEvent[DispatchEvent["ExternalMessage"] = 7] = "ExternalMessage";
    DispatchEvent[DispatchEvent["OnApplicationQuit"] = 8] = "OnApplicationQuit";
    DispatchEvent[DispatchEvent["AssetUpdated"] = 9] = "AssetUpdated";
    DispatchEvent[DispatchEvent["Count"] = 10] = "Count";
})(DispatchEvent || (DispatchEvent = {}));
;
var Dispatch = (function () {
    function Dispatch() {
    }
    Dispatch.Register = function (caller) {
        Dispatch.callers.push(caller);
        // Awaken immediately upon creation
        if (Dispatch.programHasLaunched) {
            if (caller.Awake) {
                caller.Awake();
            }
            if (caller.Start) {
                caller.Start();
            }
        }
    };
    Dispatch.Dispatch = function (evt, arg, payload) {
        if (arg === void 0) { arg = null; }
        if (payload === void 0) { payload = null; }
        for (var i = 0; i < Dispatch.callers.length; i++) {
            var caller = Dispatch.callers[i];
            switch (evt) {
                case 0 /* ProgramStart */:
                    Dispatch.programHasLaunched = true;
                    if (caller.ProgramStart) {
                        caller.ProgramStart();
                    }
                    break;
                case 1 /* Awake */:
                    if (caller.Awake) {
                        caller.Awake();
                    }
                    break;
                case 2 /* Start */:
                    if (caller.Start) {
                        caller.Start();
                    }
                    break;
                case 3 /* PostStart */:
                    if (caller.PostStart) {
                        caller.PostStart();
                    }
                    break;
                case 4 /* Update */:
                    if (caller.Update) {
                        caller.Update();
                    }
                    break;
                case 5 /* Render */:
                    if (caller.Render) {
                        caller.Render();
                    }
                    break;
                case 8 /* OnApplicationQuit */:
                    if (caller.OnApplicationQuit) {
                        caller.OnApplicationQuit();
                    }
                    break;
                case 6 /* ResolutionChange */:
                    if (caller.ResolutionChange) {
                        caller.ResolutionChange();
                    }
                    break;
                case 7 /* ExternalMessage */:
                    if (caller.ExternalMessage) {
                        caller.ExternalMessage(arg, payload);
                    }
                    break;
                case 9 /* AssetUpdated */:
                    if (caller.AssetUpdated) {
                        caller.AssetUpdated(arg, payload);
                    }
            }
        }
    };
    Dispatch.callers = [];
    Dispatch.programHasLaunched = false;
    return Dispatch;
})();
