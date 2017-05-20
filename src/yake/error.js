const chalk = require('chalk');
const process = require('process');

// exports.YakeError = {}
// exports.YakeError.raiseError = raiseError;
exports.raiseError = raiseError;
function raiseError(msgString, returnCode = -1)
{
	console.log(chalk.red.bold('ERROR: ') + chalk.reset.cyan(msgString));
	process.exit(returnCode); 
}