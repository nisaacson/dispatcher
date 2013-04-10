MOCHA=node_modules/.bin/mocha
REPORTER=spec
test: unit integration
unit:
	$(MOCHA) $(shell find test -maxdepth 1 -name "*-test.js") --reporter $(REPORTER)
get-json:
	$(MOCHA) test/get-json-test.js --reporter $(REPORTER)
get-repo-names:
	$(MOCHA) test/get-repo-names-test.js --reporter $(REPORTER)
clone-repo:
	$(MOCHA) test/clone-repo-test.js --reporter $(REPORTER)