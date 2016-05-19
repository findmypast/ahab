'use strict';

const program = require('commander');
const search = require('./search');
const version = require('../package.json').version;

program
  .version(version);

program
  .arguments('<consul-host> <service-host> <service-name> <service-tag>')
  .option('-p, --port <port>', 'Port to query the consul host on', parseInt)
  .action(search);

if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
