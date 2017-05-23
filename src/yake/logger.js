const chalk = require('chalk');

exports.logger = {};
exports.logger.log = log;
exports.logger.warn = warn;
exports.logger.error = error;

function log(msg)
{
	/* eslint-disable no-console */
    console.log(chalk.reset.green(msg));
	/* eslint-enable no-console */
}

function warn(msg)
{
	/* eslint-disable no-console */
    console.log(chalk.reset.yellow(msg));
	/* eslint-enable no-console */
}
function error(msg)
{
	/* eslint-disable no-console */
    console.log(chalk.reset.bold.red('ERROR: ') + chalk.reset.cyan(msg));
	/* eslint-enable no-console */
}
