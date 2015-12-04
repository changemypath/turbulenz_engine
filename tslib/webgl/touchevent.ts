// Copyright (c) 2012 Turbulenz Limited
import {Touch} from './touch.ts';
import {TouchEvent} from '../turbulenz.d.ts';

export class WebGLTouchEvent implements TouchEvent
{
    gameTouches    : Touch[];
    touches        : Touch[];
    changedTouches : Touch[];

    static create(params): TouchEvent
    {
        var touchEvent = new WebGLTouchEvent();

        touchEvent.changedTouches   = params.changedTouches;
        touchEvent.gameTouches      = params.gameTouches;
        touchEvent.touches          = params.touches;

        return touchEvent;
    }
}
