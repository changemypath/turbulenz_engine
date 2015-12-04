import turbulenzservices = require('../tslib/services/turbulenzservices');
import draw2d = require('../tslib/draw2d.ts');
var Draw2D = draw2d.Draw2D;
import camerai = require('../tslib/camera.ts');
import {UpdateManager} from './updateManager';
import {PhysicsManager} from '../tslib/physicsmanager.ts';
import {Scene} from '../tslib/scene.ts';
// Mix in debugging functions, export the result.
// import {Scene} from '../tslib/scenedebugging.ts';
import texturemanageri = require('../tslib/texturemanager.ts');
import effectmanageri = require('../tslib/effectmanager.ts');
import floori = require('../tslib/floor.ts');
import defaultrenderingi = require('../tslib/defaultrendering.ts');
import helperfunctionsi = require('./helperfunctions.ts');
import inputi = require('./input.ts');
import g = require('./globals.ts');
import requesthandleri = require('../tslib/requesthandler.ts');
import shadermanageri = require('../tslib/shadermanager.ts');
import fontmanageri = require('../tslib/fontmanager.ts');
import { debug } from '../tslib/debug.ts';
import dispatchi = require('./dispatch.ts');
import {Log} from '../../turbulenz/libs/log.ts';
import {Shader,Semantics,Technique,DrawParameters,PhysicsDevice,PhysicsPoint2PointConstraint,PhysicsRigidBody,PhysicsWorld,PhysicsCollisionObject,Texture,RenderTarget,RenderBuffer,InputDevice,TechniqueParameters,IndexBuffer,VertexBuffer,MathDevice,TechniqueParameterBuffer,GraphicsDevice,InputDeviceEventListener,PhysicsCharacter,Sound,SoundDevice,TurbulenzEngine} from '../tslib/turbulenz.d.ts';
import turbulenzi = require('../tslib/turbulenz.d.ts');
import {turbulenzEngine} from '../tslib/turbulenz.d';
import {Time} from './time.ts';
import {SceneLoader} from '../samples/scripts/sceneloader.d.ts';
import {SimpleSceneLoader} from './simplesceneloader.d.ts';
import {SimpleFontRenderer} from './simplefonts.d.ts';

declare var require:(input:any)=>any;

// This class takes care of initialization tasks
export class Init {

    static loading : boolean = true;

    public static appCreate() {
	var SimpleFontRenderer = require('simplefontsimpl').SimpleFontRenderer;

        var SceneLoader = require('sceneloader').SceneLoader;
	var SimpleSceneLoader = require('simplesceneloader').SimpleSceneLoader;

        Time.OnFirstFrame();

        // Misc startup stuff
        var previousFrameTime = turbulenzEngine.time;
        var versionElem = document.getElementById("engine_version");
        if (versionElem)
            versionElem.innerHTML = turbulenzEngine.version;

        // Input
        var inputDeviceParameters = {};
        g.inputDevice = turbulenzEngine.createInputDevice(inputDeviceParameters);
        inputi.Input.Init();

        // Create all the necessary objects
        g.graphicsDevice = turbulenzEngine.createGraphicsDevice({});

        //If the window size changes we might need to update these
        g.viewport = {
            top: 0,
            bottom: g.graphicsDevice.height,
            left: 0,
            right: g.graphicsDevice.width,
            width: g.graphicsDevice.width,
            height: g.graphicsDevice.height
        };

        g.mathDevice = turbulenzEngine.createMathDevice({});
        g.physicsDevice = turbulenzEngine.createPhysicsDevice({});
        var dynamicsWorldParameters = {
            gravity: [0, -50, 0]
        }
        g.dynamicsWorld = g.physicsDevice.createDynamicsWorld(dynamicsWorldParameters);
        g.physicsManager = PhysicsManager.create(g.mathDevice, g.physicsDevice, g.dynamicsWorld);
        g.scene = Scene.create(g.mathDevice);
        g.sceneLoader = SceneLoader.create();
        g.simpleSceneLoader = SimpleSceneLoader.create();
        g.requestHandler = requesthandleri.RequestHandler.create({});
        g.gameSession = turbulenzservices.TurbulenzServices.createGameSession(g.requestHandler, Init.gameSessionCreated);
        g.textureManager = texturemanageri.TextureManager.create(g.graphicsDevice, g.requestHandler, null, Log.errorCallback);
        g.shaderManager = shadermanageri.ShaderManager.create(g.graphicsDevice, g.requestHandler, null, Log.errorCallback);
        g.fontManager = fontmanageri.FontManager.create(g.graphicsDevice, g.requestHandler);
	// simplefontrenderer.fontManager = g.fontManager; // simulate global fontManager.
        g.effectManager = effectmanageri.EffectManager.create();
        g.draw2D = Draw2D.create({graphicsDevice: g.graphicsDevice});
        g.simpleFont = SimpleFontRenderer.create();

        // Camera
        g.deviceWidth = g.graphicsDevice.width;
        g.deviceHeight = g.graphicsDevice.height;
        g.camera = camerai.Camera.create(g.mathDevice);
        helperfunctionsi.HelperFunctions.SetCameraFOV(1.0, 1.0);

        // Floor (it's really just a grid)
        g.floor = floori.Floor.create(g.graphicsDevice, g.mathDevice);   //Can we get rid of this?

        // Floor collision is a plane
        var floorShape = g.physicsDevice.createPlaneShape({
            normal : g.mathDevice.v3Build(0, 1, 0),
            distance : 0,
            margin : 0.001
        });

        var floorObject = g.physicsDevice.createCollisionObject({
            shape : floorShape,
            transform : g.mathDevice.m43BuildIdentity(),
            friction : 0.9,
            restitution : 0.1,
            group: g.physicsDevice.FILTER_STATIC,
            mask: g.physicsDevice.FILTER_ALL,
            //onPreSolveContact : addContact,
            //onAddedContacts : addContacts
            //onProcessedContacts : addContacts
            //onRemovedContacts : addContacts
        });

        // Adds the floor collision object to the world
        g.dynamicsWorld.addCollisionObject(floorObject);

        // Final details
        turbulenzEngine.onunload = Init.appDestroyCallback;
    }

