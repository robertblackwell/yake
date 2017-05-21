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
    
    if( arrayOfTasks !== undefined)
    {
        arrayOfTasks.forEach((task)=>
        {
            this._map.set(task.name(), task);
        })
    }

    function add (task)
    {
        this._map.set(task.name(), task);
    }

    this.addTask = function addTask(task)
	{
        this._map.set(task.name(), task.clone());
        return this;
    };

    this.getByName = function getByName(key)
	{
        return this._map.get(key);
    };

    this.getAll = function getAll()
	{
        return this._map;
    };

    this.getAllNames = function getAllNames()
	{
        return Array.from(this._map.keys());
    };
    
    this.asArray = function asArray()
    {
        return Array.from(this._map.values());
    }
    this.append = function(task)
    {
        const tc = TaskCollection([task]);
        return this.union(tc);
    }
    this.union = function concat(collection)
    {
        const ar1 = this.asArray();
        const ar2 = collection.asArray();
        const ar3 = ar1.concat(ar2);
        const obj = TaskCollection(ar3);
        return obj;
    }
    this.copy = function copy()
    {
        const newCol = TaskCollection(this.asArray());
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
// const theInstance = TaskCollection();

// exports.getInstance = getInstance;
// function getInstance()
// {
//     return theInstance;
// }

