
// ArrayBuffer
export interface ArrayBuffer
{
    slice(begin: number, end?: number): ArrayBuffer;
}

// Uint8ClampedArray
export interface Uint8ClampedArray extends Uint8Array
{
}

export declare var Uint8ClampedArray:
{
    prototype: Uint8Array;
    new (length: number): Uint8Array;
    new (array: Uint8Array): Uint8Array;
    new (array: number[]): Uint8Array;
    new (buffer: ArrayBuffer, byteOffset?: number, length?: number): Uint8Array;
    BYTES_PER_ELEMENT: number;
};

export interface Float32Array
{
    slice(s: number, e: number): Float32Array; // defined in vmath
    map(offset: number, numFloats: number): any;
    unmap(writer: any): void;
    setData(data: any, offset?: number, numFloats?: number): void;
}

// HTMLImageElement
// interface HTMLImageElement
// {
//     crossOrigin: string;
// }

export declare var window: any;

// Window
export interface Window
{
    XMLHttpRequest:
    {
        prototype: XMLHttpRequest;
        new (): XMLHttpRequest;
        LOADING: number;
        DONE: number;
        UNSENT: number;
        OPENED: number;
        HEADERS_RECEIVED: number;
    };

    ActiveXObject:
    {
        new (s: string): any;
    };

    WebSocket: {
        prototype: WebSocket;
        new (url: string): WebSocket;
        new (url: string, prototcol: string): WebSocket;
        new (url: string, prototcol: string[]): WebSocket;
        OPEN: number;
        CLOSING: number;
        CONNECTING: number;
        CLOSED: number;
    };
    MozWebSocket: {
        prototype: WebSocket;
        new (url: string): WebSocket;
        new (url: string, prototcol: string): WebSocket;
        new (url: string, prototcol: string[]): WebSocket;
        OPEN: number;
        CLOSING: number;
        CONNECTING: number;
        CLOSED: number;
    };

    AudioContext: any;
    webkitAudioContext: any;

    opera: boolean;

    webkitRequestAnimationFrame: any;
    oRequestAnimationFrame: any;
    mozRequestAnimationFrame: any;

}

export interface WebSocket
{
    destroy?: () => void;
}

// Document
export interface Document
{
    webkitCancelFullScreen?: { () : void; };
    cancelFullScreen?: { (): void; };
    exitFullscreen?: { (): void; };

    fullscreenEnabled?: boolean;
    mozFullScreen?: boolean;
    webkitIsFullScreen?: boolean;

    fullscreenElement?: any;
    mozFullScreenElement?: any;
    webkitFullscreenElement?: any;

    pointerLockElement?: any;
    mozPointerLockElement?: any;
    webkitPointerLockElement?: any;

    requestPointerLock?: { (element?: any) : void; };
    mozRequestPointerLock?: { (element?: any): void; };
    webkitRequestPointerLock?: { (element?: any): void; };

    exitPointerLock?: { (element?: any) : void; };
    mozExitPointerLock?: { (element?: any) : void; };
    webkitExitPointerLock?: { (element?: any) : void; };

}

// Navigator
export interface Navigator
{
    gamepads?: any[];
    webkitGamepads?: any[];
    getGamepads?: { (): any[]; };
    webkitGetGamepads?: { (): any[]; };

    hardwareConcurrency?: number;

    pointer: // TODO: Where is this type documented?
    {
        isLocked: boolean;
        lock(any): void;
        unlock(): void;
    };
    webkitPointer:
    {
        isLocked: boolean;
        lock(any): void;
        unlock(): void;
    };

    language: string;
}

export interface HTMLVideoElement
{
    webkitDecodedFrameCount: number;
    crossorigin: string;

    //canPlayType(type: string): boolean
}

export interface HTMLAudioElement
{
    mozSetup(channels: number, sampleRate: number);
}

export interface HTMLCanvasElement
{

}
