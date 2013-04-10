MOCHA=node_modules/.bin/mocha
REPORTER=spec
test: unit integration
unit:
	$(MOCHA) $(shell find test -maxdepth 1 -name "*-test.js") --reporter $(REPORTER)
get-json:
	$(MOCHA) test/get-json-test.js --reporter $(REPORTER)