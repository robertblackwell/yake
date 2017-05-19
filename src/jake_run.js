const util = require('util');

const CLI = require('jake/cli_args.js');
const Tasks = require('jake/tasks.js');
const taskFileMain = require('jake/main').taskFileMain;
/**
 * This file exports the functions needed in a taskfile (taskfile.js file written in javascript/node)
 * that defines tasks in a data structure and is executed directly with ./taskfile.js
 * 
 * Sample taskfile
 * 

#!/usr/bin/env node
const jake = require('jake.js');

console.log(util.inspect(tasks))

const tasks = [
	{ 
		name: 'name1',
		description: 'description1',
		prerequisites: ['pre11', 'pre12'],
		action: function action1()
		{
			console.log('action 1');
		},
	},
	{
		name: 'name2',
		description: 'description2',
		prerequisites: ['pre21', 'pre22'],
		action: function action2()
		{
			console.log('action 2');
		},
	},
];

jake.run(tasks);

 */

exports.run = run
function run(cfg)
{
	taskFileMain(cfg);

}
