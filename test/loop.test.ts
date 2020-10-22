import "mocha";
import { strict as assert } from "assert";
import { Loop, EXIT } from "../src/loop";

// @ts-ignore
function emptyFun() {} // eslint-disable-line @typescript-eslint/no-empty-function


describe("loop", () => {
    let loop;

    beforeEach(() => (loop = new Loop()));
    afterEach(() => loop.reset());

    it("should ignore entity if it is not loopable", () => {
        loop.add({ render: emptyFun });

        assert.equal(loop.animations.length, 0);
    });

    it("should add entity if it is loopable", () => {
        loop.add({ calculate: emptyFun });

        assert.equal(loop.animations.length, 1);
    });

    it("should add entity only once", () => {
        const loopable = { calculate: emptyFun };
        loop.add(loopable);
        loop.add(loopable);

        assert.equal(loop.animations.length, 1);
    });

    it("should keep entities in loop per default", () => {
        const calls = [];
        loop.add({ calculate: () => calls.push("calculate") });
        loop.tick();
        loop.tick();

        assert.deepEqual(calls, ["calculate", "calculate", "calculate"]);
        assert.equal(loop.animations.length, 1);
    });

    it("should call 'calculate', then 'render', in one loop", () => {
        const calls = [];

        loop.add({
            calculate: () => calls.push("calculate"),
            render: () => calls.push("render")
        });

        assert.deepEqual(calls, ["calculate", "render"]);
        assert.equal(loop.animations.length, 1);
    });

    it("should call 'calculate' for all instances, then 'render', ", () => {
        const calls = [];

        loop.add({
            calculate: () => calls.push("calculate 1"),
            render: () => calls.push("render 1")
        });

        loop.add({
            calculate: () => calls.push("calculate 2"),
            render: () => calls.push("render 2")
        });

        calls.length = 0;
        loop.tick();

        assert.deepEqual(calls, ["calculate 1", "calculate 2", "render 1", "render 2"]);
        assert.equal(loop.animations.length, 2);
    });

    it("should remove loopable-object when 'render' returns 'EXIT'", () => {
        const calls = [];

        loop.add({
            calculate: () => calls.push("calculate"),
            render: () => {
                calls.push("render");
                return EXIT;
            }
        });

        assert.deepEqual(calls, ["calculate", "render"]);
        assert.equal(loop.animations.length, 0);
    });

    it("should remove loopable-object when 'calculate' returns 'EXIT'", () => {
        const calls = [];

        loop.add({
            calculate: () => {
                calls.push("calculate");
                return EXIT;
            },
            render: () => {
                calls.push("render");
                return EXIT;
            }
        });

        assert.deepEqual(calls, ["calculate"]);
        assert.equal(loop.animations.length, 0);
    });
});
