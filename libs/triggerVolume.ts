import helperfunctionsi = require('./helperfunctions.ts');
import g = require('./globals.ts');
import ieventlisteneri = require('./IEventListener.ts');
import {TzBehavior} from './tzBehavior.ts';
import {TzGameObject} from './tzGameObject.ts';
import {Log} from '../../turbulenz/libs/log.ts';

//Create trigger volumes with this.
//Create an instance of this class, then call instance.init() to set it up
//Also make sure to add a userData to anything that can collide with a trigger volume.

export class TriggerVolume extends TzBehavior implements ieventlisteneri.IEventListener {

	enabled: boolean = false;
	collisionObject: any;
	objectsInsideTrigger: any = {};
  	payload: any;

	onTriggerEnterFunc: any;
	onTriggerExitFunc: any;

	constructor(parent: TzGameObject) {
		super(parent);
	}

	//Call this on an instance of TriggerVolume to set the pos/size of the trigger
	Init(v3Pos, v3Size, onTriggerEnterCallback, onTriggerExitCallback) {
		if (this.collisionObject)
		{
			Log.warning("Init() already called on this TriggerVolume!!! Will NOT re-init");
			return;
		}

		var margin = 0.01;
		var shape = g.physicsDevice.createBoxShape({
				halfExtents : v3Size,
				margin : margin
			});
		var colMatrix = helperfunctionsi.HelperFunctions.BuildTransform(v3Pos, g.mathDevice.m43BuildIdentity(), g.mathDevice.v3BuildOne());

		//Create the volume
		this.collisionObject = g.physicsDevice.createCollisionObject({
			shape : shape,
			transform : colMatrix,
			trigger: true,
			group: g.physicsDevice.FILTER_STATIC,
			mask: g.physicsDevice.FILTER_ALL,
			//onPreSolveContact : addContact,
			onAddedContacts : this.CheckTriggerEnter,
			//onProcessedContacts : addContacts,
			onRemovedContacts : this.CheckTriggerExit
		});
		this.onTriggerEnterFunc = onTriggerEnterCallback;
		this.onTriggerExitFunc = onTriggerExitCallback;
		this.collisionObject.userData = this;	//userData is used by the trigger callbacks
		this.SetEnabled(true);
		//console.log("Trigger Init()");

		g.dynamicsWorld.addCollisionObject(this.collisionObject);
	}

	SetEnabled(enabled) {
		this.enabled = enabled;
	}

	Destroy() {
		//Log.trace("Destroying trigger");
		this.enabled = false;
		g.dynamicsWorld.removeCollisionObject(this.collisionObject);
	}

	IsObjectInsideTrigger(id) {
		if (this.objectsInsideTrigger[id] !== undefined && this.objectsInsideTrigger[id] > 0)
			return true;
		return false;
	}

	//Add/remove a TzGameObject id from the list of objects inside this trigger
	AddToTriggeredList(id) {
		this.objectsInsideTrigger[id] = 1;
	}
	RemoveFromTriggeredList(id) {
		this.objectsInsideTrigger[id] = 0;
	}

	//Gets called anytime contacts are added between the objects, if it's the first time contact happens then OnTriggerEnter() fires
	CheckTriggerEnter(objectA, objectB, contacts) {
		if (!objectA || !objectB || !objectA.userData || !objectB.userData)
			return;

		//Make sure the TriggerVolume is objectA
		if (objectB.userData.constructor.name == "TriggerVolume")
		{
			var tempObj = objectA;
			objectA = objectB;
			objectB = tempObj;
		}

		//Make sure trigger is enabled!
		if (!objectA.userData.enabled)
			return;

		if (objectA.userData.constructor.name == "TriggerVolume")
		{
		    if (objectB.userData.gameObject && objectB.userData.gameObject.id !== undefined)
		    {
		        ////Only trigger if this contact is the FIRST one to exit the triggerVolume
		        if (objectA.userData.IsObjectInsideTrigger(objectB.userData.gameObject.id) == false)
		        {
		            objectA.userData.AddToTriggeredList(objectB.userData.gameObject.id);
					if (objectA.userData.onTriggerEnterFunc) {
						objectA.userData.onTriggerEnterFunc(objectA, objectB, contacts);
					}
		        }
		    }
		}
	}

	//Gets called anytime contacts are removed between the objects, triggers OnTriggerExit() when there are no more contacts
	CheckTriggerExit(objectA, objectB, contacts) {
		//Not sure if I should put this.enabled in this check or down below!
		if (!objectA || !objectB || !objectA.userData || !objectB.userData)
			return;

		//Make sure the TriggerVolume is objectA
		if (objectB.userData.constructor.name == "TriggerVolume")
		{
			var tempObj = objectA;
			objectA = objectB;
			objectB = tempObj;
		}

		if (objectA.userData.constructor.name == "TriggerVolume")
		{
		    if (objectB.userData.gameObject && objectB.userData.gameObject.id !== undefined)
		    {
		        //Triggers when there are no more contacts
		        if (contacts.length <= 0)
		        {
		            //Only trigger if this contact is the LAST one to exit the triggerVolume
		            objectA.userData.RemoveFromTriggeredList(objectB.userData.gameObject.id);
					if (objectA.userData.enabled && objectA.userData.onTriggerExitFunc) {
						objectA.userData.onTriggerExitFunc(objectA, objectB);
					}
		        }
		    }
		}
	}
}