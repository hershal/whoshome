'use strict';

const _ = require('lodash');
const unquote = require('./unquote');

function dhcp(args) {
  return {
    hostname: args[0],
    ip: args[1],
    mac: args[2]
  };
}

function wifi(args) {
  return {
    mac: args[0],
    uptime: args[2],
    signal: args[5],
    snr: args[7]
  };
}

function parse(string) {
  const lines = _(string).split('\n').map((str) => unquote(str, '\{\}')).value();

  const dhcpClients = _.map(getCategory(lines, 'dhcp_leases', 5), (arr) => dhcp(arr));
  let dhcpClientsHash = _.zipObject(_.map(dhcpClients, (c) => c.mac), dhcpClients);

  const wifiClients = _.map(getCategory(lines, 'active_wireless', 9), (arr) => wifi(arr));
  let wifiClientsHash = _.zipObject(_.map(wifiClients, (w) => w.mac), wifiClients);

  return _.values(_.merge(dhcpClientsHash, wifiClientsHash));
};

function getCategory(lines, category, chunkSize) {
  const line = _(lines)
          .filter((line) => _.split(line, '::')[0] === category)
          .split('::')
          .value()[1];

  return _(line)
    .split('\',\'')
    .map(_.trim)
    .map(unquote)
    .chunk(chunkSize)
    .value();
}

module.exports.dhcp = dhcp;
module.exports.wifi = wifi;
module.exports.parse = parse;
