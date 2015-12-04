// This class takes care of initialization tasks
var Init = (function () {
    function Init() {
    }
    Init.appCreate = function () {
        Time.OnFirstFrame();
        // Misc startup stuff
        var previousFrameTime = TurbulenzEngine.time;
        var versionElem = document.getElementById("engine_version");
        if (versionElem)
            versionElem.innerHTML = TurbulenzEngine.version;
        // Input
        var inputDeviceParameters = {};
        inputDevice = TurbulenzEngine.createInputDevice(inputDeviceParameters);
        Input.Init();
        // Create all the necessary objects
        graphicsDevice = TurbulenzEngine.createGraphicsDevice({});
        //If the window size changes we might need to update these
        viewport = {
            top: 0,
            bottom: graphicsDevice.height,
            left: 0,
            right: graphicsDevice.width,
            width: graphicsDevice.width,
            height: graphicsDevice.height
        };
        mathDevice = TurbulenzEngine.createMathDevice({});
        physicsDevice = TurbulenzEngine.createPhysicsDevice({});
        var dynamicsWorldParameters = {
            gravity: [0, -50, 0]
        };
        dynamicsWorld = physicsDevice.createDynamicsWorld(dynamicsWorldParameters);
        physicsManager = PhysicsManager.create(mathDevice, physicsDevice, dynamicsWorld);
        scene = Scene.create(mathDevice);
        sceneLoader = SceneLoader.create();
        simpleSceneLoader = SimpleSceneLoader.create();
        resourceLoader = ResourceLoader.create();
        requestHandler = RequestHandler.create({});
        gameSession = TurbulenzServices.createGameSession(requestHandler, Init.gameSessionCreated);
        textureManager = TextureManager.create(graphicsDevice, requestHandler, null, Log.errorCallback);
        shaderManager = ShaderManager.create(graphicsDevice, requestHandler, null, Log.errorCallback);
        fontManager = FontManager.create(graphicsDevice, requestHandler);
        effectManager = EffectManager.create();
        animationManager = AnimationManager.create(Log.errorCallback);
        draw2D = Draw2D.create({ graphicsDevice: graphicsDevice });
        simpleFont = SimpleFontRenderer.create();
        // Audio
        soundDevice = TurbulenzEngine.createSoundDevice({});
        soundManager = SoundManager.create(soundDevice, requestHandler);
        var source = soundDevice.createSource({
            position: mathDevice.v3Build(0, 0, 0),
            direction: mathDevice.v3Build(1, 0, 0),
            velocity: mathDevice.v3Build(0, 0, 0),
            gain: 1.0,
            minDistance: 1.0,
            maxDistance: 100.0,
            rollOff: 1.0,
            relative: false,
            looping: false,
            pitch: 1.0
        });
        soundSource = source;
        // Camera
        deviceWidth = graphicsDevice.width;
        deviceHeight = graphicsDevice.height;
        camera = Camera.create(mathDevice);
        HelperFunctions.SetCameraFOV(1.0, 1.0);
        // Floor (it's really just a grid)
        floor = Floor.create(graphicsDevice, mathDevice); //Can we get rid of this?
        // Floor collision is a plane
        var floorShape = physicsDevice.createPlaneShape({
            normal: mathDevice.v3Build(0, 1, 0),
            distance: 0,
            margin: 0.001
        });
        var floorObject = physicsDevice.createCollisionObject({
            shape: floorShape,
            transform: mathDevice.m43BuildIdentity(),
            friction: 0.9,
            restitution: 0.1,
            group: physicsDevice.FILTER_STATIC,
            mask: physicsDevice.FILTER_ALL
        });
        // Adds the floor collision object to the world
        dynamicsWorld.addCollisionObject(floorObject);
        // Basic subsystems
        Init.eventTranslator = new EventTranslator();
        // Final details
        TurbulenzEngine.onunload = Init.appDestroyCallback;
    };
    Init.Update = function () {
        if (!Init.loading) {
            UpdateManager.Update();
        }
    };
    Init.appDestroyCallback = function () {
        TurbulenzEngine.clearInterval(intervalID);
        if (gameSession) {
            gameSession.destroy();
            gameSession = null;
        }
        if (scene) {
            scene.destroy();
            scene = null;
        }
        requestHandler = null;
        sceneLoader = null;
        if (renderer) {
            renderer.destroy();
            renderer = null;
        }
        camera = null;
        mappingTable = null;
        if (textureManager) {
            textureManager.destroy();
            textureManager = null;
        }
        if (shaderManager) {
            shaderManager.destroy();
            shaderManager = null;
        }
        effectManager = null;
        graphicsDevice = null;
        mathDevice = null;
        inputDevice = null;
        Dispatch.Dispatch(8 /* OnApplicationQuit */);
        TurbulenzEngine.flush();
    };
    Init.tableReceived = function (mappingTable) {
        // Map assets to mappingTable values
        textureManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        shaderManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        sceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        simpleSceneLoader.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        fontManager.setPathRemapping(mappingTable.urlMapping, mappingTable.assetPrefix);
        // These use cgfx assets so they have to wait for the mapping table to be
        // created
        Init.createRenderer();
        simpleFont.preload();
        //console.log("Init finished initializing");
        // Tell everybody it's time to start caring
        Dispatch.Dispatch(0 /* ProgramStart */);
        Dispatch.Dispatch(1 /* Awake */);
        intervalID = TurbulenzEngine.setInterval(Init.WaitForObjectsToLoad, 1000 / 60);
    };
    Init.WaitForObjectsToLoad = function () {
        if (simpleSceneLoader.isLoading() || simpleSceneLoader.isLoadingMesh())
            return;
        //Call all Start functions
        //Log.trace("Init.WaitForObjectsToLoad()");
        Dispatch.Dispatch(2 /* Start */);
        //Call all PostStart functions so objects can do stuff after everything's been loaded and Initialized
        Dispatch.Dispatch(3 /* PostStart */);
        TurbulenzEngine.clearInterval(intervalID);
        Init.loading = false;
        // Start Update() function
        intervalID = TurbulenzEngine.setInterval(Init.Update, 1000 / 60);
    };
    Init.createRenderer = function () {
        renderer = DefaultRendering.create(graphicsDevice, mathDevice, shaderManager, effectManager);
        renderer.setGlobalLightPosition(mathDevice.v3Build(0.5, 100.0, 0.5));
        renderer.setAmbientColor(mathDevice.v3Build(0.3, 0.3, 0.4));
    };
    Init.gameSessionCreated = function (gameSession) {
        var mappingSessionOptions = {
            mappingTablePrefix: "staticmax/",
            assetPrefix: "missing/",
            mappingTableURL: "mapping_table.json",
            urnMapping: {}
        };
        mappingTable = TurbulenzServices.createMappingTable(requestHandler, gameSession, Init.tableReceived, mappingSessionOptions);
    };
    Init.loading = true;
    Init.eventTranslator = null;
    return Init;
})();
