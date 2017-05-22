#!/usr/bin/env node

var jake = require('../src/yake.js');
var childProcess = require('child_process');

jake.task('default', "the default task", [], function()
{
	console.log('This is the default task');
	childProcess.execSync('ls -al',{stdio:[1,1,1]});
})
jake.task('task1', 'this is the first task that is not the default', [], function()
{
	console.log('This is task 1');
	childProcess.execSync('ls -al /',{stdio:[1,1,1]});
})

jake.run();