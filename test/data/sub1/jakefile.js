const Jake = require('../lib/_jake.js');

Jake.desc('this is a desc for first task');
Jake.task('name1', ['prereq1', 'prereq2'], function()
{
	console.log('task1');
})

Jake.desc('this is a desc for second task');
Jake.task('name2', ['prereq21', 'prereq22'], function()
{
	console.log('task2');
})