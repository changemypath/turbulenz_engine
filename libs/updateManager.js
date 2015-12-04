//
// Manages update cycle including all the per-frame responsibilities
//
var UpdateManager = (function () {
    function UpdateManager() {
    }
    UpdateManager.Update = function () {
        var oldWidth = deviceWidth;
        var oldHeight = deviceHeight;
        // In case the browser was resized
        deviceWidth = graphicsDevice.width;
        deviceHeight = graphicsDevice.height;
        var resolutionChanged = (oldWidth != deviceWidth || oldHeight != deviceHeight);
        Time.OnNextFrame();
        dynamicsWorld.update();
        physicsManager.update();
        //Animations
        var skinnedNodes = scene.skinnedNodes;
        var skinnedNode, sceneNode;
        if (skinnedNodes) {
            for (var skin = 0; skin < skinnedNodes.length; skin += 1) {
                skinnedNode = skinnedNodes[skin];
                if (skinnedNode) {
                    sceneNode = skinnedNode.node;
                    if (!sceneNode.getDisabled()) {
                        //sceneNode.enableHierarchy(true);
                        // The skinned node will peform the update
                        skinnedNode.addTime(Time.deltaTime);
                        skinnedNode.update(true);
                    }
                }
            }
        }
        scene.update();
        // Tell the world the frame is happening
        Dispatch.Dispatch(4 /* Update */);
        // Render frame
        UpdateManager.updateCamera();
        if (graphicsDevice.beginFrame()) {
            // Tell the renderer to render anything that lives in the scene
            graphicsDevice.clear(SkyboxManager.color, 1.0, 0.0);
            if (renderer) {
                if (resolutionChanged) {
                    Dispatch.Dispatch(6 /* ResolutionChange */);
                }
                // Draw backdrop if any
                if (SkyboxManager.backgroundSprite) {
                    for (var x in SkyboxManager.backgroundSprite) {
                        if (resolutionChanged) {
                            SkyboxManager.backgroundSprite.setWidth(deviceWidth);
                            SkyboxManager.backgroundSprite.setHeight(deviceHeight);
                            SkyboxManager.backgroundSprite.x = deviceWidth / 2;
                            SkyboxManager.backgroundSprite.y = deviceHeight / 2;
                        }
                    }
                    draw2D.begin();
                    draw2D.drawSprite(SkyboxManager.backgroundSprite);
                    draw2D.end();
                }
                renderer.update(graphicsDevice, camera, scene, TurbulenzEngine.time);
                if (renderer.updateBuffers(graphicsDevice, deviceWidth, deviceHeight)) {
                    renderer.draw(graphicsDevice);
                }
                if (g_debugMode) {
                    scene.drawPhysicsNodes(graphicsDevice, shaderManager, camera, physicsManager);
                    scene.drawPhysicsGeometry(graphicsDevice, shaderManager, camera, physicsManager);
                }
            }
            // Tell everything that explicitly renders itself to do so
            Dispatch.Dispatch(5 /* Render */);
            simpleFont.render();
            graphicsDevice.endFrame();
        }
        Input.UpdateKeysJustPressed();
    };
    UpdateManager.updateCamera = function () {
        camera.updateViewMatrix();
        camera.updateViewProjectionMatrix();
    };
    return UpdateManager;
})();
