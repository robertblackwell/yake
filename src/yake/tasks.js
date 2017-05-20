const util = require('util');

const TaskCollection = require('./task_collection.js');
const InvocationList = require('./invocation_list.js').InvocationList;
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

exports.Task = Task;
function Task(name, description, prerequisites, action)
{
    let obj;

    if (!(this instanceof Task))
    {
        obj = new Task(name, description, prerequisites, action);

        return obj;
    }
    this._name = name;
    this._description = description;
    this._prerequisites = prerequisites.slice();
    this._action = action;

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
exports.invokeTask = invokeTask;
function invokeTask(taskCollection, task)
{
    const loopsList = InvocationList();
    const alreadyDoneList = InvocationList();

    _invokeTask(taskCollection, loopsList, alreadyDoneList, task);
}

/**
 * invokeTask - invokes all the prerequisites for a task and then invokes the target
 *              task by calling its action property
 *
 * @param {TaskCollection}  taskCollection, collection of defined tasks
 * @param {InvocationList}  loopsList, a structure for keeping track of
 *                          ancestors in the Depth First scan of tasks
 *                          so that loops in the dependency graph can be detected
 * @param {InvocationList}  prereqsList - a structure fro keeping track of
 *                          prereqs already executed so that we done run a prereq twice.
 *
 * @param {Task}            task - the task to invoke
 *
 */
exports._invokeTask = _invokeTask;
function _invokeTask(taskCollection, loopsList, alreadyDoneList, task)
{
    const debug = false;

    if (debug) debugLog(`invokeTask: ${util.inspect(task)}`);
    if (debug) debugLog(`invokeTask: name: ${task.name()}`);

    const prereqs = task.prerequisites();

    if (loopsList.hasTask(task))
    {
        throw new Error(`circular dependency - task:${task.name()} has already been seen`);
    }
    else
    {
        loopsList.addTask(task);
        if (prereqs.length > 0)
        {
            if (debug) debugLog(`invokeTasks prereqs 1 length:${prereqs.length}`);
            prereqs.forEach((el) =>
            {
                if (debug) debugLog(`invokeTasks prereqs ${el}`);
                const t = taskCollection.getByName(el);

                if (t === undefined)
                {
                    throw new Error(`unknown task ${el} is prerequisite of ${task.name()}`);
                }
                else
                {
                    if (debug) debugLog(`invokeTask: prereqs ${t.name()}`);
                    _invokeTask(taskCollection, loopsList, alreadyDoneList, t);
                }
            });
        }
        if (!alreadyDoneList.hasTask(task))
        {
            (task.action())();
            alreadyDoneList.addTask(task);
        }
        loopsList.removeTask(task);
    }
}

exports.normalizeArguments = normalizeArguments;
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

// exports.TaskCollection = TaskCollection;
// function TaskCollection()
// {

// }

/**
 * loadTaskFromArray - loads a set of tasks from a cfg structure
 * @param {array of task definitions}   - ar task definition structure
 * @parame {TaskCollection}             - taskCollection - collection into which tasks will be placed
 * @return {TaskCollection}             - the updated singelton TaskCollection
 *
 * @global - updates singelton TaskCollection
 *
 */
exports.loadTasksFromArray = loadTasksFromArray;
function loadTasksFromArray(ar, taskCollection)
{
    ar.forEach((el) =>
    {
        const task = new Task(el.name, el.description, el.prerequisites, el.action);

        taskCollection.addTask(task);
    });

    return taskCollection;
}

exports.loadPreloadedTasks = loadPreloadedTasks;
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
 * Loads tasks from a yakefile into taskCollection and returns the updated taskCollection
 * @param {string}              yakefile - full path to yakefile - assume it exists
 * @parame {TaskCollection}     taskCollection - collection into which tasks will be placed
 * @return {TaskCollection}     update taskCollection
 */
exports.requireTasks = requireTasks;
function requireTasks(yakefile, taskCollection)
{
    const debug = false;
    // let taskCollection = TaskCollection.getInstance();

    if (debug) debugLog(`loadTasks: called ${yakefile}`);
    /* eslint-disable global-require */
    require(yakefile);
    /* eslint-disable global-require */

    return taskCollection; // no copy - untidy functional programming
}

exports.defineTask = defineTask;
function defineTask(name, description, prereqs, action)
{
    const debug = false;

    if (debug) debugLog(`defineTask: ${name} ${description} ${util.inspect(prereqs)} ${util.inspect(action)}`);
    const task = Task(name, description, prereqs, action);
    const taskCollection = TaskCollection.getInstance();

    taskCollection.addTask(task);
    if (debug) debugLog(`defineTask: task: ${util.inspect(task)}`);
    // add task to task collection
}
