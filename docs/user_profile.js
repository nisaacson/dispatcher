module.exports = {
  language: 'javascript',
  views: {
    all: {
      map: function (doc) {
        if (doc.resource === 'Profile' && doc.email) {
          emit(doc.email, doc) }
      }
    },
    byEmail: {
      map: function(doc) {
        if (doc.email) {
          emit(doc.email, doc);
        }
      }
    }
  }
}
