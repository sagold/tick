import loop, { Loopable, EXIT, CONTINUE } from "./loop";


export type OnTimeout = (now: number, timePassed: number) => void;


class Timeout implements Loopable {
    lastUpdate: number;
    loopState: boolean = EXIT;
    sendTimeout: OnTimeout;
    time: number;
    ttl: number;

    constructor(onTimeout: OnTimeout, ttl: number) {
        this.loopState = EXIT;
        this.ttl = ttl;
        this.sendTimeout = onTimeout;
    }

    start() {
        this.keepAlive();
        if (this.isActive() === false) {
            this.loopState = CONTINUE;
            loop.add(this);
        }
        return this;
    }

    isActive() {
        return this.loopState === CONTINUE;
    }

    getTime() {
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

    keepAlive() {
        this.lastUpdate = Date.now();
        return this.lastUpdate;
    }
}


export default Timeout;
