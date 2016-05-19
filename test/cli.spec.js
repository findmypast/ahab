/* global describe it before */
/* eslint no-unused-expressions: "off" */
'use strict';

const expect = require('chai').expect;
const exec = require('child_process').exec;

const server = require('express')();
const mockPort = 33333;

function mockServer(response, done) {
  server.get('/*', (req, res) => {
    res.send(response);
  });
  server.listen(mockPort, () => {
    done();
  });
}

function act(service, tag, dockerHost, done) {
  exec(
    `node src/cli.js --consul localhost:${mockPort} --service ${service} --tag ${tag} --host ${dockerHost}`,
    done
  );
}

describe('when querying for a service with one container on one tag', function() {
  const testHost = 'test-host';
  const testContainer = 'happy-test-container';
  before(function(done) {
    mockServer(
      [{
        'ServiceID': `${testHost}:${testContainer}:4001`
      }],
      done
    );
  });

  it('should return container name for a service running one container', function(done) {
    act(
      'happy-test',
      'test',
      'test-host',
      (err, stdout) => {
        expect(stdout).to.equal('happy-test-container');
        done(err);
      }
    );
  });
});
