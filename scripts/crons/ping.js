module.exports = function (bot, repo_info) {
  var days_ago = 5
    , issues = bot.github.issues
    , old_threshold = (new Date().getTime()) - (days_ago * 24 * 60 * 60 * 1000)
    , options = {user: repo_info.owner, repo: repo_info.name};

  issues.repoIssues(options, bot.handleError(function (issues) {
    var comment_options;

    _.each(issues, function pingIssue(issue) {
      if (new Date(issue.updated_at).getTime() > old_threshold) {
        return;
      }

      comment_options = _.extend({number: issue.number, body: 'ping'}, options);

      issues.createComment(comment_options, bot.handleError(function (data) {
        bot.trace('* [Ping] Pinged ' + issue.id + ' issue');
      }));
    });
  }));
};
