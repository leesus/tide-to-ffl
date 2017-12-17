const Promise = require('bluebird');
const csv = require('csv');
const moment = require('moment');

exports.parseAsync = Promise.promisify(csv.parse);

const fieldTransforms = [
  {key: 'Date', transform: d => moment(d).format('DD/MM/YYYY')},
  {key: 'Amount', transform: n => Number(n)},
  {key: 'Transaction description', transform: s => s},
];

exports.transform = options => file =>
  exports.parseAsync(file, {delimiter: ','}).then(data => {
    const headers = data[0];
    let transformed = data
      .slice(1)
      .map(row => {
        return row.reduce((rows, row, idx) => {
          rows[headers[idx]] = row;
          return rows;
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
          if (options.single && date > moment(options.start)) included = false;
        }
        if (options.end) {
          if (date > moment(options.end)) included = false;
          if (options.single && date < moment(options.end)) included = false;
        }

        return included;
      });
    }

    return transformed;
  });
