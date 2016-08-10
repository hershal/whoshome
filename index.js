'use strict';

const request = require('request');

request('http://10.0.0.1/Info.live.htm', function (err, res, body) {
  if (err) {
    console.error('could not contact server');
    system.exit(1);
  }

  console.log(`body: ${body}`);
});
