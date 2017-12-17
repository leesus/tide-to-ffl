const path = require('path');

module.exports = options => rows => {
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
    const dates = [...new Set(rows.map(row => row[0]))];
    if (dates.length === 1) {
      filename = `${dates[0].replace(/\//g, '')}${extension}`;
    } else {
      filename = `${dates[dates.length - 1].replace(
        /\//g,
        ''
      )}-${dates[0].replace(/\//g, '')}${extension}`;
    }
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
