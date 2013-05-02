/**
 * @param {Object} data,
 * @param {Array} fields
 * @return null if all required keys exist and map to truthy values
 * @return {Array} An array containing errors about all keys that failed
 */
function truthy(data, fields, cb) {
  var errors = [];
  var err;
  var i
  for(i = 0; i < fields.length; i++ ) {
    var key = fields[i]
    if (!data[key]) {
      err = {
        message: 'key not truthy data',
        key: key,
        value: data[key]
      };
      errors.push(err);
    }
  }
  if (errors.length === 0) {
    return cb()
  }
  cb(errors)
}

/**
 * @param {Object} data,
 * @param {Array} fields
 * @return null if all required keys exist and map to non-null values
 * @return {Array} An array containing errors about all keys that failed
 */
function nonNull(data, fields, cb) {
  var errors = [];
  var err;
  var i
  for(i = 0; i < fields.length; i++ ) {
    var key = fields[i]
    var value = data[key]
    if (!data.hasOwnProperty(key) || value === null || value === undefined) {
      err = {
        message: 'key not set in data',
        key: key,
        value: data[key]
      };
      errors.push(err);
    }
  }
  if (errors.length === 0) {
    return cb()
  }
  return cb(errors);
}


/**
 * @param {Object} data,
 * @param {Array} fields
 * @return null if all required keys exist and map to non-null values
 * @return {Array} An array containing errors about all keys that failed
 */
function keysOnly(data, fields, cb) {
  var errors = [];
  var err;
  var i
  for(i = 0; i < fields.length; i++ ) {
    var key = fields[i]
    var value = data[key]
    if (!data.hasOwnProperty(key)) {
      err = {
        message: 'key not set in data',
        key: key,
        value: data[key]
      };
      errors.push(err);
    }
  }
  if (errors.length === 0) {
    return cb()
  }
  cb(errors)
}



/**
 * @param {Object} data,
 * @param {Array} fields
 * @return null if all required keys exist and map to truthy values
 * @return {Array} An array containing errors about all keys that failed
 */
function truthySync(data, fields) {
  var errors = [];
  var err;
  var i
  for(i = 0; i < fields.length; i++ ) {
    var key = fields[i]
    if (!data[key]) {
      err = {
        message: 'key not truthy data',
        key: key,
        value: data[key]
      };
      errors.push(err);
    }
  }
  if (errors.length === 0) {
    return null;
  }
  return errors;
}

/**
 * @param {Object} data,
 * @param {Array} fields
 * @return null if all required keys exist and map to non-null values
 * @return {Array} An array containing errors about all keys that failed
 */
function nonNullSync(data, fields) {
  var errors = [];
  var err;
  var i
  for(i = 0; i < fields.length; i++ ) {
    var key = fields[i]
    var value = data[key]
    if (!data.hasOwnProperty(key) || value === null || value === undefined) {
      err = {
        message: 'key not set in data',
        key: key,
        value: data[key]
      };
      errors.push(err);
    }
  }
  if (errors.length === 0) {
    return null;
  }
  return errors;
}


/**
 * @param {Object} data,
 * @param {Array} fields
 * @return null if all required keys exist and map to non-null values
 * @return {Array} An array containing errors about all keys that failed
 */
function keysOnlySync(data, fields) {
  var errors = [];
  var err;
  var i
  for(i = 0; i < fields.length; i++ ) {
    var key = fields[i]
    var value = data[key]
    if (!data.hasOwnProperty(key)) {
      err = {
        message: 'key not set in data',
        key: key,
        value: data[key]
      };
      errors.push(err);
    }
  }
  if (errors.length === 0) {
    return null;
  }
  return errors;
}

module.exports = {
  // async
  truthy: truthy,
  nonNull: nonNull,
  keysOnly: keysOnly,

  // sync
  truthySync: truthySync,
  nonNullSync: nonNullSync,
  keysOnlySync: keysOnlySync
}
