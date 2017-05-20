const CLI 		= require('./cli_args.js');
const Yakefile 	= require('./yakefile.js');
const TASKS 	= require('./tasks.js');
const TC 		= require('./task_collection.js');
const MODE 		= require('./mode.js').MODE;

const REPORTS 	= require('./reports.js');
const path 		= require('path');
const util 		= require('util');


exports.taskFileMain = taskFileMain;
function taskFileMain(mode = MODE.taskFile, cfgArray = undefined)
{
	let collection = TC.getInstance();
	// Process args early to find if the yakefile is provided on the command line
	let [options, args] = CLI.CliParse(process.argv);
	
	collection = TASKS.loadPreloadedTasks(collection);
	if( mode === MODE.yakeCmd)
	{
		// tasks are defined using task() methods not cfg.... find jakefile and load tasks
		collection = TC.getInstance();
		let cwd = process.cwd();
		let jakefileCandidates = Yakefile.defaultFilenames();
		let jakeFilePath = Yakefile.recursiveFindFile(cwd, jakefileCandidates);
		if( jakeFilePath === undefined )
		{
			let msg = yakefileCandidates.join();
			console.log(util.inspect(yakefileCandidates));
			throw new Error(`cannot find yakefile among : ${msg}`);
		}
		collection = TASKS.requireTasks(yakeFilePath, collection);
	}
	else if(mode === MODE.yakeTaskfile)
	{

	}
	else if( mode === MODE.yakeFromArray)
	{
		// tasks are defined in a datascripture - load it
		collection = TASKS.loadTasksFromArray(cfgArray, collection);
	}

	let nameOfTaskToRun = 'default';

	if( options.getValueFor('showTasks') !== undefined )
	{
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

/**
 * This is the mainline for two situations:
 * 	-	where a yakefile is executed with a command line
 * 			yake -f yakefile
 * 			yake ... default yakefile
 */
exports.jakeFileMain = jakeFileMain;
function jakeFileMain()
{
	// process command line early to find out if yakefile is provided on command line
	let [options, args] = CLI.CliParse(process.argv);

	// set up default yakefile names and dtask to run
	let yakefileCandidates = Yakefile.defaultFilenames();
	let nameOfTaskToRun = 'default';

	// the task to run is the first argument after command line parsing
	let a = args.getArgs();
	if( a.length > 0 )
	{
		nameOfTaskToRun = a[0];
	}

	// see if yakefile is provided as an options
	let jf = options.getValueFor('file');
	if( jf !== undefined )
	{
		yakefileCandidates = [jf];
	}

	// now try to find the yakefile starting at cwd and working upwards
	let cwd = process.cwd();
	let yakeFilePath = Jakefile.recursiveFindFile(cwd, yakefileCandidates);
	if( yakeFilePath === undefined )
	{
		let msg = jakefileCandidates.join();
		console.log(util.inspect(yakefileCandidates));
		throw new Error(`cannot find yakefile among : ${msg}`);
	}

	// have a yakefile so try and require it AFTER loading pre-loaded tasks
	collection = TASKS.requirePreloadedTasks();
	collection = TASKS.requireTasks(tmp);

	// now that we have tasks see if we were asked to show them
	if( options.getValueFor('showTasks') !== undefined )
	{
		console.log('THIS IS THE TASK REPORT');
		REPORTS.printTaskList(collection);
		process.exit(0);
	}

	// turn the name of the task to run into a task object
	let firstTask = collection.getByName(nameOfTaskToRun);
	if( firstTask === undefined)
	{
		console.log('ERROR')
		throw new Error(`task ${nameOfTaskToRun} not found`);
	}

	// invoke the first task and let the recursive invoker run
	TASKS.invokeTask(collection, firstTask);

}
