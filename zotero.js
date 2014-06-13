var EventEmitter = require('events').EventEmitter;
var request = require('request');
var debug = require('debug')('zotero');
var utils = require('./utils');
var extend = utils.extend;
var join = require('path').join;
var qs = require('querystring');
var url = require('url');


function Zotero(options) {
  this.options = extend({}, Zotero.defaults, options);
}

function property(name, definition) {
	return Object.defineProperty(Zotero.prototype, name, definition);
}

function reader(name, reader) {
	return property(name, { get: reader });
}

Zotero.prototype = new EventEmitter();


Zotero.defaults = {
  api: 'https://api.zotero.org',
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


reader('prefix', function () {
	if (this.options.user != null) {
		return '/users/' + this.options.user;
	}

	if (this.options.group != null) {
		return '/groups/' + this.options.group;
	}

	return '';
});

property('api', {
	get: function () { return this.options.api; },
	set: function (api) { this.options.api = api; }
});

reader('base', function () {
	return join(this.api, this.prefix);
});


Zotero.prototype.url = function (path, params) {
	return join(this.base, path) + this.stringify(params);
};

Zotero.prototype.stringify = function (params) {
	return qs.stringify(extend({}, this.options.params, params));
}


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
