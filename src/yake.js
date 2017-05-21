const Tasks 	= require('./yake/tasks.js');
const TC 		= require('./task_collection.js');
const Main 		= require('./yake/main.js');
const Logger 	= require('./yake/logger.js');
const Shell 	= require('./yake/shell.js');
const YakeError = require('./yake/error.js');
const MODE 		= require('./yake/mode.js');
const raiseError = require('./yake/error.js').raiseError;

/**
 * This file exports the functions used in a jakefile to define tasks and add descriptions to those tasks.
 * The jakefile is then executed via the jake command line utility in the usual jake/ruby/make
 * style
 *
 */



/**
 * called within a jakefile - to define a task
 */
exports.task = task;
function task()
{
    const args = Tasks.normalizeArguments.apply(this, arguments);

    if (args === undefined)
        { throw new Error(`_Yake.js::task args undefined arguments: ${arguments}`); }

    const taskCollection = TC.getInstance();

    Tasks.defineTask(taskCollection, args.name, args.description, args.prereqs, args.action);
}
/**
 * called within a yake task's action function to abort task processing
 */
exports.abort = abort;
function abort(message, returnCode = -1)
{
    raiseError(message);
    process.exit(returnCode);
}

/**
 * called at the end of a taskfile style yake build file to kick off the processing
 */
exports.run = run;
function run(mode = MODE.yakeTaskfile, cfg = undefined)
{
    Main.taskFileMain(mode, cfg);
}


Object.assign(exports, Logger, Shell, YakeError, MODE);

