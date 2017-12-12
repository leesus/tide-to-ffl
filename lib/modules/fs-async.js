const Promise = require('bluebird');
const fs = require('fs');

Promise.promisifyAll(fs);

exports.readFileAsync = file => fs.readFileAsync(file, 'utf8');
exports.writeFileAsync = ({file, filename}) =>
  fs.writeFileAsync(filename, file).then(() => ({file, filename}));
