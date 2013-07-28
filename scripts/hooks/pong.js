module.exports = function pong(bot, repo_info, payload) {
  var comment_options
    , options = {user: repo_info.owner, repo: repo_info.name}
    , should_pong;

  should_pong = payload.comment.user.login.toLowerCase() !== bot.options.username &&
                payload.comment.body === 'ping';

  if (!should_pong) {
    return;
  }

  comment_options = _.extend({
    number: payload.issue.number
  , body: 'pong'
  }, options);

  bot.github.issues.createComment(comment_options, bot.handleError(function (data) {
    bot.trace('* [Pong] Answered a ping on the issue #' + payload.issue.number +
              ' on the repo ' + repo_info.owner + '/' + repo_info.name);
  }));
};
