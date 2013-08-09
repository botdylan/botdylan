#!/usr/bin/env node

var program = require('commander')
  , fs = require('fs')
  , config_directory
  , config_options
  , app_options
  , default_options = {silent: false, port: 80, dir: process.cwd()}
  , mandatory_options = ['dir'];

GLOBAL._ = require('underscore');

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .option('-d', '--dir', 'Configuration and scripts directory', String)
  .parse(process.argv);

config_directory = default_options.dir || program.dir;
config_options = require('cjson').load(config_directory + '/config.json');
app_options = _.extend(default_options, config_options);

_.each(mandatory_options, function (mandatory_option) {
  if (_.isUndefined(app_options[mandatory_option])) {
    console.error('--' + mandatory_option + ' is mandatory!');
    process.exit(1);
  }
});

require('../lib/bootstrap')(app_options);
