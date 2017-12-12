#!/usr/bin/env node
const chalk = require('chalk');
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
    console.log(chalk.blue('Creating file...'));
    convert(path.resolve(file), {
      start: program.start,
      end: program.end,
      filename: program.filename,
    })
      .then(({filename}) => {
        console.log(chalk.blue('Successfully created', filename));
      })
      .catch(err => {
        console.log(
          chalk.red(
            'There was an error converting the file. Please send the following to the developer:',
            err
          )
        );
      });
  })
  .parse(process.argv);
