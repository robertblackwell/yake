const process = require('process');
const dashdash = require('dashdash');
const util = require('util');

const raiseError = require('./error.js').raiseError;

function debugLog(s)
{
    /* eslint-disable no-console */
    console.log(s);
    /* eslint-ensable no-console */
}

/**
 * Quick reference for this file
 * ===============================
 *
 * const CLI = require('cli_args.js')
 *
 *
 * CLI.CliParse(argv)
 *      returns [instance of CliOptions, instance of CliArguments]
 *
 *      Parses the argv array as if it was a set of command line options and arguments
 *      and returns those options and arguments in special purpose wrapper objects.
 *
 * CLI.CliStripNodeJake(argv)
 *      returns  array - another array of command line options and arguments but stripped
 *      of leading entries that look like
 *          node yake ....
 *          or
 *          yake ....
 *          or
 *          ./<somefile>.js
 *
 *  CLI.CliOptions
 *  ==============
 *  is a class and class factory function but you should never have to call it.
 *  Instances of this class are returned by Cli.Parse
 *
 *  cliOptionsInstance.getValueFor(key)
 *      returns boolean | string | undefined - the value that key has in the options set
 *
 *  cliOptionsInstance.getOptions()
 *      returns a key/value object containing all possible keys and their value or undefined
 *
 *
 *  CLI.CliArguments
 *  ================
 *  is a class and class factory function but you should never have to call it.
 *  Instances of this class are returned by Cli.Parse
 *
 *  cliArgumentsInstance.getArgs()
 *      returns and array of string values representing the arguments that followed the options
 *      on the command line.
 */

/**
 * @annotation - this is deliberatly an immutable implementation to try out functional
 * programming techniques
 *
 * CliOptions constructor. Returns an object that wraps command line option values and
 * provides two getters to acces those key/values
 *
 * @class      CliOptions               is a class that can be instantiated with or without the use of the
 *                                      new keyword. It is a immutable container for the cli options
 *                                      after parsing.
 * @param      {object of key: values}  options  The object of key/values that was parsed from the command line
 * @return     {CliOption}              new CliOptions object
 */
module.exports.CliOptions = CliOptions;
function CliOptions(options)
{
    const _options = {};
    let obj;

    if (!(this instanceof CliOptions))
    {
        obj = new CliOptions(options);

        return obj;
    }
    Object.assign(_options, options);

    /**
     * Gets (a copy of) the options object with only properties that have a value.
     *
     * @return     {object}  The options.
     */
    this.getOptions = () =>
    {
        const tmp = {};

        Object.keys(_options).forEach((key) =>
        {
            if (_options[key] !== undefined)
            {
                tmp[key] = _options[key];
            }
        });
        // Object.assign(tmp, _options);

        return tmp;
    };
    /**
     * Gets the value for an option key.
     *
     * @param      {string}  key     The key
     * @return     {bool|string|undefined}  The value for.
     * @throws      if the value is not bool or string
     */
    this.getValueFor = (key) =>
    {
        if (_options.hasOwnProperty(key))
        {
            const v = _options[key];

            const typeofv = typeof v;

            if ((typeofv) === 'boolean')
            {
                return v;
            }
            else if ((typeofv) === 'string')
            {
                return `${v}`;
            }

            return v;
        }

        return undefined; // undefined
    };
}
/**
 * @annotation - this is deliberatly an immutable implementation to try out functional
 * programming techniques
 *
 * CliArguments constructor. Wraps the arguments from a cli options arg array and wraps the
 * arguments. Provide a single getter to access the array
 *
 * @class      CliArguments         - is a class that can be instantiated with or withou the use of the
 *                                  new keyword. It is a immutable container for the cli arguments
 *                                  after parsing.
 * @param      {array of strings}   argsArray  The arguments array
 * @return     {CliArguments}       new CliArguments object
 */
module.exports.CliArguments = CliArguments;
function CliArguments(argsArray)
{
    let obj;

    if (!(this instanceof CliArguments))
    {
        obj = new CliArguments(argsArray);

        return obj;
    }
    const _args = argsArray.slice();
    /**
     * Gets the arguments.
     *
     * @return     {array of strings}  A copy of the _args property.
     */

    this.getArgs = () =>
    {
        return _args.slice();
    };
}
/**
 * Function Cli.StripNodeJake possibly removes entries from the start of an array
 * if the look like an invocation of the form
 *  -   1.  node jake ....., or
 *  -   2.  jake ......
 */
