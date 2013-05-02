mocha?=node_modules/.bin/mocha
REPORTER?=tap
config?=test/config.json
wiring:
	$(mocha) test/wiring-test.js --reporter $(REPORTER)
clone:
	$(mocha) test/clone-test.js --reporter $(REPORTER)
	