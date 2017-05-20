const childProcess = require('child_process');

/**
 * Simple sync exec function to execute shell commands.
 * Provided this rather than shelljs.exec because I wanted something
 * that woudl pass colors through so that webpack etc still look 'nice'
 */
exports.exec = exec;
function exec(cmdString)
{
    childProcess.execSync(cmdString, { stdio : [1, 1, 1] });
}
