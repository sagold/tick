import { Loopable } from "./loop";
export declare type OnDebounceUpdate = (any: any) => void;
export declare type OnDebounceEnd = (any: any) => void;
declare class Debounce implements Loopable {
    active: boolean;
    arg?: any;
    endTimeout: number;
    lastDebounce: number;
    lastUpdate: number;
    onEnd: OnDebounceEnd;
    onUpdate: OnDebounceUpdate;
    updated: boolean;
    updateInterval: number;
    constructor(onUpdate: OnDebounceUpdate, onEnd: OnDebounceEnd, updateInterval?: number, endTimeout?: number);
    /**
     * Send the first event to start debouncer
     * @param  {Mixed} arg  - you can pass an argument, which will be passed to onUpdate and onEnd events
     */
    start(arg?: any): void;
    /**
     * Send an update event
     * @param  {Mixed} arg  - you can pass an argument, which will be passed to onUpdate and onEnd events
     */
    update(arg?: any): void;
    calculate(now: number): boolean;
}
export default Debounce;
