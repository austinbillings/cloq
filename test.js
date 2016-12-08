var cloq = require('./cloq.js');


var clock = new cloq('Testing Clock');
clock.lap('nothing at all');
setTimeout(function () {
  clock.lap('waiting for a bit');
  setTimeout(function () {
    clock.lap('getting almost there!')
    setTimeout(function () {
      clock.done('last thing');
    }, 1414);
  }, 547);
}, 1559);
