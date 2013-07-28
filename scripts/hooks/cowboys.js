module.exports = function cowboys(bot, repo_info, payload) {
  var comment_options
    , options = {user: repo_info.owner, repo: repo_info.name}
    , cowboy_images
    , is_cowboy;

  function noop() { }

  cowboy_images = [
    'https://f.cloud.github.com/assets/935744/776149/26f64898-e97f-11e2-8bba-193234c03faa.gif'
  , 'https://f.cloud.github.com/assets/49499/776274/d5a61a14-e982-11e2-9a0b-19bfea3a6b8c.gif'
  , 'https://f.cloud.github.com/assets/935744/780438/5980293e-ea04-11e2-8f92-d8fece8d3a3b.gif'
  , 'http://24.media.tumblr.com/tumblr_lasmpzzeeO1qe0eclo1_r2_500.gif'
  ];

  is_cowboy = ((payload.ref === 'refs/heads/' + payload.repository.master_branch) &&
              !payload.deleted &&
              payload.head_commit.message.indexOf('Merge pull request') < 0);

  if (!is_cowboy) {
    return;
  }

  comment_options = _.extend({
    sha: payload.after
  , commit_id: payload.after
  , body: '![](' + cowboy_images[Math.round(Math.random() * cowboy_images.length)] + ')'
  }, options);

  bot.github.repos.createCommitComment(comment_options, bot.handleError(function () {
    bot.trace('* [Cowboys] Cowboy detected on repo ' + repo_info.owner + '/' + repo_info.name);
  }));
};
