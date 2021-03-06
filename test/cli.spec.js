/* global describe it before afterEach */
/* eslint no-unused-expressions: "off" */
'use strict';

const expect = require('chai').expect;
const exec = require('child_process').exec;

const express = require('express');
const mockPort = 33333;
let expressServer = null;

function mockServer(response, done) {
  const server = express();
  server.get('/*', (req, res) => {
    res.send(response);
  });
  expressServer = server.listen(mockPort, () => {
    done();
  });
}

function act(service, tag, dockerHost, done) {
  exec(
    `node src/cli.js -p ${mockPort} localhost ${dockerHost} ${service} ${tag}`,
    done
  );
}

afterEach(function(done) {
  expressServer.close(done);
});

describe('when querying for a service with one container on one tag on one host', function() {
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

  it('should return the container name', function(done) {
    act(
      'happy-test',
      'test',
      testHost,
      (err, stdout) => {
        expect(stdout).to.equal(`${testContainer}\n`);
        done(err);
      }
    );
  });
});

describe('when querying for a service with multiple containers on one tag', function() {
  const testHost = 'test-host';
  const testContainers = ['happy-test-container', 'another-test-container'];
  before(function(done) {
    mockServer(
      [{
        'ServiceID': `${testHost}:${testContainers[0]}:4001`
      },
      {
        'ServiceID': `${testHost}:${testContainers[1]}:4001`
      }],
      done
    );
  });

  it('should return the container names', function(done) {
    act(
      'happy-test',
      'test',
      testHost,
      (err, stdout) => {
        expect(stdout).to.equal(testContainers.join('\n') + '\n');
        done(err);
      }
    );
  });
});

describe('when querying for a service with multiple containers on one tag with multiple hosts', function() {
  const testHost = 'test-host';
  const testContainers = ['happy-test-container', 'another-test-container'];
  before(function(done) {
    mockServer(
      [{
        'ServiceID': `${testHost}:${testContainers[0]}:4001`
      },
      {
        'ServiceID': `another-host:${testContainers[1]}:4001`
      },
      {
        'ServiceID': `${testHost}:${testContainers[1]}:4001`
      }],
      done
    );
  });

  it('should return the container names for the correct host', function(done) {
    act(
      'happy-test',
      'test',
      testHost,
      (err, stdout) => {
        expect(stdout).to.equal(testContainers.join('\n') + '\n');
        done(err);
      }
    );
  });
});

describe('when querying for a service with no containers', function() {
  const testHost = 'test-host';

  before(function(done) {
    mockServer(
      [],
      done
    );
  });

  it('should return nothing', function(done) {
    act(
      'happy-test',
      'test',
      testHost,
      (err, stdout) => {
        expect(stdout).to.equal('\n');
        done(err);
      }
    );
  });
});

describe('when querying for a service and the consul API fails', function() {
  const testHost = 'test-host';

  before(function(done) {
    const server = express();
    server.get('/*', (req, res) => {
      res.sendStatus(500);
    });
    expressServer = server.listen(mockPort, () => {
      done();
    });
  });

  it('should throw an error', function(done) {
    act(
      'happy-test',
      'test',
      testHost,
      (err) => {
        expect(err).to.exist;
        done();
      }
    );
  });
});
