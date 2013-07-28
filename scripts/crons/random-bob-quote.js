module.exports = function (bot, repo_info) {
  var quotes
    , issues = bot.github.issues
    , options = {user: repo_info.owner, repo: repo_info.name};

  quotes = [
    "Take care of all your memories. For you cannot relive them."
  , "He's not busy being born, is busy dying."
  , "When you cease to exist, then who will you blame."
  , "There is nothing so stable as change."
  , "A song is anything that can walk by itself."
  , "You can't do something forever."
  , "A hero is someone who understands the responsibility that comes with his freedom."
  , "Once upon time you dressed so fine."
  , "Please see if her hair hangs long, if it rolls and flows all down her breast."
  , "I'm a-wonderin' if she remember me at all, many times I've often prayed."
  ];

  issues.repoIssues(options, bot.handleError(function (issues) {
    var comment_options;

    _.each(issues, function postRandomQuote(issue) {
      comment_options = _.extend({
        number: issue.number
      , body: _.shuffle(quotes)[0]
      }, options);

      issues.createComment(comment_options, bot.handleError(function (data) {
        bot.trace('* [Ping] Pinged ' + issue.id + ' issue');
      }));
    });
  }));
};
