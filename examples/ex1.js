#!/usr/bin/env node
const jake = require('jake_run.js');

const tasks = [
	{ 
		name: 'default',
		description: 'description default',
		prerequisites: [],
		action: function action_default()
		{
			console.log('this is the default task running ');
		},
	},
	{ 
		name: 'name1',
		description: 'description1',
		prerequisites: ['name2'],
		action: function action1()
		{
			console.log('this is task name1 - action 1');
		},
	},
	{
		name: 'name2',
		description: 'description2',
		prerequisites: [],
		action: function action2()
		{
			console.log('this is task name2 - action 2');
		},
	},
];

jake.run(tasks);

