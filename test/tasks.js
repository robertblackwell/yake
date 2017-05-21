const util = require('util');
const chai = require('chai');
const process = require('process');
const path = require('path');

const TASKS = require('../src/yake/tasks.js');
const TC = require('../src/yake/task_collection.js');
const IL = require('../src/yake/invocation_list.js');

const InvocationList = IL.InvocationList;
const _invokeTask = TASKS._invokeTask;
debugger;
describe('loadtasks', function()
{
	it('first', function(done)
	{
		// this should trigger calls to defineTask for ever task in this file
		let p = path.resolve(__dirname, 'data/y/yakefile.js');

		let collection = TC.TaskCollection([]);

		let collection2 = TASKS.loadPreloadedTasks(collection);

		let collection3 = TASKS.requireTasks(p, collection2);
		// console.log(`taskCollection: ${util.inspect(collection.getAll())}`);

		chai.expect(typeof collection3.getAll() ).equal('object');
		chai.expect(collection3.getAll() ).not.equal(null);
		let tmp = collection3.getAll();
		chai.expect(tmp.get('help').name()).equal('help');
		chai.expect(tmp.get('name1').name()).equal('name1');
		chai.expect(tmp.get('name2').name()).equal('name2');
		chai.expect(collection3.asArray().length).equal(3);
		done();
	});
	it('fromarray', function(done)
	{
		debugger;
		// this is an easier way to test
		const config = [
			{
				name: 'name1',
				description: 'description1',
				prerequisites: ['pre11', 'pre12'],
				action: function action1(){},
			},
			{
				name: 'name2',
				description: 'description2',
				prerequisites: ['pre21', 'pre22'],
				action: function action2(){},
			},
		];

		let collection = TC.TaskCollection([]);
		collection = TASKS.loadTasksFromArray(config, collection);

		chai.expect(typeof collection.getAll() ).equal('object');
		chai.expect(collection.getAll() ).not.equal(null);
		let tmp = collection.getAll();
		chai.expect(tmp.get('name1').name()).equal('name1');
		chai.expect(tmp.get('name2').name()).equal('name2');
		chai.expect(collection.asArray().length).equal(2);
		chai.expect(collection.asArray()[0].name()).equal('name1');
		chai.expect(collection.asArray()[1].name()).equal('name2');
		done();
	});
});

