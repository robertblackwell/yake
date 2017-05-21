const CLI 		= require('./cli_args.js');
const Yakefile 	= require('./yakefile.js');
const TASKS 	= require('./tasks.js');
const TC 		= require('./task_collection.js');
const MODE 		= require('./mode.js').MODE;

const REPORTS 	= require('./reports.js');
const ERROR     = require('./error.js')
// const util 		= require('util');

/**
 * These two functions manage the access.update of a global task collection
 * variable
 */
exports.globalTaskCollection = undefined;
exports.getTaskCollection = function()
{
    return taskCollection;
}
exports.setTaskCollectioni = function(tc)
{
    taskCollection = tc;
}

exports.taskFileMain = taskFileMain;
function taskFileMain(mode = MODE.taskFile, cfgArray = undefined)
{
    globalTaskCollection = TC.TaskCollection();
    
    let collection = TC.getInstance();
	// Process args early to find if the yakefile is provided on the command line
    const [options, args] = CLI.CliParse(process.argv);

    collection = TASKS.loadPreloadedTasks(collection);
    if (mode === MODE.yakeCmd)
	{
		// tasks are defined using task() methods not cfg.... find yakefile and load tasks
        collection = TC.getInstance();
        const cwd = process.cwd();
        const yakefileCandidates = Yakefile.defaultFilenames();
        const yakeFilePath = Yakefile.recursiveFindFile(cwd, yakefileCandidates);

        if (yakeFilePath === undefined)
		{
            const msg = yakefileCandidates.join();

            // console.log(util.inspect(yakefileCandidates));
            ERROR.raiseError(`cannot find yakefile among : ${msg}`);
        }
        collection = TASKS.requireTasks(yakeFilePath, collection);
    }
    else if (mode === MODE.yakeTaskfile)
	{
		// tasks will already be loaded
    }
    else if (mode === MODE.yakeFromArray)
	{
		// tasks are defined in a datascripture - load it
        collection = TASKS.loadTasksFromArray(cfgArray, collection);
    }

    let nameOfTaskToRun = 'default';

    if (options.getValueFor('showTasks') !== undefined)
	{
        REPORTS.printTaskList(collection);
        process.exit(0);
    }

    const a = args.getArgs();

    if (a.length > 0)
	{
        nameOfTaskToRun = a[0];
    }

    const firstTask = collection.getByName(nameOfTaskToRun);

    if (firstTask === undefined)
	{
        // console.log('ERROR');
        ERROR.raiseError(`task ${nameOfTaskToRun} not found`);
    }

    TASKS.invokeTask(collection, firstTask);
}

/**
 * This is the mainline for two situations:
 * 	-	where a yakefile is executed with a command line
 * 			yake -f yakefile
 * 			yake ... default yakefile
 */
exports.yakeFileMain = yakeFileMain;
function yakeFileMain()
{
    taskFileMain(MODE.yakeCmd);
}
