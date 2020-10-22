import "mocha";
import { strict as assert } from "assert";
import loop from "../src/loop";
import Debounce from "../src/Debounce";

// @ts-ignore
const sleep = time => new Promise(resolve => setTimeout(resolve, time));


describe("Debounce", () => {
    beforeEach(() => loop.reset());

    it("should always call 'update' before 'done'", async () => {
        const calls = [];
        const debounce = new Debounce(
            () => calls.push("update"),
            () => calls.push("done"),
            200,
            1
        );

        debounce.start();
        await sleep(170); // loop utilites do not enforce ms for ttl

        assert.deepEqual(calls, ["update", "done"]);
    });

    it("should call 'update' only once", async () => {
        const calls = [];
        const debounce = new Debounce(
            () => calls.push("update"),
            () => calls.push("done"),
            1,
            200
        );

        debounce.start();
        await sleep(220); // loop utilites do not enforce ms for ttl

        assert.deepEqual(calls, ["update", "done"]);
    });

    it("should call 'update' again, if there are changes", async () => {
        const calls = [];
        const debounce = new Debounce(
            () => calls.push("update"),
            () => calls.push("done"),
            60,
            200
        );
        debounce.start();

        debounce.update();
        await sleep(220);

        assert.deepEqual(calls, ["update", "update", "done"]);
    });

    it("should reset ttl for each update", async () => {
        const calls = [];
        const debounce = new Debounce(
            () => calls.push("update"),
            () => calls.push("done"),
            60,
            60
        );

        debounce.start();
        await sleep(60);

        debounce.update();
        await sleep(60);

        assert.deepEqual(calls, ["update", "update"]);
    });
});
