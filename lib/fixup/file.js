var fs = require('fs');
var path = require('path');

module.exports = 
{
	exists : fs.existsSync,
	cwd : process.cwd,
	join : path.join,
	absolute: path.resolve,
}