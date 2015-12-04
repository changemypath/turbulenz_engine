import ieventlisteneri = require('./IEventListener.ts');
import tzbehaviori = require('./tzBehavior.ts');
//
// Dispatcher. Register to hear about main events such as ProgramStart, Awake, Start, Update, etc.
//
<<<<<<< HEAD:turbulenz/libs/dispatch.ts
export enum DispatchEvent { ProgramStart, Awake, Start, PostStart, Update, Render, ExternalMessage, OnApplicationQuit, Count };
=======
enum DispatchEvent { ProgramStart, Awake, Start, PostStart, Update, Render,
    ResolutionChange, ExternalMessage, OnApplicationQuit, AssetUpdated, Count };
>>>>>>> 6d0ca73e5a6295eea34e6faaf40212d48b0d09d7:libs/dispatch.ts

export class Dispatch {
    static callers:ieventlisteneri.IEventListener[] = [];
    static programHasLaunched: boolean = false;

    public static Register(caller: ieventlisteneri.IEventListener) {
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
    }

    public static Dispatch(evt: DispatchEvent, arg: string = null, payload: any = null) {
        for (var i=0; i<Dispatch.callers.length; i++) {
            var caller = Dispatch.callers[i];
            switch (evt) {
            case DispatchEvent.ProgramStart:
                Dispatch.programHasLaunched = true;
                if (caller.ProgramStart) {
                    caller.ProgramStart();
                }
                break;
            case DispatchEvent.Awake:
                if (caller.Awake) {
                    caller.Awake();
                }
                break;
            case DispatchEvent.Start:
                if (caller.Start) {
                    caller.Start();
                }
                break;
            case DispatchEvent.PostStart:
                if (caller.PostStart) {
                    caller.PostStart();
                }
                break;
            case DispatchEvent.Update:
                if (caller.Update) {
                    caller.Update();
                }
                break;
            case DispatchEvent.Render:
                if (caller.Render) {
                    caller.Render();
                }
                break;
            case DispatchEvent.OnApplicationQuit:
                if (caller.OnApplicationQuit) {
                    caller.OnApplicationQuit();
                }
                break;
            case DispatchEvent.ResolutionChange:
                if (caller.ResolutionChange) {
                    caller.ResolutionChange();
                }
                break;
            case DispatchEvent.ExternalMessage:
                if (caller.ExternalMessage) {
                    caller.ExternalMessage(arg, payload);
                }
                break;
            case DispatchEvent.AssetUpdated:
                if (caller.AssetUpdated) {
                    caller.AssetUpdated(arg, payload);
                }
            }
        }
    }
}