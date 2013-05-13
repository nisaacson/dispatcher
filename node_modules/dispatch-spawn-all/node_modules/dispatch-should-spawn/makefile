MOCHA=node_modules/.bin/mocha
REPORTER?=spec
FLAGS=--reporter $(REPORTER)
test: unit
unit: 
	$(MOCHA) $(shell find test/* -prune -name "*test.js") $(FLAGS)
should-spawn:
	$(MOCHA) test/should-spawn-test.js $(FLAGS)
.PHONY: test