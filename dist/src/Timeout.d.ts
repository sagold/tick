import { Loopable } from "./loop";
export declare type OnTimeout = (now: number, timePassed: number) => void;
declare class Timeout implements Loopable {
    lastUpdate: number;
    loopState: boolean;
    sendTimeout: OnTimeout;
    time: number;
    ttl: number;
    constructor(onTimeout: OnTimeout, ttl: number);
    start(): this;
    isActive(): boolean;
    getTime(): number;
    calculate(now: number): boolean;
    keepAlive(): number;
}
export default Timeout;
