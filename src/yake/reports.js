const TC = require('./task_collection.js');
const chalk = require('chalk');

exports.printTaskList = printTaskList;
function printTaskList(collection)
{
	const names = collection.getAllNames();
	let widthName = 0;
	let widthDesc = 0;

	names.forEach( (el, ix, ar)=>
	{
		widthName = (widthName > el.length) ? widthName : el.length;
		const t = collection.getByName(el);
		// console.log(`name: ${el} ${t}`);
		widthDesc = (widthDesc > t.description().length) ? widthDesc : t.description().length;
	})
	names.forEach((el, ix, ar) =>
	{
		const task = collection.getByName(el);
		printTask(task, widthName, widthDesc);
	})
}

function pad(s, n)
{
	return " ".repeat(n);
}
function makeWidth(s, w)
{
	let s1 = s; //s.trim();
	let s2 = (s1.length > w) ? s1.substring(0, w - 1) : pad(s, w - s1.length);
	return  s2;
}


function printTask(task, widthName, widthDesc)
{
	const _name = makeWidth(task.name(), widthName);
	const _description = makeWidth(task.description(), widthDesc);
	console.log(`_name: [${_name}] l: [${_name.length}] _desc:[${_description}] length: [${_description.length}]`);
	const name = task.name();
	const description = task.description();
	const prereqs = task.prerequisites().join();
	const line = `${chalk.reset.bold(name)} \t ${chalk.reset.cyan(description)} \t [${prereqs}]`;
	console.log(line);
}