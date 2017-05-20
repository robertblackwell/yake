const chalk = require('chalk');

exports.log = log;
function log(msg)
{
	console.log(chalk.green(msg));
}

exports.warn = warn;
function warn(msg)
{
	console.log(chalk.yellow(msg));
}
exports.error = error;
function error(msg)
{
	console.log(chalk.red(msg));
}
