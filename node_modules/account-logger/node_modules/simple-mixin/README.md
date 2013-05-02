# Mixup
Simple mixin for node.js propgrams. Taken from the [Testable Javascript](http://youtu.be/JjqKQ8ezwKQ) Google Tech Talk

# Installation

```bash
npm install -S simple-mixin'
```

# Usage

```javascript
var mixin = require('simple-mix')
var Base = function() {
  this.name = 'base name'
}
Base.prototype.save = function() {
  console.log('save called for name: ' + this.name)
}

var Extendable = function() {
  this.name = 'extandable name'
}
var base = new Base()
var extendable = new Extendable()
mixin(base, extendable)
extendable.save()
```


