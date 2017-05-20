const TC = require('./task_collection.js');
const chalk = require('chalk');

exports.printTaskList = printTaskList;
function printTaskList(collection)
{
	const names = collection.getAllNames();
	names.forEach((el, ix, ar) =>
	{
		const task = collection.getByName(el);
		console.log(`task : ${el}`);
		printTask(task);
	})
}

function printTask(task)
{
	const name = task.name();
	const description = task.description();
	const prereqs = task.prerequisites().join();
	const line = `${chalk.reset.bold(name)} \t ${chalk.reset.cyan(description)} \t [${prereqs}] }`;
	console.log(line);
}