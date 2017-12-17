const lib = require('./modules');

module.exports = (file, options = {}) => {
  if (options.buffer) {
    return Promise.resolve(file)
      .then(lib.transform(options))
      .then(lib.stringify(options));
  }

  return lib
    .readFileAsync(file)
    .then(lib.transform(options))
    .then(lib.stringify(options))
    .then(lib.writeFileAsync);
};
