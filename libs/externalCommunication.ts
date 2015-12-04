import {Dispatch,DispatchEvent} from './dispatch.ts';

//
// This is for sending messages into the game. To be determined is how to send concept data
// and instance parameters into the game, although that could easy be done something like this:
//
// GameBroadcast("set-concept", <JSON wad describing concept data for this game (chassis instance)>);
// GameBroadcast("set-instance", <JSON wad describing this instance>);
//
export var GameBroadcast = function(msg: string, payload: any=null) : void {
    Dispatch.Dispatch(DispatchEvent.ExternalMessage, msg, payload);
}
