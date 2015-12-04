import inputi = require('./input.ts');
import skyboxmanageri = require('./skyboxManager.ts');
import g = require('./globals.ts');
import ieventlisteneri = require('./IEventListener.ts');
import tzgameobjecti = require('./tzGameObject.ts');
import dispatchi = require('./dispatch.ts');
import {Time} from './time.ts';
import {Shader,Semantics,Technique,DrawParameters,PhysicsDevice,PhysicsPoint2PointConstraint,PhysicsRigidBody,PhysicsWorld,PhysicsCollisionObject,Texture,RenderTarget,RenderBuffer,InputDevice,TechniqueParameters,IndexBuffer,VertexBuffer,MathDevice,TechniqueParameterBuffer,GraphicsDevice,InputDeviceEventListener,PhysicsCharacter,Sound,SoundDevice,TurbulenzEngine} from '../tslib/turbulenz.d.ts';
import {turbulenzEngine} from '../tslib/turbulenz.d.ts';


//
// Manages update cycle including all the per-frame responsibilities
//
export class UpdateManager {
    public static Update() : void {
        var oldWidth: number = g.deviceWidth;
        var oldHeight: number = g.deviceHeight;

        // In case the browser was resized
        g.deviceWidth = g.graphicsDevice.width;
        g.deviceHeight = g.graphicsDevice.height;

        var resolutionChanged: boolean = (oldWidth != g.deviceWidth || oldHeight != g.deviceHeight);

        Time.OnNextFrame();

        g.dynamicsWorld.update();
        g.physicsManager.update();
        g.scene.update();

        // Tell the world the frame is happening
        dispatchi.Dispatch.Dispatch(dispatchi.DispatchEvent.Update);

        // Render frame
        UpdateManager.updateCamera();
        if (g.graphicsDevice.beginFrame()) {

            // Tell the renderer to render anything that lives in the scene
            g.graphicsDevice.clear(skyboxmanageri.SkyboxManager.color, 1.0, 0.0);

            if (g.renderer) {

                // Draw backdrop if any
                if (skyboxmanageri.SkyboxManager.backgroundSprite) {
                    for (var x in skyboxmanageri.SkyboxManager.backgroundSprite) {
                        if (resolutionChanged) {
                            skyboxmanageri.SkyboxManager.backgroundSprite.setWidth(g.deviceWidth);
                            skyboxmanageri.SkyboxManager.backgroundSprite.setHeight(g.deviceHeight);
                            skyboxmanageri.SkyboxManager.backgroundSprite.x = g.deviceWidth / 2;
                            skyboxmanageri.SkyboxManager.backgroundSprite.y = g.deviceHeight / 2;
                        }
                    }
                    g.draw2D.begin();
                    g.draw2D.drawSprite(skyboxmanageri.SkyboxManager.backgroundSprite);
                    g.draw2D.end();
                }

                g.renderer.update(g.graphicsDevice, g.camera, g.scene, turbulenzEngine.time);
                if (g.renderer.updateBuffers(g.graphicsDevice, g.deviceWidth, g.deviceHeight)) {
                    g.renderer.draw(g.graphicsDevice);
                }

                if (g.g_debugMode)
                {
                    g.scene.drawPhysicsNodes(g.graphicsDevice, g.shaderManager, g.camera, g.physicsManager);
                    g.scene.drawPhysicsGeometry(g.graphicsDevice, g.shaderManager, g.camera, g.physicsManager);
                    //scene.drawSceneNodeHierarchy(graphicsDevice, shaderManager, camera);
                    //scene.drawWireframe(graphicsDevice, shaderManager, camera);
                }
            }

            // Tell everything that explicitly renders itself to do so
            dispatchi.Dispatch.Dispatch(dispatchi.DispatchEvent.Render);

            g.simpleFont.render();

            g.graphicsDevice.endFrame();
        }

        inputi.Input.UpdateKeysJustPressed();
    }

    public static updateCamera() : void {
        g.camera.updateViewMatrix();
        g.camera.updateViewProjectionMatrix();
    }
}