# Tide to FreeAgent statements
Command line utility to convert Tide bank statement CSV file into a format readable by FreeAgent.

Usage below. Can use either `tide-to-freeagent` or `ttf` as a shorthand for the command.

Usage: ttf <file> [options]

  Options:

    -V, --version              output the version number
    -f, --filename <filename>  Output filename (defaults to "[earliest date]-[latest date].csv" - optional)
    -s, --start <start>        Start date in YYYY-MM-DD format (optional)
    -e, --end <end>            End date in YYYY-MM-DD format (optional)
    -h, --help                 output usage information
