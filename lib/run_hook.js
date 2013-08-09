module.exports = function runHook(bot, hook_name, repo_info, repo_fullname, data) {
  var payload = JSON.parse(data)
    , repo_options = bot.options.repositories[repo_fullname]
    , scripts;

  if (!repo_options) {
    console.error('* [ERROR] Repository not found: ' + repo_fullname);
    return;
  }

  _.each(scripts, function (script) {
    var path = bot.scripts[script];
    bot.trace('* Running [' + script + '] for ' + repo_fullname);
    require(path)(bot, repo_info, payload);
  });
};
