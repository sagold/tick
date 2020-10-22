export interface Loopable {
    /** perform all calculations here, avoiding triggering any browser paint or layout */
    calculate(now: number): boolean | void;
    /** perform all necessary dom operation, triggering paint or layout jobs in browser */
    render?(now: number): boolean | void;
}
export declare const EXIT = true;
export declare const CONTINUE = false;
/**
 * Register an action to the animation-frame.
 */
export declare class Loop {
    enabled: boolean;
    running: boolean;
    animations: Array<Loopable>;
    nextAnimations: Array<Loopable>;
    constructor();
    add(loopObject: Loopable): void;
    start(): void;
    tick(): void;
    swapAnimations(): void;
    reset(): void;
}
declare const loop: Loop;
export default loop;
