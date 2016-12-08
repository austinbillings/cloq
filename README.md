# cloq

An incredibly easy-to-use JavaScript timelogger. Create a `new cloq()` with a name, and tell it when things happen. Watch the output measured on your console. Simple as amything.

The [**`zaq`**](http://github.com/austinbillings/zaq) logging library is used to display timings, another fine software project by Austin.

License: **MIT**

## Installation

Well, first things first. Install via NPM:
```bash
npm install cloq
```
Require in your Node project:
```js
var cloq = require('cloq');
```


## Usage API

### Create a new clock

Pass a name to the `cloq()` constructor to start a new timing clock.

```js
var clock = new cloq('Process X Timer');
```

### Keep track of events

Pass an event to the `.lap()` method of your clock. **`cloq`** will notate the time taken between each 'lap' in your console.

```js
clock.lap('first event completed');
someAsyncFunction.then(function (success) {
  clock.lap('some async function completed.');
}, errorHandler);
```

### Finish time checking
When your processes are all done, simply call the `.done()` method of your clock, optionally passing a final event name as a parameter. Any final 'lap' event given will be notated, followed by the **total time** taken from `cloq` creation to completion.

```js
anotherAsyncFunction.then(function (success) {
  clock.done('last http request');
})
```

## Example Usage & Output

The following example uses `setTimeout` to mimic the slow effect of heavy synchronous processing or asynchronous network requests.

```js
var clock = new cloq('Testing Clock');

clock.lap('nothing at all');
setTimeout(function () {
  clock.lap('waiting for a bit');
  setTimeout(function () {
    clock.lap('getting almost there!');
    setTimeout(function () {
      clock.done('last thing');
    }, 1414);
  }, 547);
}, 1559);
```

The following is the console output (without the pretty colors and bold text you'll see in real life).
```
♦ TIME: Testing Clock  <><><><><><><><><><><><><><><><><><><><>
♦ TIME: Testing Clock  nothing at all took 0.001 seconds.
♦ TIME: Testing Clock  waiting for a bit took 1.564 seconds.
♦ TIME: Testing Clock  getting almost there! took 0.551 seconds.
♦ TIME: Testing Clock  last thing took 1.415 seconds.
♦ TIME: Testing Clock  finished after 3.531 seconds.
♦ TIME: Testing Clock  <><><><><><><><><><><><><><><><><><><><>
```
