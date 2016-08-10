'use strict';

const _ = require('lodash');
const unquote = require('./unquote');

module.exports.parse = function (string) {
  let dhcpClients;
  let wifiClients;

  const lines = _(string).split('\n').map((str) => unquote(str, '\{\}')).value();

  const dhcpClientsString = getCategory(lines, 'dhcp_leases');
  const wirelessClientsString = getCategory(lines, 'active_wireless');

  return dhcpClientsString;
};

function getCategory(lines, category) {
  const line = _(lines)
          .filter((line) => _.split(line, '::')[0] === category)
          .split('::')
          .value()[1];

  return _(line)
    .split(',')
    .map(unquote)
    .chunk(5)
    .value();
}

module.exports.client = class client {
  constructor(args) {
    this.hostname = args[0];
    this.ip = args[1];
    this.mac = args[2];
  }
};
