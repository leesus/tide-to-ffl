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
