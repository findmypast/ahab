'use strict';

const _ = require('lodash');

function getContainerNames(result, host) {
  const serviceIds = _.map(result, r => r.ServiceID.split(':'));
  const filtered = _.filter(serviceIds, id => id[0] === host);

  return _.map(filtered, f => f[1]);
}

module.exports = (consulHost, serviceHost, serviceName, serviceTag, options) => {
  const consul = require('consul')({
    host: consulHost,
    port: options.port,
    promisify: true
  });

  return consul.catalog.service.nodes(
    {
      service: serviceName,
      tag: serviceTag
    },
    (err, res) => {
      if (err) {
        throw err;
      }

      console.log(getContainerNames(res, serviceHost).join('\n'));
    });
};
