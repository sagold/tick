import { Loopable } from "./loop";
export declare type OnTimeout = (now: number, timePassed: number) => void;
/**
 * Create a new lazy, reusable timeout
 */
declare class Timeout implements Loopable {
    lastUpdate: number;
    loopState: boolean;
    sendTimeout: OnTimeout;
    time: number;
    ttl: number;
    /**
     * @param onTimeout - called, when timeout has occured
     * @param ttl - time to live in [ms]
     */
    constructor(onTimeout: OnTimeout, ttl: number);
    /**
     * start or restart timeout
     * @return this instance
     */
    start(): Timeout;
    /**
     * @return true, if timeout is currently active
     */
    isActive(): boolean;
    /**
     * @return starting time of timeout in [ms]
     */
    getTime(): number;
    calculate(now: number): boolean;
    /**
     * reset lifetime of current active timeout
     * @return new starting time of timeout in [ms]
     */
    keepAlive(): number;
}
export default Timeout;
