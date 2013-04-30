MOCHA=node_modules/.bin/mocha
REPORTER=spec
config?=test/config.json
test: unit integration
unit:
	$(MOCHA) $(shell find test -maxdepth 1 -name "*-test.js") --reporter $(REPORTER)
register: 
	$(MOCHA) test/register-test.js --config $(config) --reporter $(REPORTER)
get-json:
	$(MOCHA) test/get-json-test.js --reporter $(REPORTER)
get-repo-names:
	$(MOCHA) test/get-repo-names-test.js --reporter $(REPORTER)
clone-repo:
	$(MOCHA) test/clone-repo-test.js --reporter $(REPORTER)
deploy-repo:
	$(MOCHA) test/deploy-repo-test.js --reporter $(REPORTER)
perform-add-command:
	$(MOCHA) test/perform-add-command-test.js --reporter $(REPORTER)
perform-spawn:
	$(MOCHA) test/perform-spawn-test.js --reporter $(REPORTER)
perform-update-repo:
	$(MOCHA) test/perform-update-repo-test.js --reporter $(REPORTER)

stop-pid:
	$(MOCHA) test/stop-pid-test.js --reporter $(REPORTER)
setup-hub:
	$(MOCHA) test/setup-hub-test.js --reporter $(REPORTER)
setup-drone:
	$(MOCHA) test/setup-drone-test.js --reporter $(REPORTER)
