const childProcess = require('child_process');
exports.exec = exec;
function exec(cmdString)
{
	childProcess.execSync(cmdString, {stdio:[1,1,1]});
}