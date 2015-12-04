import {IEventListener} from './IEventListener.ts';
import {TzGameObject} from './tzGameObject.ts';
import {Dispatch,DispatchEvent} from './dispatch.ts';

export class TzBehavior implements IEventListener {
    public gameObject: TzGameObject;

    constructor(parent: TzGameObject) {
        this.gameObject = parent;
        Dispatch.Register(this);
    }
}
