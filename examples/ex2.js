#!/usr/bin/env node

var jake = require('../lib/jake.js');
var childProcess = require('child_process');

jake.task('default', function()
{
	console.log('This is the default task');
	childProcess.execSync('ls -al',{stdio:[1,1,1]});
})
jake.desc('this is the first task that is not the default')
jake.task('task1', function()
{
	console.log('This is task 1');
	childProcess.execSync('ls -al /',{stdio:[1,1,1]});
})

jake.run();