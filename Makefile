
include node_modules/make-lint/index.mk

test:
	@./node_modules/mocha/bin/mocha test/*.js

.PHONY: test
