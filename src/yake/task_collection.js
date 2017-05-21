const util = require('util');
const TASK = require('./tasks.js');
/**
 * TaskCollection - an instance of this structure holds tasks that have already been defined
 * and from which some can be invoked.
 *
 * The constructor TaskCollection can be called without the use of the keyword "new".
 *
 * The properties of the class were originally hidden as local vars inside the constructor
 * and no setter methods are provided to enforce immutability - but that makes them invisible
 * to the debugger.
 *
 * @class      TaskCollection
 * @param   {array of Tasks}        Can initialize a TaskCollection from an array of tasks
 */
 exports.TaskCollection = TaskCollection;
function TaskCollection(arrayOfTasks = undefined)
{
    let obj;

    if (!(this instanceof TaskCollection))
    {
        obj = new TaskCollection(arrayOfTasks);

        return obj;
    }
    this._map = new Map();
    this._tasks = [];
    this._taskNames = [];
    this._tasksByName = {};
    
    if( arrayOfTasks !== undefined)
    {
        arrayOfTasks.forEach((task)=>
        {
            // only add if name not already there
            // if(this._taskNames.find(task.name()) === undefined )
            if( this._tasksByName.hasOwnProperty(task.name()) === false )
            {
                const t = TASK.Task.copy(task);
                add.bind(this)(t);
            }
        })
    }

    function add (task)
    {
        this._map.set(task.name(), task);

        this._tasks.push(task);
        this._taskNames.push(task.name());
        this._tasksByName[task.name()] = task;
        this._map.set(task.name(), task);
    }

    this.addTask = function addTask(task)
	{
        this._map.set(task.name(), task.clone());

        this._tasks.push(task.clone());
        this._taskNames.push(task.name());
        this._tasksByName[task.name()] = task;
        return 
    };

    this.getByName = function getByName(key)
	{
        // if (this._tasksByName.hasOwnProperty(key))
        return this._map.get(key);

        if (this._map.has(key))
		{
            return this._map.get(key);
        }

        return undefined;
    };

    this.getAll = function getAll()
	{
        return this._tasksByName;
    };

    this.getAllNames = function getAllNames()
	{
        // return this._map.keys();
        return Array.from(this._map.keys());
        // return this._taskNames.slice();
    };
    
    this.asArray = function asArray()
    {
        return Array.from(this._map.values());
        // return this._tasks.slice();
    }
    
    this.union = function concat(collection)
    {
        const ar1 = this._tasks;
        const ar2 = collection.asArray();
        const ar3 = ar1.concat(ar2);
        const obj = TaskCollection(ar3);
        return obj;
    }
    this.copy = function copy(taskCollection)
    {
        const newCol = TaskCollection(this._tasks);
        return newCol;
    }

    this.display = function display()
	{
		/* eslint-disable no-console */
        console.log(`TaskCollection names: ${util.inspect(this._taskNames)} length: ${this._tasks.length}`);

        for (let i = 0; i < this.tasks.length; i++)
		{
            const el = this.tasks[i];

            console.log(`tasks[${i}]: ${util.inspect(el)}`);
            const t = this._tasksByName[el.name()];

            console.log(`\tTask name:${el.name()} desc:${el.description()} prereqs: ${util.inspect(el.prerequisites())}`);
            console.log(`\t     name:${t.name()} desc:${t.description()} prereqs: ${util.inspect(t.prerequisites())}`);
        }
        console.log(`TaskCollection names: ${util.inspect(this.taskNames)} length: ${this.tasks.length}`);
		/* eslint-enable no-console */
    };
}



/**
 * @NOTE - TaskCollection is a singleton. In the jake/Ruby style of task definition an instance of
 * TaskCollection needs to exist during the process of defining tasks and there is nowhere
 * other than a global to hold the collection as it is being built. This is a result of the
 * tasks being defined by 'require'-ing a javascript file.
 *
 */
const theInstance = TaskCollection();

exports.getInstance = getInstance;
function getInstance()
{
    return theInstance;
}

