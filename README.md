![](https://raw.github.com/botdylan/botdylan/master/img/botdylan.png)

Once upon a time, you managed your Github repositories,

the pull requests and the commits... didn't yoooou?

# `botdylan`: Automate your Github processes with js scripts.

`botdylan` runs as a daemon. It's configured by writing a `config.json` file
that describes `cron` and `hooks` scripts. `cron` scripts execute periodically
and `hook` scripts execute on `github hook` events.

```
$ ls /etc/botdylan
scripts/hooks
scripts/crons
config.json

$ botdylan --dir /etc/botdylan
```

## Why?

`botdylan` was initially built and used internally at [Teambox](http://teambox.com).

We use Github heavily. There are some repetitive tasks that were taking away our time
to hack on a better product. Since we are in the productivity space we decided to
stop doing things manually and start to have a more productive environment to work with.

The project is heavily inspired by [hubot](https://github.com/github/hubot).

## Give me some examples...

You can automatize any process in GitHub. Some of the things we are currently doing:

  - Label issues with the status of the CI
  - Show a cowboy image when someone posts directly to develop.
  - Label issues that have 2 or more thumbs
  - Post images on demand "image me..."
  - Label issues with the status of the PR (mergeable or not)
  - Ping inactive pull requests
  - Post message to your chat room (when the CI fails for instance)
  - Interact with other services via HTTP

## Command line options

`botdylan` has just one CLI option:

  * `--dir [current_path]`: Location of your `scripts` folder and `config.json`.

## Config.json

Configuring botdylan is damn simple! Just populate your `config.json` file on your
configuration directory with the following options:

  * `username`: Bot username
  * `password`: Bot password or oauth token
  * `auth [basic]`: Auth type to use when connecting to GitHub. Can be `basic` (username/password) or `oauth` (username/token)
  * `repositories`: Hash of repositories (owner/repository) with the `cron` and `hooks` setted up
  * `port [80]`: Port to listen github webhooks
  * `silent [false]`: Flag to disable output
  * `secret`: (*Optional*) String with high entropy to [secure your webhook](https://developer.github.com/webhooks/securing/#securing-your-webhooks)
  * `github_api`: (*Optional*) Object with options directly to `GitHubApi` constructor, see [npm's github docs](https://www.npmjs.com/package/github)

``` javascript
{
  "username": "botdylan"
, "password": "blood-on-the-tracks"
, "secret": "myhashsecret"
, "url": "http://example.com:5000"
, "port": 5000
, "repositories": {
    "botdylan/test": {
      "crons": {
        "0 0 0 * * *": ["ping"]
      }
    , "hooks": {
        "issue_comment": ["pong"]
      , "push" : ["cowboys"]
      }
    }  
  }
, "github_api": {
     "host": "my-enterprise-github-instance.mycompany.com" // if you're using GitHub Enterprise,
     "timeout": 2000
  }
}
```

Scripts under `scripts/hooks` will run on any given [hook event](http://developer.github.com/v3/repos/hooks/),
`botdylan` will create the hooks automatically if they don't exist.

Scripts under `scripts/crons` use the `cron` syntax.

## Environment variables

Sometimes you might not want to store your GitHub credentials inside repository. In order to prevent this you can use three environment variables: `GITHUB_USERNAME`, `GITHUB_PASSWORD`, `GITHUB_WEBHOOK_SECRET` - when set they will overwrite `username`, `password`, `secret` config options.

Example:

```
GITHUB_USERNAME=johndoe GITHUB_PASSWORD=qwerty GITHUB_WEBHOOK_SECRET=bazinga botdylan --dir /etc/botdylan
```

## How to write `botdylan` scripts?

The scripts have to export a single function that will be executed by
`botdylan`.

Cron scripts receive:
  - `bot`
  - `repo_info`

Hooks scripts receive:
  - `bot`
  - `repo_info`
  - `payload`

You will find plenty of examples under the `scripts` folder.

## The `bot` helper object

This object represents our beloved bot. It has some methods to help you write your scripts:

  - `trace`: Write a message to the console unless the `silent` option is sent
  - `options`: Options from your `config.json` file
  - `handleError`: Function applicator that handles showing errors if any
  - `github`: Authenticated `GitHubApi` instance of
              [node-github](https://github.com/ajaxorg/node-github)
  - `http`: A [request](https://github.com/mikeal/request) instance
  - `events`: Contains a `on` and an `emit` message. Ideal to communicate between scripts
  - `store`: A getter/setter memory storage.

# TODO

There are plenty of things that we would like to have soon done:

  - More scripts! Most of them can be imported from hubot which we love <3
  - `scripts/events` to be able to create scripts that are invoked from custom events
  - Better tools for bot to reduce the boilerplate on the scripts
  - Better documentation and how to script guides

## License

(The MIT License)

Copyright (c) 2013 Pau Ramon <masylum@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
