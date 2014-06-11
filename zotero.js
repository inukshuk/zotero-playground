var EventEmitter = require('events').EventEmitter;
var request = require('request');
var debug = require('debug')('zotero');
var utils = require('./utils');
var extend = utils.extend;
var url = require('url');


function Zotero(defaults) {
	// Use merge instead
  this.defaults = extend({}, Zotero.defaults, defaults);
}

Zotero.defaults = {
  url: 'https://api.zotero.org',
  params: {},
  headers: {
    'Zotero-API-Version': '2',
    'User-Agent': 'zotero-node'
  }
};

Zotero.debug = function (error, response, body) {
  if (error) {
    debug('API error: %s', error);

  } else {
    debug('API response:\n%s\n', body);
  }
};

Zotero.prototype = new EventEmitter();

Object.defineProperty(Zotero.prototype, 'prefix', {
	get: function () {
		if (this.defaults.user != null) {
			return '/users/' + this.defaults.user;
		}

		if (this.defaults.group != null) {
			return '/groups/' + this.defaults.group;
		}

		return '';
	}
});

Zotero.prototype.url = function (path, params) {
  var library = url.resolve(this.defaults.url, this.prefix);
	params = extend({}, this.defaults.params, params || {});

	return [library, path].join('/') + this.querystring(params);
};

Zotero.prototype.querystring = function (params) {
	return url.format({ query: params });
};

Zotero.prototype.read = function (path, params, callback) {
  if (typeof params === 'function') {
    callback = params; params = null;
  }

  request({
		url: this.url(path, params),
		headers: this.defaults.headers

	}, callback);

  return this;
};

exports = module.exports = Zotero;
