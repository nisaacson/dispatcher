MOCHA=node_modules/.bin/mocha
REPORTER?=spec
config?=test/config.json
test: unit
unit:
	$(MOCHA) $(shell find test/* -prune -name "*test.js") --reporter $(REPORTER)
register-wiring:
	$(MOCHA) test/register-wiring-test.js --reporter $(REPORTER)
login-wiring:
	$(MOCHA) test/login-wiring-test.js --reporter $(REPORTER)
prototype:
	$(MOCHA) test/prototype-test.js --reporter $(REPORTER)

.PHONY: test