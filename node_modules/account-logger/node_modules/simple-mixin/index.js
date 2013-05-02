module.exports = function(base, extendMe) {
  var prop
  for (prop in base) {
    if (typeof base[prop] === 'function' && !extendMe[prop]) {
      extendMe[prop] = base[prop].bind(base)
    }
  }
}
