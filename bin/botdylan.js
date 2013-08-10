#!/usr/bin/env node

var program = require('commander')
  , fs = require('fs')
  , path = require('path')
  , config_file
  , config_options
  , app_options
  , default_options = {silent: false, port: 80};

GLOBAL._ = require('underscore');

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .usage('[options]')
  .option('-d, --dir <path>', 'Configuration and scripts directory', __dirname)
  .parse(process.argv);

default_options.dir = path.resolve(program.dir);
config_file = path.resolve(default_options.dir + '/config.json');

console.log('* Scripts path: ' + default_options.dir);
console.log('* Configuration path: ' + config_file);

config_options = require('cjson').load(config_file);
app_options = _.extend(default_options, config_options);

require('../lib/bootstrap')(app_options);
