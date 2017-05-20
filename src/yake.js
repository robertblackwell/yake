const util 		= require('util');

const Tasks 	= require('./yake/tasks.js');
const Main 		= require('./yake/main.js');
const Logger 	= require('./yake/logger.js');
const Shell 	= require('./yake/shell.js');
const YakeError = require('./yake/error.js');
const MODE 		= require('./yake/mode.js');

/**
 * This file exports the functions used in a jakefile to define tasks and add descriptions to those tasks.
 * The jakefile is then executed via the jake command line utility in the usual jake/ruby/make
 * style
 *
 */
let currentDescription = null;

/**
 * called within a jakefile - to provide a description to a task
 */
exports.desc = desc;
function desc(descString)
{
	// console.log(`_JAKE.desc ${(descString)}`);
 //    currentDescription = descString;
}

/**
 * called within a jakefile - to define a task
 */
exports.task = task
function task() 
{
	const args = Tasks.normalizeArguments.apply(this, arguments);

	if(args === undefined)
		throw new Error(`_jake.js::task args undefined arguments: ${arguments}`);

	Tasks.defineTask(args.name, args.description, args.prereqs, args.action);
}
exports.run = run;
function run(mode = MODE.taskfile, cfg = undefined)
{
	Main.taskFileMain(cfg);
}

exports.abort = abort;
function abort(message, returnCode = -1)
{
	error(message);
	process.exit(returnCode)
}
 Object.assign(exports, Logger, Shell, YakeError, MODE);

