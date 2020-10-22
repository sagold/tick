import { Loopable } from "./loop";
export declare type OnDebounceUpdate = (any: any) => void;
export declare type OnDebounceEnd = (any: any) => void;
/**
 * Debounce multiple events, emitting updates by a fixed interval and receive
 * an end-event, when no more updates are incoming
 */
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
     * start debouncing
     * @param arg - you can pass an argument, which will be passed to onUpdate and onEnd events
     * @return this instance
     */
    start(arg?: any): Debounce;
    /**
     * notify a change to keep debounce active (by resetting ttl)
     * @param arg - you can pass an argument, which will be passed to onUpdate and onEnd events
     * @return this instance
     */
    update(arg?: any): Debounce;
    calculate(now: number): boolean;
}
export default Debounce;
