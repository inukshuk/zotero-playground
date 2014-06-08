var request = require('request');
var url = require('url');
var us = require('underscore');

function Zotero(defaults) {
  this.defaults = us.extend({}, Zotero.defaults, defaults);
}

Zotero.defaults = {
  url: 'https://api.zotero.org',
  params: {},
  headers: {
    'Zotero-API-Version': '2',
    'User-Agent': 'zotero-node'
  }
};

Zotero.debug = function (err, response, body) {
  if (err) {
    console.log('Zotero call failed: ', err);

  } else {
    console.dir(response, body);
  }
};

Zotero.prototype.get = function (path, params, callback) {
  if (typeof params === 'function') {
    callback = params; params = null;
  }

  var options = us.extend({}, this.defaults);
  params = us.extend({}, options.params, params || {});

  delete options.params;

  options.url = url.resolve(options.url, path) +
    url.format({ query: params });

  request(options, callback);

  return this;
};

module.exports = Zotero;
