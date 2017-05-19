// var parser = new (require("narwhal/args").Parser)();

// parser.usage("targets...");

// parser.option("--jakefile", "-f", "file")
//     .set()
//     .help("Use FILE as the jakefile.");

// parser.option("--tasks", "-T", "showTasks")
//     .set("tasks")
//     .help("Display the tasks "/*(matching optional PATTERN) */+"with descriptions, then exit.");

// parser.option("--describe", "-D", "showTasks")
//     .set("describe")
//     .help("Describe the tasks "/*(matching optional PATTERN), */+"then exit.");

// parser.option("--prereqs", "-P", "showPrereqs")
//     .set(true)
//     .help("Display the tasks and dependencies, then exit.");

// parser.option("--verbose", "-v", "verbose")
//     .set(true)
//     .help("Log message to standard output.");

// parser.helpful();

var Getopt = require('node-getopt');
var process = require('process');
var parser = Getopt.create([
  ["f", "file=ARG", "config file"],
  ['S' , 'short-with-arg=ARG'  , 'option with argument'],
  ["T", 'showTasks', 'list tasks'],
  ['v', 'verbose', 'be verbose'],
  ['h', 'help', 'display help']
]).bindHelp();

function Option(short, long, desc)
{
    this._set;
    this._help;
    this._short = short;
    this._long = long;
    this._desc = desc;
    this.set = function(name = "")
    {
        this._name = name;
        return this;
    }
    this.help = function(help)
    {
        this._help = help;
        return this;
    }
}

function Parser()
{   
    this.opts = [];
    var gopt = Getopt.create([
        ["f", "file=ARG", "config file"],
        ['S' , 'short-with-arg=ARG'  , 'option with argument'],
        ["T", 'showTasks', 'list tasks'],
        ['v', 'verbose', 'be verbose'],
        ['h', 'help', 'display help']
    ]).bindHelp();

    // note the nature of the return type - a bit wierd
    this.parse = function(args)
    {
        var parsedOptions = gopt.parse(args);
        var options = parsedOptions.options
        options['args'] = parsedOptions.argv.slice(2)
        return options

    }
}
module.exports = {
    Parser : Parser,
}