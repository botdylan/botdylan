module.exports = function ci(bot, repo_info, payload) {
  var issue_options
    , comment_options
    , number
    , options = {user: repo_info.owner, repo: repo_info.name}
    , SAD_CI_LABEL = 'sad-ci'
    , HAPPY_CI_LABEL = 'happy-ci'
    , PENDING_CI_LABEL = 'pending-ci'
    , sad_images;

  sad_images = [
    'http://img593.imageshack.us/img593/2913/pffi.png'
  , 'http://img824.imageshack.us/img824/9505/1sfe.png'
  , 'http://img43.imageshack.us/img43/3858/f84.png'
  ];

  function onEditIssue(data) {
    var saved_labels = _.pluck(data.labels, 'name') || [];
    bot.trace('* [CI] Issue#' + number + ' updated with labels: ' + saved_labels.join());
  }

  function updateIssueLabels(number, adds, removes) {
    issue_options = _.extend({number: number}, options);

    bot.github.issues.getRepoIssue(issue_options, bot.handleError(function (data) {
      var labels = _.pluck(data.labels, 'name') || [];

      bot.trace('* [CI] Issue #' + number + ' has labels: ' + labels.join());

      // New labels
      labels = _.partial(_.without, labels).apply(_, removes).concat(adds);

      issue_options = _.extend({
        number: number
      , title: data.title
      , description: data.description
      , labels: labels
      }, options);

      bot.github.issues.edit(issue_options, bot.handleError(onEditIssue));
    }));
  }

  number = payload.pull_request.number;

  bot.trace('* [CI] Issue#' + number + ' has a CI ' + payload.state + ' state');

  // Update  the GitHub labels accordily
  if (payload.state === 'success') {
    updateIssueLabels(number, [HAPPY_CI_LABEL], [SAD_CI_LABEL, PENDING_CI_LABEL]);
  } else if (payload.state === 'pending') {
    updateIssueLabels(number, [PENDING_CI_LABEL], [SAD_CI_LABEL, HAPPY_CI_LABEL]);
  } else if (payload.state === 'failure') {
    updateIssueLabels(number, [SAD_CI_LABEL], [HAPPY_CI_LABEL, PENDING_CI_LABEL]);

    comment_options = _.extend({
      number: number
    , body: '![](' + sad_images[Math.round(Math.random() * sad_images.length)] + ')'
    }, options);

    bot.github.issues.createComment(comment_options, bot.handleError(function (data) {
      bot.trace('* [CI] Commented a sad image to issue#' + number);
    }));
  }
};
