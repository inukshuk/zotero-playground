
include node_modules/make-lint/index.mk

test: test/*.js
	@./node_modules/mocha/bin/mocha $<

.PHONY: test
