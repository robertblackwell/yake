const chalk = require('chalk');
const process = require('process');

exports.raiseError = raiseError;
function raiseError(msgString, returnCode = -1)
{
	console.log(chalk.red('ERROR: ') + chalk.green(msgString));
	process.exit(returnCode); 
}