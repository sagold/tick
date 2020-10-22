let raf;
function initRAF() {
    try {
        raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    } catch (e) {/* no window available */}
}

export interface Loopable {
    /** perform all calculations here, avoiding triggering any browser paint or layout */
    calculate(now: number): boolean|void;
    /** perform all necessary dom operation, triggering paint or layout jobs in browser */
    render?(now: number): boolean|void;
}

export const EXIT = true;
export const CONTINUE = false;
function emptyFun() {} // eslint-disable-line @typescript-eslint/no-empty-function


/**
 * Register an action to the animation-frame.
 */
export class Loop {
    enabled = false;
    running = false;
    animations: Array<Loopable> = [];
    nextAnimations: Array<Loopable> = [];

    constructor() {
        this.tick = this.tick.bind(this);
    }

    add(loopObject: Loopable) {
        if (loopObject.calculate) {
            loopObject.render = loopObject.render ?? emptyFun;

            let target = this.animations;
            if (this.running) {
                target = this.nextAnimations;
            }
            // ensure that animations are not executed multiple times
            if (target.indexOf(loopObject) === -1) {
                target.push(loopObject);
                this.start();
            }

        } else {
            console.log("Not a tickable object", loopObject);
        }
    }

    start() {
        if (this.enabled === false && typeof raf === "function") {
            this.enabled = true;
            this.tick();
        }
    }

    tick() {
        let i;
        const now = Date.now();
        let { animations, nextAnimations } = this;

        this.running = true;
        // iterate on current length as new animations may be added
        for (i = 0; i < animations.length; i += 1) {
            if (animations[i].calculate(now) !== EXIT) {
                if (nextAnimations.indexOf(animations[i]) === -1) {
                    nextAnimations.push(animations[i]);
                }
            }
        }
        this.running = false;

        this.swapAnimations();
        animations = this.animations;
        nextAnimations = this.nextAnimations;

        this.running = true;
        for (i = 0; i < animations.length; i += 1) {
            if (animations[i].render(now) !== EXIT) {
                if (nextAnimations.indexOf(animations[i]) === -1) {
                    nextAnimations.push(animations[i]);
                }
            }
        }
        this.running = false;

        this.swapAnimations();

        if (this.animations.length > 0) {
            raf(this.tick);
        } else {
            this.enabled = false;
        }
    }

    swapAnimations() {
        const toSwap = this.animations;
        toSwap.length = 0;
        this.animations = this.nextAnimations;
        this.nextAnimations = toSwap;
    }

    reset() {
        this.animations.length = 0;
        this.nextAnimations.length = 0;
    }
}


initRAF();
const loop = new Loop();


export default loop;
