import "mocha";
import { strict as assert } from "assert";
import loop from "../src/loop";
import Timeout from "../src/Timeout";

// @ts-ignore
const sleep = time => new Promise(resolve => setTimeout(resolve, time));


describe("Timeout", () => {
    beforeEach(() => loop.reset());

    it("should callback on timeout", async () => {
        let hasCalled = false;
        const timeout = new Timeout(() => (hasCalled = true), 100);

        timeout.start();
        assert.equal(hasCalled, false, "should not have called cb on init");

        await sleep(120); // loop utilites do not enforce ms for ttl
        assert.equal(hasCalled, true, "should have called timeout after ttl");
    });

    it("should callback on timeout only once", async () => {
        const updates = [];
        const timeout = new Timeout(() => (updates.push("timeout")), 100);
        timeout.start();

        await sleep(120);
        assert.equal(updates.length, 1, "should have called cb only once for a timeout");

        await sleep(120);
        assert.equal(updates.length, 1, "should not have called cb twice");
    });

    it("should remove itself from loop, after timeout has been called", async () => {
        let hasCalled = false;
        const timeout = new Timeout(() => (hasCalled = true), 100);

        timeout.start();
        await sleep(120); // loop utilites do not enforce ms for ttl

        assert.equal(hasCalled, true, "should have called timeout after ttl");
        assert.equal(loop.animations.length, 0);
    });

    it("should reset ttl on 'keepAlive'", async () => {
        let hasCalled = false;
        const timeout = new Timeout(() => (hasCalled = true), 100);
        timeout.start();

        await sleep(60); // loop utilites do not enforce ms for ttl
        timeout.keepAlive();

        await sleep(60);
        assert.equal(hasCalled, false, "should not have called cb on init");

        await sleep(60);
        assert.equal(hasCalled, true, "should have called timeout after keepAlive");
    });

    it("should reset ttl on 'start'", async () => {
        let hasCalled = false;
        const timeout = new Timeout(() => (hasCalled = true), 100);
        timeout.start();

        await sleep(60); // loop utilites do not enforce ms for ttl
        timeout.start();

        await sleep(60);
        assert.equal(hasCalled, false, "should not have called cb on init");

        await sleep(60);
        assert.equal(hasCalled, true, "should have called timeout after keepAlive");
    });

    it("should be reusable", async () => {
        let hasCalled = false;
        const timeout = new Timeout(() => (hasCalled = true), 100);

        timeout.start();
        await sleep(120);
        assert.equal(hasCalled, true, "should have called timeout");

        hasCalled = false;
        timeout.start();
        await sleep(120);

        assert.equal(hasCalled, true, "should have called timeout again");
    });
});
