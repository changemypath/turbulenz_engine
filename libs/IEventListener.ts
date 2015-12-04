export interface IEventListener {

    // This is called when Turbulenz has been initialized and a program has been started
    ProgramStart?(): void;

    // This is called each frame before the render occurs
    Update?(): void;

    // This is called when a new class is created, only once
    Awake?(): void;

    // This is called when a new class is created, only once, and after Awake is called
    Start?(): void;

    // This is called when a new class is created, only once, and after Start is called
    PostStart?(): void;

    // This is called each frame after Update
    Render?(): void;

    // This is called when the app shuts down
    OnApplicationQuit?(): void;

    // This is called if an external source (e.g. the hosting website) broadcasts a message.
    ExternalMessage?(msg: string, payload: any) : string;

    // This is called when the canvas resizes
    ResolutionChange?(): void;

    // Called when an asset has been changed
    AssetUpdated?(name: string, url: string);
}