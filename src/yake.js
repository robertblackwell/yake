const TASKS 	= require('./yake/tasks.js');
const TC 		= require('./yake/task_collection.js');
const MAIN 		= require('./yake/main.js');
const Logger 	= require('./yake/logger.js');
const SHELL 	= require('./yake/shell.js');
const YERROR    = require('./yake/error.js');
const MODE 		= require('./yake/mode.js');

const raiseError = YERROR.raiseError;

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
    MAIN.Main(undefined, undefined, mode, cfg);
}


Object.assign(exports, Logger, SHELL, YERROR, MODE);

