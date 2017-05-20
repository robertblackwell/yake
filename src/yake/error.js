const chalk = require('chalk');
const process = require('process');

exports.raiseError = raiseError;
function raiseError(msgString, returnCode = -1)
{
	/* eslint-disable no-console */
    console.log(chalk.red.bold('ERROR: ') + chalk.reset.cyan(msgString));
	/* eslint-enable no-console */
    process.exit(returnCode);
}
