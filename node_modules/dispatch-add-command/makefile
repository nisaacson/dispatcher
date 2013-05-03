mocha?=node_modules/.bin/mocha
REPORTER?=tap
config?=test/config.json
test:
	$(mocha) $(shell find test/* -prune -name "*test.js") --config $(config) --reporter $(REPORTER)
wiring:
	$(mocha) test/wiring-test.js --reporter $(REPORTER)
add:
	$(mocha) test/add-test.js --config $(config) --reporter $(REPORTER)
.PHONY: test