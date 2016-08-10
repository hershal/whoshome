'use strict';

const parse = require('./parser').parse;
const unquote = require('./unquote');

const _ = require('lodash');
const findup = require('findup');
const request = require('request');

const rcfilename = 'whoshomerc.json';

let rcFile = findRcFile();
let rc = {};
if (rcFile) {
  rc = require(rcFile);
}

request('http://10.0.0.1/Info.live.htm', function (err, res, body) {
  if (err) {
    console.error('could not contact server');
    system.exit(1);
  }

  let hosts = _.filter(parse(body), (host) => _.has(host, 'snr'));

  if (rc.blacklist) {
    hosts = _.filter(hosts, (host) => _.indexOf(rc.blacklist, host.hostname) < 0);
  }

  const out = _.join(_.map(hosts, (h) => _.join(_.values(h), ' ')), '\n');
  console.log(out);
});

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