    public static Update()
    {
        if (!Init.loading) {
            UpdateManager.Update();
        }
    }

    public static appDestroyCallback()
    {
        turbulenzEngine.clearInterval(g.intervalID);

        dispatchi.Dispatch.Dispatch(dispatchi.DispatchEvent.OnApplicationQuit);

        turbulenzEngine.flush();
    }

    public static tableReceived(mappingTable)
    {
        // Map assets to mappingTable values
        g.textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        g.shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        g.sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        g.simpleSceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        g.fontManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);

        // These use cgfx assets so they have to wait for the mapping table to be
        // created
        Init.createRenderer();

        g.simpleFont.preload();

        //console.log("Init finished initializing");

        // Tell everybody it's time to start caring
        dispatchi.Dispatch.Dispatch(dispatchi.DispatchEvent.ProgramStart);
        dispatchi.Dispatch.Dispatch(dispatchi.DispatchEvent.Awake);
        g.intervalID = turbulenzEngine.setInterval(Init.WaitForObjectsToLoad, 1000 / 60);
    }

    public static WaitForObjectsToLoad() {
        if (g.simpleSceneLoader.isLoading() || g.simpleSceneLoader.isLoadingMesh())
            return;

        //Call all Start functions
        //Log.trace("Init.WaitForObjectsToLoad()");
        dispatchi.Dispatch.Dispatch(dispatchi.DispatchEvent.Start);

        //Call all PostStart functions so objects can do stuff after everything's been loaded and Initialized
        dispatchi.Dispatch.Dispatch(dispatchi.DispatchEvent.PostStart);
        turbulenzEngine.clearInterval(g.intervalID);
        Init.loading = false;

        // Start Update() function
        g.intervalID = turbulenzEngine.setInterval(Init.Update, 1000 / 60);
    }

    public static createRenderer()
    {
        g.renderer = defaultrenderingi.DefaultRendering.create(g.graphicsDevice, g.mathDevice, g.shaderManager, g.effectManager);
        g.renderer.setGlobalLightPosition(g.mathDevice.v3Build(0.5, 100.0, 0.5));
        g.renderer.setAmbientColor(g.mathDevice.v3Build(0.3, 0.3, 0.4));
    }

    public static gameSessionCreated(gameSession)
    {
        var mappingSessionOptions = {
            mappingTablePrefix: "staticmax/",
            assetPrefix: "missing/",
            mappingTableURL: "mapping_table.json",
            urnMapping: {}
        }

        g.mappingTable = turbulenzservices.TurbulenzServices.createMappingTable(g.requestHandler,
            g.gameSession, Init.tableReceived, mappingSessionOptions);
    }
}

