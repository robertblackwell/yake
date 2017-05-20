const chalk = require('chalk');

exports.logger = {};

exports.logger.log = log;
function log(msg)
{
	/* eslint-disable no-console */
    console.log(chalk.reset.green(msg));
	/* eslint-enable no-console */
}

exports.logger.warn = warn;
function warn(msg)
{
	/* eslint-disable no-console */
    console.log(chalk.reset.yellow(msg));
	/* eslint-enable no-console */
}
exports.logger.error = error;
function error(msg)
{
	/* eslint-disable no-console */
    console.log(chalk.reset.bold.red('ERROR: ') + chalk.reset.cyan(msg));
	/* eslint-enable no-console */
}
