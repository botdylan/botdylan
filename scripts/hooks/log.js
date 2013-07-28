module.exports = function logs(bot, repo_info, payload) {
  bot.trace('* [Logs] Logged hook at ' + repo_info.owner + '/' + repo_info.name);
};
