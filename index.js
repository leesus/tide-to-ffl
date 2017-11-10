#!/usr/bin/env node
const program = require('commander');
const path = require('path');
const convert = require('./lib');

program
  .version('0.1.0')
  .usage('<file> [options]')
  .arguments('<file> Tide CSV file to convert')
  .option(
    '-f, --filename <filename>',
    'Output filename (defaults to "[earliest date]-[latest date].csv" - optional)'
  )
  .option('-s, --start <start>', 'Start date in YYYY-MM-DD format (optional)')
  .option('-e, --end <end>', 'End date in YYYY-MM-DD format (optional)')
  .action(file => {
    convert(path.resolve(file), {
      start: program.start,
      end: program.end,
      filename: program.filename,
    });
  })
  .parse(process.argv);
