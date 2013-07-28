module.exports = function runCron(bot, cron, scripts, repository) {
  var CronJob = require('cron').CronJob
    , c;

  c = new CronJob(cron, function () {
    _.each(scripts, function (script) {
      bot.trace('* Executing [' + script + ']');
      require(bot.options.dir + '/scripts/crons/' + script + '.js')(bot, repository);
    });
  }, null, true);
};
