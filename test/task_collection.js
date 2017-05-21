const util = require('util');
const chai = require('chai');
const process = require('process');
const path = require('path');

const TASKS = require('../src/yake/tasks.js');
const TC = require('../src/yake/task_collection.js');

describe('taskcollection', function()
{
	it('copy', function()
	{
		const arrayOfTasks = [
			TASKS.Task('name1','description1',['name2', 'name3'], function action1()
				{
					// console.log(`name1 action called`);
					var1 = 'name1 got here';
					tracking.push(1);
				}
			),
			TASKS.Task('name2','description2', ['name3'], function action2()
				{
					// console.log(`name2 action called`);
					var2 ='name2 got here';
					tracking.push(2);
				}
			)
		];
		const arrayOfTasks2 = [
			TASKS.Task('name2','description2', ['name3'], function action2()
				{
					// console.log(`name2 action called`);
					var2 ='name2 got here';
					tracking.push(2);
				}
			),			TASKS.Task('name3', 'description3', ['name2'], function action3()
				{
					// console.log(`name3 action called`);
					var3 ='name3 got here';
					tracking.push(3);
				}
			),
			TASKS.Task('name4', 'description4',[], function action4()
				{
					console.log(`name4 action called`);
					var4 ='name4 got here';
					tracking.push(4);
				}
			),					
		];
		debugger;
		let collection = TC.TaskCollection(arrayOfTasks);
		debugger;
		let col1 = collection.copy(collection);
		let col2 = TC.TaskCollection(arrayOfTasks2);

		let col3 = col1.union(col2);
		debugger;
	})
})