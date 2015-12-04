// This is the project build entry point. It includes turbulenz dependencies

/*global appCreate: false */

/*global AnimationManager: false */
/*global Camera: false */
/*global DefaultRendering: false */
/*global EffectManager: false */
/*global Emitter: false */
/*global Motion: false */
/*global PhysicsManager: false */
/*global RequestHandler: false */
/*global Scene: false */
/*global SceneLoader: false */
/*global ShaderManager: false */
/*global SimpleSceneLoader: false */
/*global TurbulenzEngine: false */
/*global TurbulenzBridge: false */
/*global TextureManager: false */
/*global TurbulenzServices: false */
/*global TouchEvent: false*/

/*{{ javascript("./jslib/animation.js") }}*/
/*{{ javascript("./jslib/animationmanager.js") }}*/
/*{{ javascript("./jslib/camera.js") }}*/
/*{{ javascript("./jslib/defaultrendering.js") }}*/
/*{{ javascript("./jslib/effectmanager.js") }}*/
/*{{ javascript("./jslib/floor.js") }}*/
/*{{ javascript("./jslib/fontManager.js") }}*/
/*{{ javascript("./jslib/geometry.js") }}*/
/*{{ javascript("./jslib/indexbuffermanager.js") }}*/
/*{{ javascript("./jslib/material.js") }}*/
/*{{ javascript("./jslib/physicsmanager.js") }}*/
/*{{ javascript("./jslib/renderingcommon.js") }}*/
/*{{ javascript("./jslib/requesthandler.js") }}*/
/*{{ javascript("./jslib/resourceloader.js") }}*/
/*{{ javascript("./jslib/scene.js") }}*/
/*{{ javascript("./jslib/scenedebugging.js") }}*/
/*{{ javascript("./jslib/scenenode.js") }}*/
/*{{ javascript("./jslib/shadermanager.js") }}*/
/*{{ javascript("./jslib/webgl/soundDevice.js") }}*/
/*{{ javascript("./jslib/soundManager.js") }}*/
/*{{ javascript("./jslib/texturemanager.js") }}*/
/*{{ javascript("./jslib/utilities.js") }}*/
/*{{ javascript("./jslib/vertexbuffermanager.js") }}*/
/*{{ javascript("./jslib/services/gamesession.js") }}*/
/*{{ javascript("./jslib/services/mappingtable.js") }}*/
/*{{ javascript("./jslib/services/turbulenzbridge.js") }}*/
/*{{ javascript("./jslib/services/turbulenzservices.js") }}*/
/*{{ javascript("./samples/scripts/sceneloader.js") }}*/
/*{{ javascript("./libs/simplesceneloader.js") }}*/
/*{{ javascript("./libs/simplefonts.js") }}*/

// Collection class helper library
/*{ { java script("./libs/typ escript-collections/collections.js") }}*/
// / <ref erence path="../libs/typ escript-collections/collections.ts" />

// Turbulenz goodness in ts form
/// <reference path="../tslib/webgl/physicsdevice.ts" /> */
/// <reference path="../tslib/debug.ts" /> */
/// <reference path="../jslib/_generated/draw2D.cgfx.ts" /> */
/// <reference path="../tslib/draw2d.ts" /> */

// Turbulenz goodness in js form
/*{{ javascript("./tslib/webgl/physicsdevice.js") }}*/
/*{{ javascript("./tslib/debug.js") }}*/
/*{{ javascript("./jslib/_generated/draw2d.cgfx.js") }}*/
/*{{ javascript("./tslib/draw2d.js") }}*/


// CMP runtime
/// <reference path="IEventListener.ts" />
// / <refe rence path="log.ts" />
/// <reference path="globals.ts" />
/// <reference path="helperFunctions.ts" />
/// <reference path="time.ts" />
/// <reference path="tzGameObject.ts" />
/// <reference path="tzBehavior.ts" />
/// <reference path="triggerVolume.ts" />
/// <reference path="dispatch.ts" />
/// <reference path="launcher.ts" />
/// <reference path="textObject.ts" />
/// <reference path="updateManager.ts" />
/// <reference path="particleObject.ts" />
/// <reference path="platformManager.ts" />
/// <reference path="skyboxManager.ts" />
/// <reference path="externalCommunication.ts" />
/// <reference path="input.ts" />
/// <reference path="eventTranslator.ts" />
/// <reference path="init.ts" />
/// <reference path="assetLoader.ts" />
/// <reference path="assetManager.ts" />
/// <reference path="audioManager.ts" />

/*{{ javascript("libs/IEventListener.js") }}*/
/*{ { jav ascript("libs/log.js") }}*/
/*{{ javascript("libs/globals.js") }}*/
/*{{ javascript("libs/helperFunctions.js") }}*/
/*{{ javascript("libs/time.js") }}*/
/*{{ javascript("libs/tzGameObject.js") }}*/
/*{{ javascript("libs/tzBehavior.js") }}*/
/*{{ javascript("libs/triggerVolume.js") }}*/
/*{{ javascript("libs/dispatch.js") }}*/
/*{{ javascript("libs/launcher.js") }}*/
/*{{ javascript("libs/textObject.js") }}*/
/*{{ javascript("libs/updateManager.js") }}*/
/*{{ javascript("libs/emitter.js") }}*/
/*{{ javascript("libs/particleObject.js") }}*/
/*{{ javascript("libs/platformManager.js") }}*/
/*{{ javascript("libs/skyboxManager.js") }}*/
/*{{ javascript("libs/externalCommunication.js") }}*/
/*{{ javascript("libs/input.js") }}*/
/*{{ javascript("libs/eventTranslator.js") }}*/
/*{{ javascript("libs/init.js") }}*/
/*{{ javascript("libs/assetLoader.js") }}*/
/*{{ javascript("libs/assetManager.js") }}*/
/*{{ javascript("libs/audioManager.js") }}*/


// Specific project files
/*/// <reference path="../../assets/scripts/all_ts_files.ts" />*/
//  { { javascript("../../assets/scripts/everything.js") } }

// Map js to ts
/// <reference path="../jslib-modular/aabbtree.d.ts" />
/// <reference path="../jslib-modular/floor.d.ts" />
/// <reference path="../jslib-modular/fontmanager.d.ts" />
/// <reference path="../jslib-modular/jsengine_base.d.ts" />
/// <reference path="../jslib-modular/jsengine.d.ts" />
/// <reference path="../jslib-modular/particlesystem.d.ts" />
// / <ref erence path="../tsl ib/services/servicedatatypes.d.ts" />
// / <ref erence path="../jslib-modular/services.d.ts" />
/// <reference path="../jslib-modular/shadermanager.d.ts" />
/// <reference path="../jslib-modular/turbulenz.d.ts" />
// / <ref erence path="../jslib-modular/utilities.d.ts" />
/// <reference path="../jslib-modular/vmath.d.ts" />

/// <reference path="../samples/scripts/sceneloader.d.ts" />

/// <reference path="../libs/additionalDefinitions.d.ts" />
/// <reference path="../libs/emitter.d.ts" />
/// <reference path="../libs/simplesceneloader.d.ts" />
/// <reference path="../libs/simplefonts.d.ts" />

// Turbulenz goodness in ts form
/// <reference path="../tslib/webgl/physicsdevice.ts" /> */

// TurbulenzEngine.onload = function onloadFn()
// {
//     Init.appCreate();
// };


