import loop, { Loopable, EXIT, CONTINUE } from "./loop";


export type OnDebounceUpdate = (any) => void;
export type OnDebounceEnd = (any) => void;


/**
 * Debounce multiple events, emitting updates by a fixed interval and receive
 * an end-event, when no more updates are incoming
 */
class Debounce implements Loopable {
    active = false;
    arg?;
    endTimeout: number;
    lastDebounce = 0;
    lastUpdate = 0;
    onEnd: OnDebounceEnd;
    onUpdate: OnDebounceUpdate;
    updated = false;
    updateInterval: number;

    constructor(onUpdate: OnDebounceUpdate, onEnd: OnDebounceEnd, updateInterval = 100, endTimeout = 200) {
        this.updateInterval = updateInterval;
        this.onUpdate = onUpdate;
        this.endTimeout = endTimeout;
        this.onEnd = onEnd;
    }

    /**
     * Send the first event to start debouncer
     * @param  {Mixed} arg  - you can pass an argument, which will be passed to onUpdate and onEnd events
     */
    start(arg?) {
        this.update(arg);
        this.active = true;
        loop.add(this);
    }

    /**
     * Send an update event
     * @param  {Mixed} arg  - you can pass an argument, which will be passed to onUpdate and onEnd events
     */
    update(arg?) {
        this.updated = true;
        this.arg = arg ?? this.arg;
        this.lastUpdate = Date.now();
    }

    calculate(now: number) {
        if (now - this.lastUpdate > this.endTimeout) {
            this.onEnd(this.arg);
            this.arg = undefined;
            this.active = false;
            return EXIT;
        }

        if (this.updated && now - this.lastDebounce > this.updateInterval) {
            this.updated = false;
            this.lastDebounce = now;
            this.onUpdate(this.arg);
        }

        return CONTINUE;
    }
}


export default Debounce;
