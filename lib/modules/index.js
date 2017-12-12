const fsAsync = require('./fs-async');
const transform = require('./transform').transform;
const stringify = require('./stringify');

module.exports = {
  readFileAsync: fsAsync.readFileAsync,
  writeFileAsync: fsAsync.writeFileAsync,
  transform: transform,
  stringify: stringify,
};
