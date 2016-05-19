'use strict';

const program = require('commander');
const search = require('./search');
const version = require('../package.json').version;

program
  .version(version);

program
  .option('-s, --service <name>', 'The name of the service to search for.')
  .option('-t, --tag <tag>', 'The tag of the service to search for.')
  .option('-h, --host <hostname>', 'The hostname of the docker host which hosts the service.')
  .option('-c, --consul <hostname:port>', 'The hostname and port of the consul server to search.')
  .parse(process.argv);

search(program);
