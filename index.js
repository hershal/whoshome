'use strict';

const parse = require('./parser').parse;
const unquote = require('./unquote');

const _ = require('lodash');
const findup = require('findup');
const request = require('request');

const rcfilename = 'whoshomerc.json';

function whoshome() {
  return new Promise(function (resolve, reject) {
    let rcFile = findRcFile(), rc = {};
    if (!rcFile) {
      reject('could not find rc file');
    }
    rc = require(rcFile);
    request(`http://${rc.router}/Info.live.htm`, function (err, res, body) {
      if (err) {
        reject(new Error('could not contact server'));
      }

      let hosts = parse(body);

      if (rc.blacklist) {
        hosts = _.filter(hosts, (host) => _.indexOf(rc.blacklist, host.hostname) < 0);
      }

      resolve(hosts);
    });
  });
};

function findRcFile() {
  let rcFile, dotRcFile;
  try {rcFile = findup.sync(__dirname, rcfilename);} catch(e) { rcFile = false; }
  try {dotRcFile = findup.sync(__dirname, `.${rcfilename}`);} catch(e) { dotRcFile = false; }
  const rcFileLength = (rcFile && rcFile.length) || Number.MAX_SAFE_INTEGER;
  const dotRcFileLength = (dotRcFile && dotRcFile.length) || Number.MAX_SAFE_INTEGER;

  const rcFileToLoad = rcFileLength === dotRcFileLength ? undefined :
          rcFileLength < dotRcFileLength ? `${rcFile}/${rcfilename}` : `${dotRcFile}/.${rcfilename}`;

  if (rcFileToLoad) {
    return(rcFileToLoad);
  }
  return false;
}

module.exports = whoshome;
