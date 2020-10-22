import loop, { Loopable, EXIT, CONTINUE } from "./loop";


export type OnTimeout = (now: number, timePassed: number) => void;


/**
 * Create a new lazy, reusable timeout
 */
class Timeout implements Loopable {
    lastUpdate: number;
    loopState: boolean = EXIT;
    sendTimeout: OnTimeout;
    time: number;
    ttl: number;

    /**
     * @param onTimeout - called, when timeout has occured
     * @param ttl - time to live in [ms]
     */
    constructor(onTimeout: OnTimeout, ttl: number) {
        this.loopState = EXIT;
        this.ttl = ttl;
        this.sendTimeout = onTimeout;
    }

    /**
     * start or restart timeout
     * @return this instance
     */
    start(): Timeout {
        this.keepAlive();
        if (this.isActive() === false) {
            this.loopState = CONTINUE;
            loop.add(this);
        }
        return this;
    }

    /**
     * @return true, if timeout is currently active
     */
    isActive(): boolean {
        return this.loopState === CONTINUE;
    }

    /**
     * @return starting time of timeout in [ms]
     */
    getTime(): number {
        return this.lastUpdate;
    }

    calculate(now: number): boolean {
        this.time = now - this.lastUpdate;
        if (this.time > this.ttl) {
            this.sendTimeout(now, now - this.lastUpdate);
            this.loopState = EXIT;
        }
        return this.loopState;
    }

    /**
     * reset lifetime of current active timeout
     * @return new starting time of timeout in [ms]
     */
    keepAlive(): number {
        this.lastUpdate = Date.now();
        return this.lastUpdate;
    }
}


export default Timeout;
