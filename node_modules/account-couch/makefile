MOCHA=node_modules/.bin/mocha
REPORTER?=tap
config?=test/config.json
test: unit integration
unit:
	$(MOCHA) $(shell find test/* -prune -name "*test.js") --reporter $(REPORTER)
login-wiring:
	$(MOCHA) test/login-wiring-test.js --config $(config) --reporter $(REPORTER)
register-wiring:
	$(MOCHA) test/register-wiring-test.js --config $(config) --reporter $(REPORTER)

integration:
	$(MOCHA) $(shell find test/integration/* -prune -name "*test.js") --config $(config) --reporter $(REPORTER)
couch:
	$(MOCHA) test/integration/couch-test.js --config $(config) --reporter $(REPORTER)

.PHONY: test