module.exports.CliStripNodejake = CliStripNodeJake;
function CliStripNodeJake(argv)
{
    const nodeRegex = /^(.*)\/node$/;
    const yakeRegex = /(.*)yake(.*)$/;
    const taskFileRegex = /\.\/(.*)\.js(\s*)$/;
    // let argsNoNode;
    let argNoNodeNoYake;
    /**
     * Strip ['....node', '....yake'] or ['....yake'] or [./<....>.js] from the start of the argv array
     */

    if (argv[0].match(nodeRegex))
    {
        argNoNodeNoYake = argv.slice(1);
        if (argv[1].match(nodeRegex))
        {
            argNoNodeNoYake = argv.slice(2);
        }
    }
    else if (argv[0].match(yakeRegex))
    {
        argNoNodeNoYake = argv.slice(1);
    }
    else if (argv[0].match(taskFileRegex))
    {
        argNoNodeNoYake = argv.slice(1);
    }
    else
    {
        argNoNodeNoYake = argv.slice();
    }

    return argNoNodeNoYake;
}

/**
 * CliParse is a function that parses an array of command line options and arguments against the configuration
 * used by the jake build utility. The config is built into the function.
 *
 * @param       {array}                             argv - an array of command line options and arguments
 *                                                  as returned by process.argv
 * @return     {tuple(CliOptions, CliAruments)}     returns 2 values via an array.length = 2
 *
 */
module.exports.CliParse = CliParse;
function CliParse(argv)
{
    const config = [
        {
            names : ['showTasks', 'T'],
            type : 'bool',
            help : 'Print a list of tasks.',
        },
        {
            names : ['version', 'v'],
            type : 'bool',
            help : 'Print tool version and exit.',
        },
        {
            names : ['help', 'h'],
            type : 'bool',
            help : 'Print this help and exit.',
        },
        {
            names : ['silent', 's'],
            type : 'bool',
            help : 'Silent output. ',
        },
        {
            names : ['file', 'f'],
            type : 'string',
            help : 'File containing task definitions',
            helpArg : 'FILE',
        },
        {
            names : ['yakefile', 'c'],
            type : 'string',
            help : 'File containing task definitions',
            helpArg : 'FILE',
        },
    ];
    const result = ParseWithConfig(config, argv);

    return result;
}
/**
 * ParseWithConfig - A function that parses an array of command line options and arguments
 *
 * @param      {object}   config  The configuration
 * @param      {array}    argv    an array of things like command line options and arguments
 * @return     {array}     of CliOptions, CliAruments}   returns 2 values via an array.length = 2
 */
function ParseWithConfig(config, argv)
{
    const debug = false;
    const parser = dashdash.createParser({ options : config });

    try
    {
        const opts = parser.parse(argv, 2);

        this.options = opts;
        const innerOptions = parser.options;
        const keyValues = {};
        /**
         * From opts build a key/value object consting ONLY of the options keys and no extra stuff
         * Note that dashdash puts a bunch of other stuff in opts.
         * AND then wrap the keyValue object in a CliOptions object for returing
         */

        innerOptions.forEach((element) =>
        {
            const k = element.key;

            if (debug) debugLog(`loop k: ${k} v: ${opts[k]}`);
            const v = (opts.hasOwnProperty(k)) ? opts[k] : undefined;

            keyValues[k] = v;
        });
        /**
         * @NOTE - the next two variables are temporary and disappear when the function is complete
         * so there is no need to copy them
         */
        const cliOptions = CliOptions(keyValues);
        const cliArgs = CliArguments(opts._args);

        if (debug) debugLog(util.inspect(cliOptions.getOptions()));
        if (cliOptions.getValueFor('help') !== undefined)
        {
            const help = parser.help({ includeEnv : true }).trimRight();
            /* eslint-disable no-console */

            console.log(`${'usage: jake [OPTIONS]\n'
                        + 'options:\n'}${
                         help}`);
            /* eslint-enable no-console */
            process.exit(0);
        }

        return [cliOptions, cliArgs];
    }
    catch (e)
    {
        raiseError(`Command Line Parser found an error: ${e.message}`);
        console.error('Command Line Parser found an error: %s', e.message);
        process.exit(1);
    }
}
