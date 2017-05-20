const chalk = require('chalk');

exports.logger = {};

exports.logger.log = log;
function log(msg)
{
	console.log(chalk.green(msg));
}

exports.logger.warn = warn;
function warn(msg)
{
	console.log(chalk.yellow(msg));
}
exports.logger.error = error;
function error(msg)
{
	console.log(chalk.red(msg));
}
