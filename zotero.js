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

	this.proxy({
		items: {
				terminal: ['top', 'trash'],
				postfix: ['children', 'tags']
		}
	});
}


Zotero.prototype.proxy = function (options) {
	for (var name, config in options) {
		options[name] = { value: proxy(this, name, config) };
	}

	Object.defineProperties(this, options);

	return this;
};

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


Zotero.prototype.get = function (path, params, callback) {
  if (typeof params === 'function') {
    callback = params; params = null;
  }

  request({
		url: this.url(path, params),
		headers: this.options.headers

	}, callback);

  return this;
};


function proxy(z, prefix, ext) {
	var i, ii, name;

	function p(path, params, cb) {
		return z.get(join(prefix, path), params, cb);
	};

	if (ext.terminal) {
		for (i = 0, ii = ext.terminal.length; i < ii; ++i) {
			name = ext.terminal[i];

			p[name] = function (params, cb) {
				return this(name, params, cb);
			};
		}
	}

	if (ext.postfix) {
		for (i = 0, ii = ext.postfix.length; i < ii; ++i) {
			name = ext.postfix[i];

			p[name] = function (prefix, params, cb) {
				return this(join(prefix, name), params, cb);
			};
		}
	}

	return p;
}

exports = module.exports = Zotero;
