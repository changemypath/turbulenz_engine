//Create trigger volumes with this.
//Create an instance of this class, then call instance.init() to set it up
//Also make sure to add a userData to anything that can collide with a trigger volume.
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriggerVolume = (function (_super) {
    __extends(TriggerVolume, _super);
    function TriggerVolume(parent) {
        _super.call(this, parent);
        this.enabled = false;
        this.objectsInsideTrigger = {};
    }
    //Call this on an instance of TriggerVolume to set the pos/size of the trigger
    TriggerVolume.prototype.Init = function (v3Pos, v3Size, onTriggerEnterCallback, onTriggerExitCallback) {
        if (this.collisionObject) {
            Log.warning("Init() already called on this TriggerVolume!!! Will NOT re-init");
            return;
        }
        var margin = 0.01;
        var shape = physicsDevice.createBoxShape({
            halfExtents: v3Size,
            margin: margin
        });
        var colMatrix = HelperFunctions.BuildTransform(v3Pos, mathDevice.m43BuildIdentity(), mathDevice.v3BuildOne());
        //Create the volume
        this.collisionObject = physicsDevice.createCollisionObject({
            shape: shape,
            transform: colMatrix,
            trigger: true,
            group: physicsDevice.FILTER_STATIC,
            mask: physicsDevice.FILTER_ALL,
            //onPreSolveContact : addContact,
            onAddedContacts: this.CheckTriggerEnter,
            //onProcessedContacts : addContacts,
            onRemovedContacts: this.CheckTriggerExit
        });
        this.onTriggerEnterFunc = onTriggerEnterCallback;
        this.onTriggerExitFunc = onTriggerExitCallback;
        this.collisionObject.userData = this; //userData is used by the trigger callbacks
        this.SetEnabled(true);
        //console.log("Trigger Init()");
        dynamicsWorld.addCollisionObject(this.collisionObject);
    };
    TriggerVolume.prototype.SetEnabled = function (enabled) {
        this.enabled = enabled;
    };
    TriggerVolume.prototype.Destroy = function () {
        //Log.trace("Destroying trigger");
        this.enabled = false;
        dynamicsWorld.removeCollisionObject(this.collisionObject);
    };
    TriggerVolume.prototype.IsObjectInsideTrigger = function (id) {
        if (this.objectsInsideTrigger[id] !== undefined && this.objectsInsideTrigger[id] > 0)
            return true;
        return false;
    };
    //Add/remove a TzGameObject id from the list of objects inside this trigger
    TriggerVolume.prototype.AddToTriggeredList = function (id) {
        this.objectsInsideTrigger[id] = 1;
    };
    TriggerVolume.prototype.RemoveFromTriggeredList = function (id) {
        this.objectsInsideTrigger[id] = 0;
    };
    //Gets called anytime contacts are added between the objects, if it's the first time contact happens then OnTriggerEnter() fires
    TriggerVolume.prototype.CheckTriggerEnter = function (objectA, objectB, contacts) {
        if (!objectA || !objectB || !objectA.userData || !objectB.userData)
            return;
        //Make sure the TriggerVolume is objectA
        if (objectB.userData.constructor.name == "TriggerVolume") {
            var tempObj = objectA;
            objectA = objectB;
            objectB = tempObj;
        }
        //Make sure trigger is enabled!
        if (!objectA.userData.enabled)
            return;
        if (objectA.userData.constructor.name == "TriggerVolume") {
            if (objectB.userData.gameObject && objectB.userData.gameObject.id !== undefined) {
                ////Only trigger if this contact is the FIRST one to exit the triggerVolume
                if (objectA.userData.IsObjectInsideTrigger(objectB.userData.gameObject.id) == false) {
                    objectA.userData.AddToTriggeredList(objectB.userData.gameObject.id);
                    if (objectA.userData.onTriggerEnterFunc) {
                        objectA.userData.onTriggerEnterFunc(objectA, objectB, contacts);
                    }
                }
            }
        }
    };
    //Gets called anytime contacts are removed between the objects, triggers OnTriggerExit() when there are no more contacts
    TriggerVolume.prototype.CheckTriggerExit = function (objectA, objectB, contacts) {
        //Not sure if I should put this.enabled in this check or down below!
        if (!objectA || !objectB || !objectA.userData || !objectB.userData)
            return;
        //Make sure the TriggerVolume is objectA
        if (objectB.userData.constructor.name == "TriggerVolume") {
            var tempObj = objectA;
            objectA = objectB;
            objectB = tempObj;
        }
        if (objectA.userData.constructor.name == "TriggerVolume") {
            if (objectB.userData.gameObject && objectB.userData.gameObject.id !== undefined) {
                //Triggers when there are no more contacts
                if (contacts.length <= 0) {
                    //Only trigger if this contact is the LAST one to exit the triggerVolume
                    objectA.userData.RemoveFromTriggeredList(objectB.userData.gameObject.id);
                    if (objectA.userData.enabled && objectA.userData.onTriggerExitFunc) {
                        objectA.userData.onTriggerExitFunc(objectA, objectB);
                    }
                }
            }
        }
    };
    return TriggerVolume;
})(TzBehavior);
