import scenenodei = require('../tslib/scenenode.ts');
import helperfunctionsi = require('./helperFunctions.ts');
import g = require('./globals.ts');
import ieventlisteneri = require('./IEventListener.ts');
import tzbehavior = require('./tzBehavior.ts');
import tzgameobjecti = require('./tzGameObject.ts');

export class PlatformManager extends tzbehavior.TzBehavior implements ieventlisteneri.IEventListener {

    originalPlatformNode: scenenodei.SceneNode;
    platformObjects: any = [];
    platformSpawnIndex: number = 0;

    constructor(parent: tzgameobjecti.TzGameObject) {
        super(parent);
    }

    Awake() {
        this.originalPlatformNode = g.simpleSceneLoader.load("models/cube_scene.dae");
    }

    Start() {
        this.originalPlatformNode.enableHierarchy(false);
    }

    AddPlatform(v3Pos, v3Size) {
        this.platformSpawnIndex += 1;
        var margin = 0.01;

        var shape = g.physicsDevice.createBoxShape({
                halfExtents : v3Size,
                margin : margin
            });

        var geomMatrix = helperfunctionsi.HelperFunctions.BuildTransform(v3Pos, g.mathDevice.m43BuildIdentity(), v3Size);
        var colMatrix = helperfunctionsi.HelperFunctions.BuildTransform(v3Pos, g.mathDevice.m43BuildIdentity(), g.mathDevice.v3BuildOne());

        //Clone the cube
        var boxGeom = this.originalPlatformNode.clone("platform_geom" + this.platformSpawnIndex);
        boxGeom.setLocalTransform(geomMatrix);
        g.scene.addRootNode(boxGeom);
        boxGeom.enableHierarchy(true);
        console.log("AddPlatform() name: " + boxGeom.name);

        //Create collision
        var boxCol = g.physicsDevice.createCollisionObject({
            shape : shape,
            transform : colMatrix,
            friction : 0.5,
            restitution : 0.1,
            group: g.physicsDevice.FILTER_STATIC,
            mask: g.physicsDevice.FILTER_ALL,
            //onPreSolveContact : addContact,
            //onAddedContacts : addContacts
            //onProcessedContacts : addContacts
            //onRemovedContacts : addContacts
        });

        //Package the geometry and the collision
        var newPlatform = {
            geom : boxGeom,
            collisionObj : boxCol,
        };
        g.dynamicsWorld.addCollisionObject(boxCol);
        this.platformObjects.push(newPlatform);

        return newPlatform;
    }
}