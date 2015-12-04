import geometry = require('../tslib/geometry.ts');
import material = require('../tslib/material.ts');
import scenenode = require('../tslib/scenenode.ts');
import {Shader,Semantics,Technique,DrawParameters,PhysicsDevice,PhysicsPoint2PointConstraint,PhysicsRigidBody,PhysicsWorld,PhysicsCollisionObject,Texture,RenderTarget,RenderBuffer,InputDevice,TechniqueParameters,IndexBuffer,VertexBuffer,MathDevice,TechniqueParameterBuffer,GraphicsDevice,InputDeviceEventListener,PhysicsCharacter,Sound,SoundDevice} from '../tslib/turbulenz.d.ts';

export interface EmitterParticle {
    velocity: any;
    position: any;
    dieTime: number;
    size: number;
    color: any;
    invlifeTime: number;
}
export declare class EmitterParticleSystem {
    static version: number;
    md: MathDevice;
    numActiveParticles: number;
    spawnNextParticle: number;
    worldPosition: any;
    particles: EmitterParticle[];
    dirtyWorldExtents: boolean;
    colorList: any[];
    v3temp: any;
    extents: Float32Array;
    maxSpawnTime: number;
    minSpawnTime: number;
    diffSpawnTime: number;
    maxLifetime: number;
    minLifetime: number;
    diffLifetime: number;
    size: number;
    growRate: number;
    maxParticles: number;
    gravity: number;
    geometryInstance: geometry.GeometryInstance;
    indexBuffer: IndexBuffer;
    setWorldPosition(worldPosition: any): void;
    createParticle(particle: any): void;
    initialize(): void;
    update(currentTime: any, deltaTime: any): void;
    getWorldExtents(): Float32Array;
    destroy(): void;
    static create(md: MathDevice, gd: GraphicsDevice, parameters: any): EmitterParticleSystem;
}
export declare class EmitterParticleSystemRenderer {
    static version: number;
    gd: GraphicsDevice;
    md: MathDevice;
    update(particleSystem: any, camera: any): void;
    updateRenderableWorldExtents(particleSystem: any): void;
    initialize(particleSystem: any, material: any, node: any): void;
    destroy(particleSystems: any): void;
    static create(gd: GraphicsDevice, md: MathDevice): EmitterParticleSystemRenderer;
}
export declare class Emitter {
    static version: number;
    gd: GraphicsDevice;
    md: MathDevice;
    particleSystem: EmitterParticleSystem;
    particleSystemRenderer: EmitterParticleSystemRenderer;
    material: material.Material;
    node: scenenode.SceneNode;
    updateExtentsTime: number;
    update(currentTime: any, deltaTime: any, camera: any): void;
    setMaterial(material: any): void;
    setParticleColors(colorList: any): void;
    getNumActiveParticles(): number;
    destroy(): void;
    static create(gd: GraphicsDevice, md: MathDevice, material: any, node: any, parameters: any): Emitter;
}
