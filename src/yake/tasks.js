const util      = require('util');
const chokidar  = require('chokidar');
const chalk     = require('chalk');
const TC                = require('./task_collection.js');
const ERROR             = require('./error.js');

/**
 * This file contains functions and object related to the loading of the jakefile
 */
const debug = false;

function debugLog(s)
{
    /* eslint-disable no-console */
    console.log(s);
    /* eslint-enable no-console */
}

/**
 * globals.globalTaskCollection - used for communicating
 * intermediate values of a taskCollection
 * between requireTask in this file and  defineTask as called from
 * the task function in ./lib/yake.js 
 *
 * @type       {<type>}
 */
let globals = {
    globalTaskCollection : undefined,
}

exports.globals = globals;

exports.Task = Task;
exports.invokeTask = invokeTask;
exports._invokeTask = _invokeTask;
exports.normalizeArguments = normalizeArguments;
exports.loadPreloadedTasks = loadPreloadedTasks;
exports.loadTasksFromArray = loadTasksFromArray;
exports.requireTasks = requireTasks;
exports.defineTask = defineTask;

function Task(name, description, prerequisites, action)
{
    let obj;

    if (!(this instanceof Task))
    {
        obj = new Task(name, description, prerequisites, action);

        return obj;
    }
    if( name instanceof Task)
    {
        const tsk = name();
        this._name = tsk.name();
        this._description = tsk.description();
        this._prerequisites = tsk.prerequisites.slice();
        this._action = tsk.action();        
    }
    else
    {
        this._name = name;
        this._description = description;
        this._prerequisites = prerequisites.slice();
        this._action = action;
    }


    this.name = function name()
    {
        return this._name;
    };
    this.description = function description()
    {
        return this._description;
    };
    this.prerequisites = function prerequisites()
    {
        return this._prerequisites.slice();
    };
    this.action = function action()
    {
        return this._action;
    };
    this.clone = function clone()
    {
        let cpy = {};
        Object.assign(cpy, this);
        return cpy;
    }

    this.toString = function toString()
    {
        return `name:${this._name} `
        + ` description:${this._description} `
        + ` prerequisites:${util.inspect(this._prerequisites)} `
        + ` action:${this._action}`;
    };
    this.display = function display()
    {
        /* eslint-disable no-console */
        console.log(`Task: ${this.toString()}`);
        /* eslint-enable no-console */
    };
}
Task.copy = function TaskCopy(task)
{
    return Task(task.name(), task.description(), task.prerequisites(), task.action());
}

function invokeTask(taskCollection, task)
{
    let loopsSet = new Set();
    let alreadyDoneSet = new Set();

    _invokeTask(taskCollection, loopsSet, alreadyDoneSet, task);
}

/**
 * invokeTask - invokes all the prerequisites for a task and then invokes the target
 *              task by calling its action property. This produces a recursive
 *              Depth-First-Scan of the dependency tree/graph (its a directed graph)
 *
 * @param {TaskCollection}  taskCollection, collection of defined tasks
 * @param {Set}             loopsSet, a set structure for keeping track of
 *                          ancestors in the Depth First scan of tasks
 *                          so that loops in the dependency graph can be detected.
 *                          If a task is visited and found to be already in
 *                          this set then a loop has been detected and
 *                          the process fails with an error message
 * @param {Set}             alreadyDoneSet - a structure for keeping track of
 *                          prereqs already executed so that we done run a prereq twice.
 *                          The way this works a dependency that is in the dependency tree
 *                          more than once will be invoked at its deepest level
 *                          and not executed again.
 *
 * @param {Task}            task - the task to invoke
 *
 */
