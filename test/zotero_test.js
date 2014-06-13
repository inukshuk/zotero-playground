var expect = require('expect.js');
var Zotero = require('../zotero');

describe('Zotero', function () {
	it('is a constructor function', function () {
		expect(Zotero).to.be.a('function');
	});

	describe('instance', function () {
		var z;

		before(function () { z = new Zotero(); });

		it('has options with default values', function () {
			expect(z).to.have.property('options');
			expect(z.options).to.have.property('headers');
			expect(z.options.headers).to.have.property('Zotero-API-Version', '2');
		});
	});
});
