module.exports = function runCron(bot, cron, scripts, repository) {
  var CronJob = require('cron').CronJob
    , c;

  c = new CronJob(cron, function () {
    _.each(scripts, function (script) {
      var path = bot.scripts[script];
      bot.trace('* Executing [' + script + ']');
      require(path)(bot, repository);
    });
  }, null, true);
};
