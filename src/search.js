'use strict';

function getContainerNames(result) {
  return result;
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
    console.log(getContainerNames(res));
  })
  .catch((err) => {
    throw err;
  });
};
