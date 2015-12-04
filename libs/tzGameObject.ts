import ieventlisteneri = require('./IEventListener.ts');

//
// Owns a collection of tzBehaviors.
//
export class TzGameObject {
    public activeSelf : boolean = true;
    public activeInHierarchy : boolean = true;
    public parent : TzGameObject;
    public name : string;
    public id: number;
    static idCounter: number = 0;

    components : ieventlisteneri.IEventListener[] = [];

    public AddComponent(behavior: ieventlisteneri.IEventListener) {
        this.components.push(behavior);
    }

    constructor(name: string, parent: TzGameObject = null) {
        this.name = name;
        this.parent = parent;
        this.id = TzGameObject.idCounter;
        TzGameObject.idCounter++;
    }
}