describe('invoketasks', function()
{
	it('prerequisites', function(done)
	{
		let var1;
		let var2;
		let var3;
		let var4;
		let tracking = [];
		// this is an easier way to test
		const config = [
			{
				name: 'name1',
				description: 'description1',
				prerequisites: ['name2', 'name3'],
				action: function action1()
				{
					// console.log(`name1 action called`);
					var1 = 'name1 got here';
					tracking.push(1);
				},
			},
			{
				name: 'name2',
				description: 'description2',
				prerequisites: ['name3'],
				action: function action2()
				{
					// console.log(`name2 action called`);
					var2 ='name2 got here';
					tracking.push(2);
				},
			},
			{
				name: 'name3',
				description: 'description3',
				prerequisites: [],
				action: function action3()
				{
					// console.log(`name3 action called`);
					var3 ='name3 got here';
					tracking.push(3);
				},
			},
			{
				name: 'name4',
				description: 'description4',
				prerequisites: [],
				action: function action4()
				{
					console.log(`name4 action called`);
					var4 ='name4 got here';
					tracking.push(4);
				},
			},					
		];

		let collection = TC.TaskCollection([]);
		collection = TASKS.loadTasksFromArray(config, collection);

		let loopsList = InvocationList();
		let alreadyDoneList = InvocationList();
		let tsk = collection.getByName('name1');
		_invokeTask(collection, loopsList, alreadyDoneList, collection.getByName('name1'));
		chai.expect(var1).equals('name1 got here')
		chai.expect(var2).equals('name2 got here')
		chai.expect(var3).equals('name3 got here')
		chai.expect(var4).equals(undefined);
		/**
		 * @NOTE - even though task 'name3' is a prerequisite twice it is only executed once
		 */
		chai.expect(JSON.stringify(tracking)).equals(JSON.stringify([3,2,1]));
		done();
	});	
	it('loopdetection', function(done)
	{
		let var1;
		let var2;
		let var3;
		let var4;
		let tracking = [];
		// this is an easier way to test
		const config = [
			{
				name: 'name1',
				description: 'description1',
				prerequisites: ['name2', 'name3'],
				action: function action1()
				{
					// console.log(`name1 action called`);
					var1 = 'name1 got here';
					tracking.push(1);
				},
			},
			{
				name: 'name2',
				description: 'description2',
				prerequisites: ['name3'],
				action: function action2()
				{
					// console.log(`name2 action called`);
					var2 ='name2 got here';
					tracking.push(2);
				},
			},
			{
				name: 'name3',
				description: 'description3',
				prerequisites: ['name2'],
				action: function action3()
				{
					// console.log(`name3 action called`);
					var3 ='name3 got here';
					tracking.push(3);
				},
			},
			{
				name: 'name4',
				description: 'description4',
				prerequisites: [],
				action: function action4()
				{
					console.log(`name4 action called`);
					var4 ='name4 got here';
					tracking.push(4);
				},
			},					
		];
debugger;
		let collection = TC.TaskCollection([]);
		collection = TASKS.loadTasksFromArray(config, collection);
		let loopsList = InvocationList();
		let alreadyDoneList = InvocationList();
		let tsk = collection.getByName('name1');
		let f = ()=>
		{
			_invokeTask(collection, loopsList, alreadyDoneList, collection.getByName('name1'));
		}
		chai.assert.throws(f, Error, "circular dependency");
		/**
		 * @NOTE - even though task 'name3' is a prerequisite twice it is only executed once
		 */
		// chai.expect(JSON.stringify(tracking)).equals(JSON.stringify([3,2,1]));
		done();
	});	

});
describe('copy', function()
{

	// trying to show/test immutability during copy creation
	it('copytask', function()
	{
		let name = 'aname';
		const description = 'adescription';
		const prereqs = ['p1', 'p2'];
		const action = function _action(){};
		const task1 = TASKS.Task(name, description, prereqs, action);
		name = 'name2';

		// changing name after creation does not change object
		chai.expect('aname').equal(task1.name());

		const task2 = TASKS.Task.copy(task1);

		task1._name = 'anothername'; //cheat
		chai.expect('anothername').equal(task1.name()); // we did cheat and change task1.name()
		chai.expect('aname').equal(task2.name()); // but it did not change task2.name()
	})
})

describe('arguments', function(done)
{
	describe('normalizearguments', function()
	{
		it('correct-4', function(done)
		{
			const args = TASKS.normalizeArguments('aname', 'adescription', ['some','prereqs'], function aFunc(){});

			chai.expect(args.name).equal('aname');
			chai.expect(args.description).equal('adescription');
			chai.expect(Array.isArray(args.prereqs)).equal(true);
			chai.expect(args.prereqs.length).equal(2);
			chai.expect((typeof args.action)).equal('function');
			done();
		});
		it('correct-3-1', function(done)
		{
			const args = TASKS.normalizeArguments('aname', ['some','prereqs'], function aFunc(){});

			// console.log(util.inspect(args));
			chai.expect(args.name).equal('aname');
			chai.expect(args.description).equal('');
			chai.expect(Array.isArray(args.prereqs)).equal(true);
			chai.expect(args.prereqs.length).equal(2);
			chai.expect((typeof args.action)).equal('function');
			done();
		});		
		it('correct-3-2', function(done)
		{
			const args = TASKS.normalizeArguments('aname', 'adescription', function aFunc(){});
			// console.log(util.inspect(args));
			chai.expect(args.name).equal('aname');
			chai.expect(args.description).equal('adescription');
			chai.expect(Array.isArray(args.prereqs)).equal(true);
			chai.expect(args.prereqs.length).equal(0);
			chai.expect((typeof args.action)).equal('function');
			done();
		});		
		it('correct-2', function(done)
		{
			const args = TASKS.normalizeArguments('aname', function aFunc(){});
			// console.log(util.inspect(args));
			chai.expect(args.name).equal('aname');
			chai.expect(args.description).equal('');
			chai.expect(Array.isArray(args.prereqs)).equal(true);
			chai.expect(args.prereqs.length).equal(0);
			chai.expect((typeof args.action)).equal('function');
			done();
		});				
	});
});