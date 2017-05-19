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

var process = require('process');
const dashdash = require('dashdash');
const util = require('util');
const DParser = function()
{
    const options = [
        {
            names: ['showTasks', 'T'],
            type: 'string',
            help: 'Print a list f tasks.'
        },
        {
            names: ['version','v'],
            type: 'bool',
            help: 'Print tool version and exit.'
        },
        {
            names: ['help', 'h'],
            type: 'bool',
            help: 'Print this help and exit.'
        },
        {
            names: ['silent', 's'],
            type: 'bool',
            help: 'Silent output. '
        },
        {
            names: ['file', 'f'],
            type: 'string',
            help: 'File containing task definitions',
            helpArg: 'FILE'
        },
        {
            names: ['jakefile', 'c'],
            type: 'string',
            help: 'File containing task definitions',
            helpArg: 'FILE'
        }    
    ];

    var parser = dashdash.createParser({options: options});
    this.parse = function(argv)
    {
        try 
        {
            var opts = parser.parse(process.argv);
            this.options = opts;
            if (opts.help) 
            {
                var help = parser.help({includeEnv: true}).trimRight();
                console.log('usage: jake [OPTIONS]\n'
                            + 'options:\n'
                            + help);
                process.exit(0);
            }
            // console.log(`DParser: ${util.inspect(this.options)}`);
            var res = {};
            Object.assign(res, this.options, {args: this.options._args});
            // console.log(`DParser: ${util.inspect(res)}`);
            return res;
        } 
        catch (e) 
        {
            console.error('foo: error: %s', e.message);
            process.exit(1);
        }
    }.bind(this);
    
    this.getOptions = function()
    {
        return this.options;
    }.bind(this);

    this.getArgs = function()
    {
        return this.options_args;
    }.bind(this);
}


module.exports = {
    Parser : DParser,
}