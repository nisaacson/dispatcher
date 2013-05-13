MOCHA=node_modules/.bin/mocha
REPORTER?=spec
FLAGS=--reporter $(REPORTER)
test: unit
unit: 
	$(MOCHA) $(shell find test/* -prune -name "*test.js") $(FLAGS)
get-ps:
	$(MOCHA) test/get-ps-test.js $(FLAGS)
.PHONY: test