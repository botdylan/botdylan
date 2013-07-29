![](https://raw.github.com/botdylan/botdylan/master/img/botdylan.png)

Once upon a time, you managed your Github repositories,

the pull requests and the commits... didn't yoooou?

# `botdylan`: Automatize your Github processes with js scripts.

`botdylan` runs as a daemon. Is configured by writing a `config.json` file
that will contain all the information about the `cron` and `hooks` scripts.

```
$ ls /etc/botdylan
scripts/hooks
scripts/crons
config.json

$ botdylan --dir /etc/botdylan
```

## Why?

`botdylan` was initially build and used internally at [Teambox](http://teambox.com).

We use Github heavily. There are some repetitive tasks that were taking away our time
to hack a better product. Since we are on the productivity space we decided to
stop doing things manually and start to have a more productive environment to work with.

The project is heavily inspired by [hubot](https://github.com/github/hubot).

## Command line options

`botdylan` has just one CLI option:

  * `--dir [current_path]`: Location of your `scripts` folder and `config.json`.

## Config.json

Configuring botdylan is damn simple! Just populate your `config.json` file on your
configuration directory with the following options:

  * `username`: Bot username
  * `password`: Bot password
  * `repositories`: Hash of repositories (owner/repository) with the `cron` and `hooks` setted up
  * `port [80]`: Port to listen github webhooks
  * `silent [false]`: Flag to disable output

``` javascript
{
  "username": "botdylan"
, "password": "blood-on-the-tracks"
, "url": "http://example.com"
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
}
```

Scripts under `scripts/hooks` will run on any given [hook event](http://developer.github.com/v3/repos/hooks/),
`botdylan` will create the hooks automatically if they don't exist.

Scripts under `scripts/crons` use the `cron` syntax.

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
