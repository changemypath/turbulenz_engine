// Copyright (c) 2011-2012 Turbulenz Limited
import {Shader,Semantics,Technique,DrawParameters,PhysicsDevice,PhysicsPoint2PointConstraint,PhysicsRigidBody,PhysicsWorld,PhysicsCollisionObject,Texture,RenderTarget,RenderBuffer,InputDevice,TechniqueParameters,IndexBuffer,VertexBuffer,MathDevice,TechniqueParameterBuffer,GraphicsDevice,InputDeviceEventListener,PhysicsCharacter,Sound,SoundDevice,TurbulenzEngine,VertexBufferParameters,PhysicsShape,NetworkDevice} from '../turbulenz.d.ts';

"use strict";

//
// WebGLNetworkDevice
//
export class WebGLNetworkDevice implements NetworkDevice
{
    static version = 1;

    WebSocketConstructor: any;  // prototype

    createWebSocket(url:string, protocol?: string): WebSocket
    {
        var WebSocketConstructor = this.WebSocketConstructor;
        if (WebSocketConstructor)
        {
            var ws : WebSocket;
            if (protocol)
            {
                ws = new WebSocketConstructor(url, protocol);
            }
            else
            {
                ws = new WebSocketConstructor(url);
            }
            if (!(typeof ws["destroy"] === "function"))
            {
                ws["destroy"] = function websocketDestroyFn()
                {
                    this.onopen = null;
                    this.onerror = null;
                    this.onclose = null;
                    this.onmessage = null;
                    this.close();
                };
            }
            return ws;
        }
        else
        {
            return <WebSocket>null;
        }
    }

    update()
    {
    }

    static create(params: any): WebGLNetworkDevice
    {
        var nd = new WebGLNetworkDevice();
        return nd;
    }
}

WebGLNetworkDevice.prototype.WebSocketConstructor =
    ((typeof window["WebSocket"] === "function") ? window["WebSocket"] : window["MozWebSocket"]);
