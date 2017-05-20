const TC = require('./task_collection.js');

exports.printTaskList = printTaskList;
function printTaskList(collection)
{
	const names = collection.getAllNames();
	names.forEach((el, ix, ar) =>
	{
		const task = collection.getByName(el);
		console.log('task : ${el}');
		printTask(task);
	})
}

function printTask(task)
{
	console.log(`printTask : ${task.name()}`);
}