var _ = require('underscore');
var zaq = require('zaq');
var chalk = require('chalk');

var cloq = function (name) {
  var title = chalk.cyan.bold(name+' ')+' ';
  var start = _.now();
  zaq.time(title + chalk.grey('<><><><><><><><><><><><><><><><><><><><>'));
  return {
    title: title,
    start: start,
    lastLap: start,
    lap: function (evt) {
      var thisLap = _.now();
      var lapTime = (thisLap - this.lastLap);
      this.lastLap = thisLap;
      zaq.time(this.title + chalk.bold(evt) + chalk.grey(' took ') + chalk.bold(lapTime / 1000) + chalk.grey(' seconds.'));
    },
    done: function (evt) {
      if (evt) this.lap(evt);
      var total = (_.now() - this.start);
      zaq.time(this.title + 'finished after ' + chalk.bold(total / 1000) + ' seconds.')
      zaq.time(this.title + chalk.grey('<><><><><><><><><><><><><><><><><><><><>'))
    }
  }
}

exports = module.exports = cloq;
