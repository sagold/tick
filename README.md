# tick

> old-school performance friendly timing utilities in dom-context

`yarn add @sagold/tick` or `npm i @sagold/tick`

Since 2012, i use these little helpers for all performance critical tasks. Until now, they were copied multiple times, into multiple projects. Finally they have their own package. They follow performance best practices which are still true today.


**Overview**

- [Why and what, performance guidelines](#user-content-why-and-what)
- [Import](#user-content-import)
- [General usage](#user-content-general-usage)


## why and what

**bulk updates**
The main reason for this custom loop is an optimization for browser bulk updates. This means, we try to get as many dom-updates as possible into a single browser-repaint. Thus, the `loop` will call `calculate` for all loopable entities to prepare a possible dom-update. The following call to `render` expects only the remaining dom-assignments that will trigger a browser-repaint.

**further performance guidelines** (currently unexplained)

- running everything in one loop
- dont use css animations in conjuction with js-animations (js only)
- dont use strict timeouts or intervals
- prevent object and array creation (reuse, keep in state)


## Import

**via script**

```html
<script type="text/javascript" src="node_modules/@sagold/tick/dist/tick.js"></script>
<script>
    const { loop, Timeout, Debounce } = window.tick;
</script>
```

**via module**

```js
import { loop, Timeout, Debounce } from "@sagold/tick";
```


## General usage

All there is, is a function `calculate` executed within a requestAnimationFrame (raf) and a second function `render` which behaves exactly like calculate, but is called afterwards.

```js
import { loop, EXIT } from "@sagold/tick";

// the following will add a function and execute it infinitely within a raf
const timer1 = {
    calculate(currentMs) { 
        console.log("tick", currentMs); 
    }
};
loop.add(timer1);

// the following will add a function and execute it once
const timer2 = {
    calculate(currentMs) { 
        console.log("tick", currentMs); 
        return EXIT; // true
    }
};
loop.add(timer2);

// the following will add a function for around 1s
const timer3 = {
    start: Date.now(),
    calculate(currentMs) { 
        console.log("tick", currentMs); 
        if (currentMs - this.start > 1000) {
            return EXIT; // true    
        }
    }
};
loop.add(timer3);

// the following will log "calculate 1", "render 1", "calculate 2", "render 2" infinitely
const timer = {
    start: Date.now(),
    calculate(currentMs) { 
        console.log("calculate", currentMs); 
    },
    render(currentMs) {
        console.log("render", currentMs); 
    }
};
loop.add(timer);
```


### Timeout

```js
import { Timeout } from "@sagold/tick";

const ttl = 1000;
const onTimeout = () => console.log("done");
const timeout = new Timeout(onTimeout, ttl);

// start timeout
timeout.start();

// reset ttl while timeout is running
timeout.keepAlive();

// reuse timeout and start it again
timeout.start();
```


### Debounce

```js
import { Debounce } from "@sagold/tick";

const ttl = 1000/2;
const interval = 1000/20;
const onUpdate = () => console.log("update");
const onEnd = () => console.log("done");
const debounce = new Debounce(onUpdate, onEnd, interval, ttl);

// start debounce
debounce.start(); // logs "update"

// will call "onUpdate" once within each `interval`
debounce.update();
debounce.update();
debounce.update();
debounce.update();

// logs "end", after no more updates have been received within `ttl`
```

