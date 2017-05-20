const chalk = require('chalk');

exports.logger = {};

exports.logger.log = log;
function log(msg)
{
	console.log(chalk.reset.green(msg));
}

exports.logger.warn = warn;
function warn(msg)
{
	console.log(chalk.reset.yellow(msg));
}
exports.logger.error = error;
function error(msg)
{
	console.log(chalk.reset.bold.red('ERROR: ') + chalk.reset.cyan(msg));
}
