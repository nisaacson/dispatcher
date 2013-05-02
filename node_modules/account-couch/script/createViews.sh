#!/bin/sh
# create the couchdb database
npm install -g couchdb-update-views
couchdb-update-views --config test/config.json --docsDir node_modules/couch-profile/docs
