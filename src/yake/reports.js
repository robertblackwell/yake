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
		console.log(`name: ${el} ${t}`);
		// widthDesc = (widthDesc > t.decription().length) ? width : t.description().length;
	})
	names.forEach((el, ix, ar) =>
	{
		const task = collection.getByName(el);
		console.log(`task : ${el}`);
		printTask(task, width);
	})
}

function pad(s, n)
{
	return " ".repeat(n);
}
function makeWidth(s, w)
{
	let s1 = s.trim();
	let s2 = (s1.length > w) ? s1.substring(0, w) : pad(s, w - s1.length);
	return  s2;
}


function printTask(task, widthName, widthDesc)
{
	const name = makeWidth(task.name(), widthName);
	const description = makeWidth(task.description(), widthDesc);
	const prereqs = task.prerequisites().join();
	const line = `${chalk.reset.bold(name)} \t ${chalk.reset.cyan(description)} \t [${prereqs}] }`;
	console.log(line);
}