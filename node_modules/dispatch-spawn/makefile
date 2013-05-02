mocha?=node_modules/.bin/mocha
REPORTER?=tap
config?=test/config.json
wiring:
	$(mocha) test/wiring-test.js --reporter $(REPORTER)
spawn:
	$(mocha) test/spawn-test.js --reporter $(REPORTER)
	