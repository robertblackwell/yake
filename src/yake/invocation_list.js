// const util = require('util');
// const xSet = require('es6-set');

// const Task = require('./tasks.js');

/**
 * InvocationList - is actually a set implementation and is used for two purposes in this app.
 * It is used to track prerequisite ancestors and already invoked tasks
 * both during the process of invoking a task and its prerequisites. In the first case
 * it is used to detect loops in the prerequisite graph and in the second case to ensure
 * that a prerequisiste is only executed one and then at the lowest level in the preprequisite
 * tree.
 *
 * @NOTE: The constructcan be used without the 'new' keyword
 * @NOTE: propserties are implemented as private vars of the constructor.
 * @NOTE: This class DOES provide a modifier method - removeTask.
 *
 */
module.exports.InvocationList = InvocationList;
function InvocationList()
{
    let obj;

    if (!(this instanceof InvocationList))
    {
        obj = new InvocationList();

        return obj;
    }

    this._set = new Set([]);

    this.addTask = function addTask(task)
	{
        this._set.add(task.name());
    };
    this.hasTask = function hasTask(task)
	{
        return this._set.has(task.name());
    };
    this.removeTask = function removeTask(task)
	{
        return this._set.delete(task.name());
    };
}
