const childProcess = require('child_process');
const util = require('util');
/**
 * Simple sync exec function to execute shell commands.
 * Provided this rather than shelljs.exec because I wanted something
 * that woudl pass colors through so that webpack etc still look 'nice'
 */
module.exports.exec = exec;
function exec(cmdString)
{
    childProcess.execSync(cmdString, { stdio : [1, 1, 1] });
    return;
	try
	{
	    // childProcess.execSync(cmdString, { stdio : [1, 1, 1] });
	    childProcess.execSync(cmdString);
	    return 0;
	}
	catch(e)
	{
		console.log(`yake.exec: cmd : ${cmdString} failed `);
		console.log(e.stack);
		throw e;
	}
}
