module.exports = function runHook(bot, hook_name, repo_info, repo_fullname, data) {
  var payload = JSON.parse(data)
    , repo_options = bot.options.repositories[repo_fullname]
    , scripts;

  if (!repo_options) {
    console.error('* [ERROR] Repository not found: ' + repo_fullname);
    return;
  }

  scripts = repo_options.hooks[hook_name];

  if (!scripts) {
    console.error('* [ERROR] Script not found for ' + hook_name + ' in ' + repo_fullname);
    return;
  }

  _.each(scripts, function (script) {
    bot.trace('* Running [' + script + '] for ' + repo_fullname);
    require(bot.options.dir + '/scripts/hooks/' + script + '.js')(bot, repo_info, payload);
  });
};
