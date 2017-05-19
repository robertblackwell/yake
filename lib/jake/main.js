const CLI = require('./cli_args.js');
const Jakefile = require('./jakefile.js');
const TASKS = require('./tasks.js');
const TC = require('./jake/task_collection,js');

const REPORTS = require('./reports.js');
const path = require('path');
const util = require('util');
exports.cmdMain = cmdMain;
function taskFileMain(cfg = undefined)
{
	let collection;
	if( cfg === undefined)
	{
		// tasks are defined using task() methods not cfg....
		collection = TC.getInstance();
	}
	else
	{
		collection = TASKS.loadTasksFromArray(cfg);

	}
	let [options, args] = CLI.CliParse(process.argv);

	let jakefileCandidates = Jakefile.defaultFilenames();
	let nameOfTaskToRun = 'default';

	if( options.getValueFor('showTasks') !== undefined )
	{
		console.log('THIS IS THE TASK REPORT');
		REPORTS.printTaskList(collection);
		process.exit(0);
	}

	let a = args.getArgs();
	if( a.length > 0)
	{
		nameOfTaskToRun = a[0];
	}

	let firstTask = collection.getByName(nameOfTaskToRun);

	if( firstTask === undefined)
	{
		console.log('ERROR')
		throw new Error(`task ${nameOfTaskToRun} not found`);
	}

	TASKS.invokeTask(collection, firstTask);
}

exports.jakeFileMain = jakeFileMain;
function jakeFileMain()
{
	let [options, args] = CLI.CliParse(process.argv);

	let jakefileCandidates = Jakefile.defaultFilenames();
	let nameOfTaskToRun = 'default';

	let a = args.getArgs();
	if( a.length > 0 )
	{
		nameOfTaskToRun = a[0];
	}

	let jf = options.getValueFor('file');
	if( jf !== undefined )
	{
		jakefileCandidates = [jf];
	}

	let cwd = process.cwd();
	let tmp = Jakefile.recursiveFindFile(cwd, jakefileCandidates);
	if( tmp === undefined )
	{
		let msg = jakefileCandidates.join();
		console.log(util.inspect(jakefileCandidates));
		throw new Error(`cannot find jakefile among : ${msg}`);
	}

	collection = TASKS.requireTasks(tmp);
	if( options.getValueFor('showTasks') !== undefined )
	{
		console.log('THIS IS THE TASK REPORT');
		REPORTS.printTaskList(collection);
		process.exit(0);
	}


	let firstTask = collection.getByName(nameOfTaskToRun);

	if( firstTask === undefined)
	{
		console.log('ERROR')
		throw new Error(`task ${nameOfTaskToRun} not found`);
	}

	TASKS.invokeTask(collection, firstTask);

}
