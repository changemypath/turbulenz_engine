//
// Useful helper functions? you  decide
//
var HelperFunctions = (function () {
    function HelperFunctions() {
    }
    //Might not find all nodes in the heirarchy. Needs more testing
    HelperFunctions.FindChildOfNode = function (node, childName) {
        if (!node) {
            Log.trace("Trying to find child of non-existent node");
            return undefined;
        }
        var children = node.children;
        if (children) {
            HelperFunctions.ListChildNodes(node);
            for (var i = 0; i < children.length; i += 1) {
                if (children[i].getName().indexOf(childName) == 0) {
                    Log.trace("Found child with desired name: " + children[i].getName());
                    return children[i];
                }
                else {
                    Log.trace("child rejected with name " + children[i].getName());
                }
                Log.trace("Finding a child of " + children[i].getName());
                var child = children[i].findChild(childName);
                if (child) {
                    Log.trace("child has name " + child.getName());
                    return child;
                }
            }
        }
        Log.trace("Looked through all children for " + childName + " but found nothing.");
        return undefined;
    };
    //Build a complete transform with the supplied Pos, Rot (full matrix) and Scale
    HelperFunctions.BuildTransform = function (v3Pos, rotationMatrix, v3Scale) {
        var scaleMatrix = mathDevice.m43BuildIdentity();
        var localTransform = mathDevice.m43BuildIdentity();
        mathDevice.m43Scale(scaleMatrix, v3Scale, scaleMatrix);
        mathDevice.m43Mul(rotationMatrix, scaleMatrix, localTransform);
        mathDevice.m43SetPos(localTransform, v3Pos);
        return localTransform;
    };
    //Took the FOV functions from protolib
    HelperFunctions.SetCameraFOV = function (fovX, fovY) {
        var recipViewWindowX = 1.0 / Math.tan(fovX * 0.5);
        var recipViewWindowY = 1.0 / Math.tan(fovY * 0.5);
        camera.recipViewWindowX = recipViewWindowX;
        camera.recipViewWindowY = recipViewWindowY;
        camera.updateProjectionMatrix();
        camera.updateViewProjectionMatrix();
    };
    HelperFunctions.GetCameraFOV = function () {
        var recipViewWindowX = camera.recipViewWindowX;
        var recipViewWindowY = camera.recipViewWindowY;
        var fovX = 2 * Math.atan(1 / recipViewWindowX);
        var fovY = 2 * Math.atan(1 / recipViewWindowY);
        return [fovX, fovY];
    };
    HelperFunctions.DegreesToRadians = function (degrees) {
        var radians = 0;
        if (degrees !== undefined) {
            radians = degrees * (Math.PI / 180);
        }
        else {
            Log.warning("Invalid degrees passed into DegreesToRadians, returning w/ 0 radians!");
        }
        return radians;
    };
    HelperFunctions.RadiansToDegrees = function (radians) {
        var degrees = 0;
        if (radians !== undefined) {
            degrees = radians * (180 / Math.PI);
        }
        else {
            Log.warning("Invalid radians passed into RadiansToDegrees, returning w/ 0 degrees!");
        }
        return degrees;
    };
    HelperFunctions.ListChildNodes = function (parent) {
        if (!parent)
            return;
        var children = parent.children;
        if (children !== undefined && children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                this.ListChildNodes(children[i]);
            }
        }
        else {
            Log.trace(parent);
            Log.trace("node path = " + parent.getPath() + ", parent name = " + parent.name);
        }
    };
    HelperFunctions.recurseSceneGraph = function (index, node) {
        // Log.trace((('    ' + index).slice(-4)) + node);
        Log.trace(index);
        Log.trace(node);
        // Log.trace(index + ": " + node);
        if (node.children) {
            for (var i = 0; i < node.children.length; i++) {
                HelperFunctions.recurseSceneGraph(index + 1, node.children[i]);
            }
        }
    };
    HelperFunctions.ShowSceneGraph = function (node) {
        var parent = null;
        if (node.parent) {
            parent = node.parent;
        }
        while (parent) {
            node = parent;
            parent = node.parent;
        }
        HelperFunctions.recurseSceneGraph(0, node);
    };
    return HelperFunctions;
})();
