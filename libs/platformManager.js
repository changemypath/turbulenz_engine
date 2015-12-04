var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PlatformManager = (function (_super) {
    __extends(PlatformManager, _super);
    function PlatformManager(parent) {
        _super.call(this, parent);
        this.platformObjects = [];
        this.platformSpawnIndex = 0;
    }
    PlatformManager.prototype.Awake = function () {
        this.originalPlatformNode = simpleSceneLoader.load("models/cube_scene.dae");
    };
    PlatformManager.prototype.Start = function () {
        this.originalPlatformNode.enableHierarchy(false);
    };
    PlatformManager.prototype.AddPlatform = function (v3Pos, v3Size) {
        this.platformSpawnIndex += 1;
        var margin = 0.01;
        var shape = physicsDevice.createBoxShape({
            halfExtents: v3Size,
            margin: margin
        });
        var geomMatrix = HelperFunctions.BuildTransform(v3Pos, mathDevice.m43BuildIdentity(), v3Size);
        var colMatrix = HelperFunctions.BuildTransform(v3Pos, mathDevice.m43BuildIdentity(), mathDevice.v3BuildOne());
        //Clone the cube
        var boxGeom = this.originalPlatformNode.clone("platform_geom" + this.platformSpawnIndex);
        boxGeom.setLocalTransform(geomMatrix);
        scene.addRootNode(boxGeom);
        boxGeom.enableHierarchy(true);
        console.log("AddPlatform() name: " + boxGeom.name);
        //Create collision
        var boxCol = physicsDevice.createCollisionObject({
            shape: shape,
            transform: colMatrix,
            friction: 0.5,
            restitution: 0.1,
            group: physicsDevice.FILTER_STATIC,
            mask: physicsDevice.FILTER_ALL
        });
        //Package the geometry and the collision
        var newPlatform = {
            geom: boxGeom,
            collisionObj: boxCol
        };
        dynamicsWorld.addCollisionObject(boxCol);
        this.platformObjects.push(newPlatform);
        return newPlatform;
    };
    return PlatformManager;
})(TzBehavior);
