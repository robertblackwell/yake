const TASKS 	= require('./yake/tasks.js');
const TC 		= require('./yake/task_collection.js');
const MAIN 		= require('./yake/main.js');
const Logger 	= require('./yake/logger.js');
const SHELL 	= require('./yake/shell.js');
const YERROR    = require('./yake/error.js');

const raiseError = YERROR.raiseError;
const chokidar = require('chokidar');

/**
 * This file exports the functions used in a jakefile to define tasks and add descriptions to those tasks.
 * The jakefile is then executed via the jake command line utility in the usual jake/ruby/make
 * style
 *
 */

exports.task = task;
exports.abort = abort;
exports.run = run;
exports.invokeTask = invokeTask;
exports.watch = watch;

// now add a bunch of other convenient stuff into the YAKE namespace
Object.assign(exports, Logger.logger, SHELL, YERROR);

function task()
{
    const args = TASKS.normalizeArguments.apply(this, arguments);

    if (args === undefined)
        { raiseError(`_Yake.js::task args undefined arguments: ${arguments}`); }

    /**
     * @NOTE - using a global - see notes in tasks.js for explanation
     *
     */
    const tc = TASKS.globals.globalTaskCollection;
    
    const tc2 = TASKS.defineTask(tc, args.name, args.description, args.prereqs, args.action);
    /**
     * @NOTE - using a global - see notes in tasks.js for explanation
     *
     */    
     TASKS.globals.globalTaskCollection = tc2;

}

/**
 * Watch files and then invoke a task
 */
 function watch(glob, taskName)
 {
    var watcher = chokidar.watch
    (
        glob,
        {persistent: true,} 
    );
    watcher.on('all', (event, path)=>
    {
        invokeTask(taskName);
    });
 }

/**
 * Invoke a task by name
 */
function invokeTask(taskName)
{
    const tc = TASKS.globals.globalTaskCollection;
    const t = tc.getByName(taskName);
    if (t === undefined)
    {
        YERROR.raiseError(`task ${taskName} not found`);
    }

    TASKS.invokeTask(tc, t);    
}

/**
 * called within a yake task's action function to abort task processing
 */
function abort(message, returnCode = -1)
{
    raiseError(message);
    process.exit(returnCode);
}

/**
 * called at the end of a taskfile style yake build file to kick off the processing
 */
function runTaskfile()
{
    MAIN.taskFileMain(undefined, undefined);
}
// just for an easier name
function run()
{
    runTaskfile();
}
