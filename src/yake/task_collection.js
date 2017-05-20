const util = require('util');
const Set = require('es6-set');

const Task = require('./tasks.js');

/**
 * TaskCollection - an instance of this structure holds tasks that have already been defined
 * and from which some can be invoked.
 * 
 * The constructir TaskCollection can be called without the use of the keyword "new".
 * 
 * The properties of the class are hidden as local vars inside the constructor
 * and no setter methods are provided.
 *
 * @class      TaskCollection 
 * @return     {TaskCollection}  	A new instance of the class
 */
function TaskCollection()
{
	let tasks = [];
	let taskNames = [];
	let tasksByName = {};
	this.addTask = function(task)
	{
		tasks.push(task);
		taskNames.push(task.name());
		tasksByName[task.name()] = task;
	}
	this.getByName = function(key)
	{
		if( tasksByName.hasOwnProperty(key) )
		{
			return tasksByName[key];
		}
		else
		{
			return void 0;
		}
	}
	this.getAll = function()
	{
		return tasksByName;
	}
	this.display = function()
	{
		console.log(`TaskCollection names: ${util.inspect(taskNames)} length: ${tasks.length}`);

		for(let i = 0; i < tasks.length; i++)
		{
			let el = tasks[i];
			console.log(`tasks[${i}]: ${util.inspect(el)}`);
			let t = tasksByName[el.name()];
			console.log(`\tTask name:${el.name()} desc:${el.description()} prereqs: ${util.inspect(el.prerequisites())}`);
			console.log(`\t     name:${t.name()} desc:${t.description()} prereqs: ${util.inspect(t.prerequisites())}`);
		}
		console.log(`TaskCollection names: ${util.inspect(taskNames)} length: ${tasks.length}`);
	}
}

/**
 * @NOTE - TaskCollection is a singleton. In the jake/Ruby style of task definition an instance of 
 * TaskCollection needs to exist during the process of defining tasks and there is nowhere
 * other than a global to hold the collection as it is being built. This is a result of the
 * tasks being defined by 'require'-ing a javascript file 
 *
 */
const theInstance = new TaskCollection();
exports.getInstance = getInstance
function getInstance()
{
	return theInstance;
}
