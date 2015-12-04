import {Shader,Semantics,Technique,DrawParameters,PhysicsDevice,PhysicsPoint2PointConstraint,PhysicsRigidBody,PhysicsWorld,PhysicsCollisionObject,Texture,RenderTarget,RenderBuffer,InputDevice,TechniqueParameters,IndexBuffer,VertexBuffer,MathDevice,TechniqueParameterBuffer,GraphicsDevice,InputDeviceEventListener,PhysicsCharacter,Sound,SoundDevice,TurbulenzEngine} from '../tslib/turbulenz.d.ts';

declare var turbulenzEngine: TurbulenzEngine;

// Keeps track of basic time information
export class Time {
    public static time: number;
    public static deltaTime: number;
    public static frameCount: number;
    static programStartTime: number;
    static lastFrameTime: number;

    public static OnFirstFrame() {
        Time.programStartTime = turbulenzEngine.time;
        Time.time = 0;
        Time.deltaTime = 0;
        Time.frameCount = 0;
        Time.lastFrameTime = Time.programStartTime;
    }

    public static OnNextFrame() {
        Time.deltaTime = turbulenzEngine.time - Time.lastFrameTime;
        Time.lastFrameTime = turbulenzEngine.time;
        Time.time = turbulenzEngine.time - Time.programStartTime;
        Time.frameCount++;
    }
}