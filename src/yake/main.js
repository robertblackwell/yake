const CLI 		= require('./cli_args.js');
const Yakefile 	= require('./yakefile.js');
const TASKS 	= require('./tasks.js');
const TC 		= require('./task_collection.js');
const MODE 		= require('./mode.js').MODE;

const REPORTS 	= require('./reports.js');
const ERROR     = require('./error.js')
const process   = require('process');
// const util 		= require('util');
const fs        = require('fs');
const path      = require('path');
exports.yakeFileMain = yakeFileMain;
exports.taskFileMain = taskFileMain;


/**
 * Collects tasks from the appropriate yakefile.
 *
 * @param      {string}  cwd         The directory from which to start searching for a yakefile
 * @param      {string|undefined}    fileOption  The value of the -c or --file option from the command line
 * @return     {TaskCollection}      The tasks from yakefile.
 */
function getTasksFromYakefile(cwd, fileOption)
{
    // find the yakefile and load (actually a dynamic 'require') tasks
    // first create an empty collection - dont need to use the global collection
    const tc1 = TC.TaskCollection();
    //preload 
    const tc2 = TASKS.loadPreloadedTasks(tc1);

    const yakefileCandidates = Yakefile.defaultFilenames();
    if( fileOption !== undefined )
        yakefileCandidates = [fileOption];

    const yakeFilePath = Yakefile.recursiveFindFile(cwd, yakefileCandidates);

    if (yakeFilePath === undefined)
    {
        const msg = yakefileCandidates.join();

        // console.log(util.inspect(yakefileCandidates));
        ERROR.raiseError(`cannot find yakefile among : ${msg}`);
    }
    const collection = TASKS.requireTasks(yakeFilePath, tc2);
    return collection;
}

/**
 * In taskfile mode the tasks are defined before the mainline gets called through the
 * use of the YAKE.task function. Hence by the time this function gets called
 * those tasks are already in a global collection. So retreived them, add default tasks
 * return the collection
 *
 * @return     {TaskCollection}  The tasks from taskfile.
 */
function getTasksFromTaskfile()
{
    // tasks will already be loaded and are in the global collection so get it
    const tc = TASKS.globals.globalTaskCollection; 
    //this time the preloads come after the custom tasks - no choice
    const collection = TASKS.loadPreloadedTasks(tc);
    return collection;
}

/**
 * IN cfg array use a data structure will have the task definitions. This will be passed
 * to this function
 *
 * @param      {array}              cfgArray  The configuration array
 * @return     {TaskCollection}     The tasks from array.
 */
function getTasksFromArray(cfgArray)
{
    const tc = TC.TaskCollection();
    // tasks are defined in a datascripture - load it
    const tc2 = TASKS.loadTasksFromArray(cfgArray, tc);
    //this time the preloads come after the custom tasks - could have done it the other way round
    const collection = TASKS.loadPreloadedTasks(tc2);
    return collection;
}

/**
 * Tests command line options for 'showTasks' value. If true reports all
 * tasks and descriptions and returns true to indicate it did something
 *
 * @param      {CliOptions}  options  The options
 * @param      {TaskCollection}  collection  The tasks to displays
 */
function tryShowTasks(options, collection)
{
    if (options.getValueFor('showTasks') !== undefined)
    {
        REPORTS.printTaskList(collection);
        return true;
    }
    return false;
}

function tryShowHelp(options, helpText)
{
    if( options.getValueFor('help') !== undefined )
    {
        /* eslint-disable no-console */

        console.log(`${'usage: yake|./taskfile [OPTIONS] task\n'
                    + 'options:\n'}${
                     helpText}`);
        /* eslint-enable no-console */
        return true;
    }
    return false;
}

function tryShowVersion(options, version)
{
    if( options.getValueFor('version') !== undefined )
    {
        /* eslint-disable no-console */
        console.log(`V${version}\n`);
        /* eslint-enable no-console */
        return true;
    }
    return false;
}

/**
 * Looks in the CliArguments parameter and if any strings are found tries to execute those
 * as task names and of course the prerequisites
 *
 * @param      {CliArguments}               args -   The arguments
 * @param      {TaskCollection}             collection - The collection of tasks from which original taska and
 *                                          prerequisistes will come
 */
function tryRunTask(args, collection)
{
    let nameOfTaskToRun = 'default';
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
function loadPackageJson()
{
    const p = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json')));
    return p;
}

/**
 * The mainline of a taskfile. Only depends on the options and arguments on the command line
 *
 * @param      {Function}  argv    The argv
 */
function taskFileMain(argv)
{
    if( argv === undefined ) argv = process.argv

    const [options, args, helpText] = CLI.taskFileParse(argv);
    const collection = getTasksFromTaskfile();

    const p = loadPackageJson();
    if( tryShowVersion(options, p.version) )
        return;
    if( tryShowTasks(options, collection) )
        return;
    if( tryShowHelp(options, helpText) )
        return;

    tryRunTask(args, collection);
}

/**
 * The mainline for use in the yake command. Depends on the options and arguments on the command line
 * plus the directory from which to start the search for a yakefile
 *
 * @param      {Function}  argv    The argv
 */
function yakeFileMain(argv, cwd)
{    
    if( cwd === undefined) cwd = process.cwd();
    if( argv === undefined ) argv = process.argv


    const [options, args, helpText] = CLI.CliParse(argv);
    const collection = getTasksFromYakefile(cwd, options.getValueFor('file'));
    const p = loadPackageJson();
    if( tryShowVersion(options, p.version) )
        return;
    if( tryShowTasks(options, collection) )
        return;
    if( tryShowHelp(options, helpText) )
        return;

    tryRunTask(args, collection);
}

