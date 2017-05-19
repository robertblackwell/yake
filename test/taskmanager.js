var JAKE = require('../lib/jake.js');
var TaskManager = require('../lib/jake/taskmanager.js').TaskManager;
var Task = require('../lib/jake/task.js').Task;
var util = require('util');

describe('taskmanager', function(done)
{
	it('constructor', function(done)
	{
		var tm = new TaskManager();
		console.log(util.inspect(tm));
		done();
	});
	it('defineTask name', function(done)
	{
		var tm = new TaskManager();
		tm.defineTask(Task, 'anewtask');
		console.log(util.inspect(tm));
		done();

	});
	it('defineTask scope:name', function(done)
	{
		var tm = new TaskManager();
		tm.defineTask(Task, 'scope:anewtask');
		console.log(util.inspect(tm));
		done();

	});

	it('defineTask name action', function(done)
	{
		var tm = new TaskManager();
		tm.defineTask(Task, 'anewtask', function(){ console.log('a dummy');});
		console.log(util.inspect(tm));
		done();

	});
	it('defineTask name action prerequis', function(done)
	{
		var tm = new TaskManager();
		tm.defineTask(Task, 'anewtask', ['one','two'], function(){ console.log('a dummy');});
		console.log(util.inspect(tm));
		done();

	})			
})
describe('task', function(done)
{
	it('constructor', function(done)
	{
		// var t = new Task();
		// console.log(util.inspect(t));
		done();
	})
})

