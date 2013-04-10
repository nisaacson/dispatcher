module.exports = {
  language: 'javascript',
  views: {
    all: {
      map: function (doc) {
        if (doc.resource === 'SpawnCommand') {
          emit(doc._id, null) }
      }
    }
  }
}