function _invokeTask(taskCollection, loopsSet, alreadyDoneSet, task)
{
    const debug = false;

    if (debug) debugLog(`invokeTask: ${util.inspect(task)}`);
    if (debug) debugLog(`invokeTask: name: ${task.name()}`);

    const prereqs = task.prerequisites();

    if (loopsSet.has(task.name()))
    {
        // do not use raiseError - this will stuff up mocha testing of this feature
        throw new Error(`circular dependency - task:${task.name()} has already been seen`);
    }
    else
    {
        loopsSet.add(task.name());
        if (prereqs.length > 0)
        {
            if (debug) debugLog(`invokeTasks prereqs 1 length:${prereqs.length}`);
            prereqs.forEach((el) =>
            {
                if (debug) debugLog(`invokeTasks prereqs ${el}`);
                const t = taskCollection.getByName(el);

                if (t === undefined)
                {
                    ERROR.raiseError(`unknown task ${el} is prerequisite of ${task.name()}`);
                }
                else
                {
                    if (debug) debugLog(`invokeTask: prereqs ${t.name()}`);
                    _invokeTask(taskCollection, loopsSet, alreadyDoneSet, t);
                }
            });
        }
        if (!alreadyDoneSet.has(task.name()))
        {
            let result;
            try
            {
                /**
                 * task actions indicate failure by either 
                 *  -    return a non-zero
                 *  -   throw an error
                 *  consequently success is indicated by
                 *      -   a return of zero
                 *      -   a return if undefined -- dont want to force action functions to return a value 
                 */
                result = (task.action())();
                if( result === 0 || result === undefined)
                {
                    console.log(chalk.white.bold(`${task.name()} - complete [`)+chalk.bold.green(`OK`)+chalk.white.bold(`]`));
                }
                else
                {
                    console.log(chalk.white.bold(`${task.name()} - `) + chalk.bold.red(`failed[${result}]`));  
                    process.exit(1);                  
                }
                alreadyDoneSet.add(task.name());
            }
            catch(e)
            {
                console.log(chalk.white.bold(`${task.name()} - `) + chalk.bold.red(`failed`));                    
                console.log(chalk.reset(e.stack));
                process.exit(1); // sledge hammer
                throw e;    
            }
        }
        loopsSet.delete(task.name());
    }
}

/**
 * Normalize the arguments passed into the task definition function.
 * Inside a yakefile tasks are defined with a call like ...
 *
 * jake.task('name', 'description', ['prerequisite1', ...], function action(){})
 *
 * The name and action are manditory while the other two - description and [prerequisistes]
 * are optional.
 *
 * This function goes through the process of determining which form was given and returns
 * an object literal with all 4 values provided.
 *
 * @param {string}              name            Manditory
 * @param {string}              description     Optional
 * @param {array of strings}    prerequisistes  Optional
 * @param {function}            action          Manditory
 *
 * @return {object}             with keys name, description, prerequisites, action
 *
 */
function normalizeArguments()
{
    const a = arguments;

    if (debug) debugLog(`normalizeArguments: arguments:${util.inspect(arguments)}`);
    if (debug) debugLog(`normalizeArguments: a0: ${a[0]} a1:${a[1]} a2:${a[2]} a3:${a[3]}`);
    if (debug) debugLog(`normalizeArguments: a0: ${typeof a[0]} a1:${typeof a[1]} a2:${typeof a[2]} a3:${typeof a[3]}`);
    if (debug)
    {
        debugLog(`normalizeArguments:`
        + ` a0: ${typeof a[0]} a1:${typeof a[1]} a2:${Array.isArray(a[2])} a3:${typeof a[3]}`);
    }

    let args = {
        name : '',
        description : '',
        prereqs : [],
        /* eslint-disable no-empty-function */
        action : function action() {},
        /* eslint-enable no-empty-function */

    };

    if ((a.length === 4)
        && (typeof a[3] === 'function')
        && (Array.isArray(a[2]))
        && (typeof a[1] === 'string')
        && (typeof a[0] === 'string'))
    {
        // all 4 arguments provided and of the correct type
        args.name = a[0];
        args.description = a[1];
        args.prereqs = a[2];
        args.action = a[3];
    }
    else if ((a.length === 3)
        && (typeof a[2] === 'function')
        && (Array.isArray(a[1]))
        && (typeof a[0] === 'string'))
    {
        // only 3 arguments types string, array, function
        args.name = a[0];
        args.prereqs = a[1];
        args.action = a[2];
    }
    else if ((a.length === 3)
        && (typeof a[2] === 'function')
        && (typeof a[1] === 'string')
        && (typeof a[0] === 'string'))
    {
        // only 3 arguments types string string, function
        args.name = a[0];
        args.description = a[1];
        args.action = a[2];
    }
    else if ((a.length === 2)
        && (typeof a[1] === 'function')
        && (typeof a[0] === 'string'))
    {
        // only 2 arguments - they must be -  types string, function
        args.name = a[0];
        args.action = a[1];
    }
    else
    {
        args = undefined;
    }

    return args;
}

