// Copyright (c) 2010-2014 Turbulenz Limited

import {turbulenzEngine} from '../tslib/turbulenz.d';
import {debug} from './debug.ts';
import {Shader,Semantics,Technique,DrawParameters,PhysicsDevice,PhysicsPoint2PointConstraint,PhysicsRigidBody,PhysicsWorld,PhysicsCollisionObject,Texture,RenderTarget,RenderBuffer,InputDevice,TechniqueParameters,IndexBuffer,VertexBuffer,MathDevice,TechniqueParameterBuffer,GraphicsDevice,InputDeviceEventListener,PhysicsCharacter,Sound,SoundDevice,TurbulenzEngine} from '../tslib/turbulenz.d.ts';
import {Scene} from '../tslib/scene.ts';
import {Geometry,GeometryInstance} from './geometry.ts';

/*global Scene*/
/*global Geometry*/
/*global GeometryInstance*/
/*global Utilities*/
/*global TurbulenzEngine*/

interface SceneMetrics
{
    numNodes       : number;
    numRenderables : number;
    numLights      : number;
    numVertices    : number;
    numPrimitives  : number;
};

interface SceneVisibilityMetrics
{
    numPortals       : number;
    numPortalsPlanes : number;
    numLights        : number;
    numRenderables   : number;
    numShadowMaps    : number;
    numOccluders     : number;
};

//
// Scene debugging methods
//

export class Scene {

}
