/**
 * Description:
 *  A way to interact with the Google Images API.
 *
 * Commands:
 *   image me <query> - The Original. Queries Google Images for <query> and returns a random top result.
 *
 *  Disclosure:
 *    This is an example of migrating a
 *    [hubot](https://github.com/github/hubot/blob/master/src/scripts/google-images.coffee)
 *    script into a botdylan one
 */
module.exports = function (bot, repo_info, payload) {
  var body = payload.comment.body
    , match = body.match(/image( me)? (.*)/i)
    , url = 'http://ajax.googleapis.com/ajax/services/search/images?'
    , query;

  if (!match) {
    return;
  }

  query = match[2];
  url += 'v=1.0&rsz=8&q=' + query + '&safe=active';

  bot.http(url, bot.handleError(function (response, body) {
    var images = JSON.parse(body)
      , comment_options
      , options = {user: repo_info.owner, repo: repo_info.name}
      , image;

    images = images.responseData && images.responseData.results;

    if (images && images.length > 0) {
      image = _.shuffle(images)[0];

      comment_options = _.extend({
        number: payload.issue.number
      , body: '![](' + image.unescapedUrl + ')'
      }, options);

      bot.github.issues.createComment(comment_options, bot.handleError(function (data) {
        bot.trace(
          '* [GoogleImages] Answered an `image me` command on the issue #' +
          payload.issue.number + ' on the repo ' +
          repo_info.owner + '/' + repo_info.name
        );
      }));
    }
  }));
};
