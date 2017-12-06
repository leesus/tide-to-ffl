const fs = require('fs');
const path = require('path');
const {parse} = require('csv');
const moment = require('moment');

const fieldTransforms = [
  {key: 'Date', transform: d => moment(d).format('DD/MM/YYYY')},
  {key: 'Amount', transform: n => Number(n)},
  {key: 'Transaction description', transform: s => s},
];

const readFileAsync = file =>
  new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });

const parseAndTransform = options => file =>
  new Promise((resolve, reject) => {
    parse(file, {delimiter: ','}, (err, data) => {
      if (err) return reject(err);
      const headers = data[0];
      let transformed = data
        .slice(1)
        .map(row => {
          return row.reduce((csv, row, idx) => {
            csv[headers[idx]] = row;
            return csv;
          }, {});
        })
        .map(row =>
          fieldTransforms.map(field => field.transform(row[field.key]))
        );

      if (!!options.start || !!options.end) {
        transformed = transformed.filter(row => {
          const date = moment(row[0], 'DD/MM/YYYY');
          let included = true;

          if (options.start) {
            if (date < moment(options.start)) included = false;
          }
          if (options.end) {
            if (date > moment(options.end)) included = false;
          }

          return included;
        });
      }

      return resolve(transformed);
    });
  });

const createString = options => rows => {
  const extension = '.csv';
  let filename;

  if (!!options.filename) {
    if (path.extname(options.filename) !== extension) {
      filename = `${path.basename(
        options.filename,
        path.extname(options.filename)
      )}${extension}`;
    } else {
      filename = options.filename;
    }
  } else {
    if (rows.length === 1)
      filename = `${rows[0][0].replace(/\//g, '')}${extension}`;
    else
      filename = `${rows[rows.length - 1][0].replace(
        /\//g,
        ''
      )}-${rows[0][0].replace(/\//g, '')}${extension}`;
  }

  return Promise.resolve({
    file: rows
      .map(row =>
        row
          .map(cell => (typeof cell === 'number' ? cell : `"${cell}"`))
          .join(',')
      )
      .join('\n'),
    filename,
  });
};

const writeFile = ({file, filename}) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filename, file, err => {
      if (err) return reject(err);
      return resolve(file);
    });
  });

module.exports = function convert(file, options = {}) {
  readFileAsync(file)
    .then(parseAndTransform(options))
    .then(createString(options))
    .then(writeFile);
};
