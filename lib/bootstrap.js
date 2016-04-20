module.exports = function bootstrap(options) {
  var _ = require('underscore')
    , GitHubApi = require('github')
    , http = require('http')
    , crypto = require('crypto')
    , url = require('url')
    , fs = require('fs')
    , path = require('path')
    , runHook = require('./run_hook')
    , runCron = require('./run_cron')
    , request = require('request')
    , app = {}
    , bot;

  bot = {
    options: options
  , trace: require('./bot/trace')(options)
  , handleError: require('./bot/handleError')(options)
  , store: require('./bot/store')
  , events: require('./bot/events')
  , github: new GitHubApi(_.extend({version: '3.0.0'}, options.github_api))
  , http: request
  };

  /**
   * Bootstrap the Application
   */
  app.initialize = function () {
    app.authenticate();
    _.each(options.repositories, function (repo_options, repo_fullname) {
      bot.trace('\n* Initializing repository: ' + repo_fullname);
      app.initializeCrons(repo_fullname, repo_options);
      app.initializeHooks(repo_fullname, repo_options);
    });
    app.initializeHooksServer();
  };

  /**
   * GitHub Authentication
   */
  app.authenticate = function () {
    var options = {
      type: bot.options.auth,
      username: bot.options.username
    };
    if (bot.options.auth === 'basic') {
      options.password = bot.options.password;
    } else if (bot.options.auth === 'oauth') {
      options.token = bot.options.password;
    }
    bot.github.authenticate(options);
  };

  /**
   * Creates repo info object
   *
   * @param  {String} repo_fullname
   * @return {Object}
   */
  app.buildRepoInfo = function (repo_fullname) {
    return {
      owner: repo_fullname.split('/')[0]
    , name: repo_fullname.split('/')[1]
    , full_name: repo_fullname
    };
  };

  /**
   * initialize the file scripts
   *
   * @param  {Array} scripts
   * @param  {String} default_path
   */
  app.resolveScripts = function (scripts, default_path) {
    var file_paths = {};

    _.each(scripts, function (script) {
      var filepath = path.resolve(__dirname, '../', bot.options.dir, default_path, script + '.js');

      if (fs.existsSync(filepath)) {
        bot.trace('* Custom script found in ' + filepath);
        file_paths[script] = filepath;
      } else {
        // BotDylan folder fallback
        filepath = path.resolve(__dirname, '../', default_path, script + '.js');

        if (fs.existsSync(filepath)) {
          file_paths[script] = filepath;
        } else {
          throw new Error("Script '" + script + "' ('" +  filepath + "') not found!");
        }
      }
    });

    bot.scripts = _.extend(bot.scripts || {}, file_paths);
  };

  /**
   * initialize cron scripts
   *
   * @param  {Script} repo_fullname
   * @param  {Object} repo_options
   */
  app.initializeCrons = function (repo_fullname, repo_options) {
    if (!repo_options.crons) {
      bot.trace('* No cron scripts for ' + repo_fullname);
      return;
    }


    var repo_info = app.buildRepoInfo(repo_fullname);
    bot.trace('* Initializing cron scripts for ' + repo_fullname);

    _.each(repo_options.crons, function (scripts, cron) {
      app.resolveScripts(scripts, 'scripts/crons/');
      runCron(bot, cron, scripts, repo_info);
    });
  };

  /**
   * initialize cron scripts
   *
   * @param  {Script} repo_fullname
   * @param  {Object} repo_options
   */
  app.initializeHooks = function (repo_fullname, repo_options) {
    if (!repo_options.hooks) {
      bot.trace('* No hook scripts for ' + repo_fullname);
      return;
    }

    var repo_info = app.buildRepoInfo(repo_fullname)
      , options
      , config
      , hook_names = _.keys(repo_options.hooks)
      , url_params = '?repo_fullname=' + repo_fullname;

    _.each(repo_options.hooks, function (scripts, cron) {
      app.resolveScripts(scripts, 'scripts/hooks/');
    });

    bot.trace('* Creating remote hooks ' + hook_names.join(', ') + ' in ' + repo_fullname);

    config = {url: bot.options.url + url_params, content_type: 'json'}

    if (bot.options.secret) {
      config.secret = bot.options.secret;
    }

    options = {
      user: repo_info.owner
    , repo: repo_info.name
    , name: 'web'
    , active: true
    , events: hook_names
    , config: config
    };

    bot.github.repos.createHook(options, function (error, data) {
      if (error) {
        return;
      }
      bot.trace('* Created remote hooks ' + hook_names.join(', ') + ' in ' + repo_fullname);
    });
  };

  /**
   * Initialize hooks server
   */
  app.initializeHooksServer = function () {
    var server
      , port = process.env.PORT || bot.options.port;

    server = http.createServer(function (request, response) {
      var data = new Buffer(0);

      request.on('data', function (chunk) {
        data = Buffer.concat([data, chunk]);
      });

      request.on('end', function () {
        var url_params = url.parse(this.url, true)
          , hook_name = this.headers['x-github-event']
          , sig = this.headers['x-hub-signature']
          , repo_fullname = url_params.query.repo_fullname
          , repo_info;

        if (bot.options.secret) {
          if (!sig) {
            console.error('* [ERROR] No X-Hub-Signature found on request');
            response.writeHead(403);
            response.end("No signature provided");
            return;
          } else if (sig !== signBlob(bot.options.secret, data)) {
            console.error('* [ERROR] X-Hub-Signature does not match blob signature');
            response.writeHead(400);
            response.end("Bad signature");
            return;
          } else {
            bot.trace('* [INFO] Sig match found');
          }
        }

        response.writeHead(200);
        response.end();

        if (_.isUndefined(repo_fullname)) {
          console.error('* [ERROR] Wrong hook url: ' + this.url);
          return;
        }

        bot.trace('* [INFO] New incoming \'' + hook_name + '\' hook from: ' + repo_fullname);

        repo_info = app.buildRepoInfo(repo_fullname);
        runHook(bot, hook_name, repo_info, repo_fullname, data.toString('utf8'));
      });
    });

    bot.trace('\nServer listening on port ' + port);
    server.listen(port);
  };

  function signBlob (key, blob) {
    return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex');
  }

  app.initialize();
};
