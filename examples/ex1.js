#!/usr/bin/env node
const yake = require('../src/yake.js');

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

yake.run(yake.MODE.yakeFromArray, tasks);

