#!/usr/bin/env node

var yake = require('../src/yake.js');
var childProcess = require('child_process');
const path = require('path');

yake.task('default', "the default task", [], function()
{
	yake.log('This is the default task');
	yake.exec('ls -al');
})

yake.task('task1', 'this is the first task that is not the default', [], function()
{
	yake.log('This is task 1');
	yake.exec('ls -al /');
})

yake.task('task11', 'this lists the files folder', [], function()
{
	yake.log('This is task 11');
	yake.exec('ls -al ./files');
})


yake.task('task2', 'this is a task that invokes a task', [], function()
{
	yake.invokeTask('task1');
})

yake.task('task3', 'this is a task that watches files', [], function()
{
	const files = path.resolve(__dirname, "files/*.js");
	yake.watch(files, 'task1');
})


yake.run();