const lib = require('./modules');

module.exports = (file, options = {}) =>
  lib
    .readFileAsync(file)
    .then(lib.transform(options))
    .then(lib.stringify(options))
    .then(lib.writeFileAsync);
