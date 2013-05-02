MOCHA=node_modules/.bin/mocha
REPORTER=spec
config?=test/config.json
test: unit 
unit:
	$(MOCHA) $(shell find test -maxdepth 1 -name "*-test.js") --config $(config) --reporter $(REPORTER)
register: 
	$(MOCHA) test/register-test.js --config $(config) --reporter $(REPORTER)
get-json:
	$(MOCHA) test/get-json-test.js --config $(config) --reporter $(REPORTER)
get-repo-names:
	$(MOCHA) test/get-repo-names-test.js --config $(config) --reporter $(REPORTER)
clone-repo:
	$(MOCHA) test/clone-repo-test.js --config $(config) --reporter $(REPORTER)
deploy-repo:
	$(MOCHA) test/deploy-repo-test.js --config $(config) --reporter $(REPORTER)
perform-add-command:
	$(MOCHA) test/perform-add-command-test.js --config $(config) --reporter $(REPORTER)
perform-spawn:
	$(MOCHA) test/perform-spawn-test.js --config $(config) --reporter $(REPORTER)
perform-update-repo:
	$(MOCHA) test/perform-update-repo-test.js --config $(config) --reporter $(REPORTER)

stop-pid:
	$(MOCHA) test/stop-pid-test.js --config $(config) --reporter $(REPORTER)
setup-hub:
	$(MOCHA) test/setup-hub-test.js --config $(config) --reporter $(REPORTER)
setup-drone:
	$(MOCHA) test/setup-drone-test.js --config $(config) --reporter $(REPORTER)
