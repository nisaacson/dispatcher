MOCHA=node_modules/.bin/mocha
REPORTER?=tap
config?=test/config.json
test: unit 
unit:
	$(MOCHA) $(shell find test/* -prune -name "*test.js") --reporter $(REPORTER)
wiring:
	$(MOCHA) test/wiring-test.js --reporter $(REPORTER)
.PHONY: test