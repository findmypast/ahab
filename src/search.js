'use strict';

const _ = require('lodash');

function getContainerNames(result, host) {
  const serviceIds = _.map(result, r => r.ServiceID.split(':'));
  const filtered = _.filter(serviceIds, id => id[0] === host);

  return _.map(filtered, f => f[1]);
}

module.exports = (args) => {
  const consulHostParts = args.consul.split(':');
  const consulHost = consulHostParts[0];
  const consulPort = consulHostParts[1];

  const consul = require('consul')({
    host: consulHost,
    port: consulPort,
    promisify: true
  });

  return consul.catalog.service.nodes(
    {
      service: args.service,
      tag: args.tag
    })
  .then((res) => {
    console.log(getContainerNames(res, args.host).join('\n'));
  })
  .catch((err) => {
    throw err;
  });
};