/**
 * loadTaskFromArray - loads a set of tasks from a cfg structure
 * @param {array of task definitions}   - ar task definition structure
 * @parame {TaskCollection}             - taskCollection - collection into which tasks will be placed
 * @return {TaskCollection}             - the updated singelton TaskCollection
 *
 * @global - updates singelton TaskCollection
 *
 */
function loadTasksFromArray(ar, taskCollection)
{
    let tc = taskCollection.copy();
    ar.forEach((el) =>
    {
        const newTaskCollection = defineTask(tc, el.name, el.description, el.prerequisites, el.action);
        tc = newTaskCollection;
    });

    return tc;
}

/**
 * Yake provides for a set of standard tasks to be preloaded. This function performs that process.
 *
 * @param {TaskCollection}      taskCollection into which the tasks are to be loaded
 *
 *  @return {TaskCollection}    the same one that was passed in but updated
 */
function loadPreloadedTasks(taskCollection)
{
    const preTasks = [
        {
            name : 'help',
            description : 'list all tasks',
            prerequisites : [],
            action : function actionHelp()
            {
                /* eslint-disable no-console */
                console.log('this is the help task running ');
                /* eslint-enable no-console */
            },
        },
    ];
    const collection = loadTasksFromArray(preTasks, taskCollection);

    return collection;
}

/**
 * Loads tasks from a yakefile into taskCollection and returns the updated taskCollection.
 * It does this by a dynamic 'require'
 *
 * @param {string}              yakefile - full path to yakefile - assume it exists
 * @parame {TaskCollection}     taskCollection - collection into which tasks will be placed
 *
 * @return {TaskCollection}     update taskCollection
 */
function requireTasks(yakefile, taskCollection)
{
    const debug = false;
    globals.globalTaskCollection = taskCollection;

    if (debug) debugLog(`loadTasks: called ${yakefile}`);

    /* eslint-disable global-require */
    require(yakefile);
    /* eslint-disable global-require */
    
    const newTaskCollection = globals.globalTaskCollection;

    return newTaskCollection; // no copy - untidy functional programming
}

/**
 * Define a task. Create a new Task instance from the 4 data elements
 * and add it to the singleton TaskCollection::getInstance().
 * and create a new collection consisting of the old collection and the
 * new task
 *
 * NOT PURE
 *
 * @param {TaskCollection}  taskCollection  
 * @param {string}          name     -       Task name
 * @param {string}          description      Task description
 * @param {array of string} prerequisites    array of prerequisite task names
 * @param {function}        action           function to perform the tasks work
 * 
 * @return a collection with the additional task
 * 
 */
function defineTask(taskCollection, name, description, prereqs, action)
{
    const immutable = true;
    const debug = false;

    if (debug) debugLog(`defineTask: ${name} ${description} ${util.inspect(prereqs)} ${util.inspect(action)}`);
    const task = Task(name, description, prereqs, action);
    if(! immutable)
    {
        const taskCollection = TaskCollection.getInstance();
        taskCollection.addTask(task);
    }
    else
    {
        if( taskCollection === undefined )
            taskCollection = TC.TaskCollection([]);

        const newTaskCollection = taskCollection.append(task);
        if (debug) debugLog(`defineTask: task: ${util.inspect(task)}`);
        // add task to task collection
        return newTaskCollection;
    }
}
