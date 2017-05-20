const Jake = require('../../../src/yake.js');

Jake.task('name1', 'this is a desc for first task', ['prereq1', 'prereq2'], function()
{
	console.log('task1');
})

Jake.task('name2', 'this is a desc for second task', ['prereq21', 'prereq22'], function()
{
	console.log('task2');
})