/**
 * Module for managing all operations related to finding and resolving yakefile.
 */
const path      = require('path');
const fs        = require('fs');
const util      = require('util');
const debug     = false;

function debugLog(s)
{
    /* eslint-disable no-console */
    console.log(s);
    /* eslint-enable no-console */
}
/**
 * Returns an array of file names that are the default names for jakefiles
 *
 * @return     {array of strings}  Array of filenames
 */
exports.defaultFilenames = defaultFilenames;
function defaultFilenames()
{
    const DEFAULT_JAKEFILES = ['yakefile', 'Yakefile', 'yakefile.js', 'Yakefile.js', 'yakefile.j', 'Yakefile.j'];

    return DEFAULT_JAKEFILES.slice();
}

// True if one of the files in JAKEFILES is in the current directory.
// If a match is found, it is copied into @jakefile.

/**
 * directoryHasFile - searches a directory to see if one of the filenames in arrayOfFileNames
 * exists in that directory
 *
 * @param      {string}             aDirectory        A directory
 * @param      {array of string}    arrayOfFileNames  The array of file names
 * @return     {string | undefined} returns the filename is successful else undefined
 */
exports.directoryHasFile = directoryHasFile;
function directoryHasFile(/* String*/ aDirectory, arrayOfFileNames)
{
    if (debug) debugLog(`directoryHasFile dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)}`);
    for (let i = 0; i < arrayOfFileNames.length; ++i)
    {
        const jakefile = arrayOfFileNames[i];

        if (fs.existsSync(path.join(aDirectory, jakefile)))
        {
            if (debug)
            {
                debugLog(`directoryHasFile `
                    + ` found: ${jakefile} dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)} `);
            }

            return jakefile;
        }

        else if (jakefile === '')
        {
            if (debug)
            {
                debugLog(`directoryHasFile NOTfound: `
                    + ` ${jakefile} dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)} `);
            }

            return undefined;
        }
    }
    if (debug)
    {
        debugLog(`directoryHasFile NOTfound: dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)} `);
    }

    return undefined;
}

/**
 * Search upwards from and including aDirectory to find one of the files named in arrayOfFiles
 * returns the full path of the file if it exists
 *
 * @param   {string}                            path to a directory where the search should start
 * @param   {array of strings}                  arrayOfFileNames  The array of file names
 * @return  {string | undefined}                full path of the jakefile that was found or undefined if none found
 */

exports.recursiveFindFile = recursiveFindFile;
function recursiveFindFile(aDirectory, arrayOfFileNames)
{
    if (debug) debugLog(`recursiveFindFile dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)}`);
    // var directory = process.cwd();
    let directory = aDirectory;

    const tmp = directoryHasFile(directory, arrayOfFileNames);

    if ((tmp === undefined) && directory !== '/')
    {
        directory = path.dirname(directory);
        const anotherTmp = recursiveFindFile(directory, arrayOfFileNames);

        return anotherTmp;
    }
    else if (tmp === undefined)
    {
        // ran out of directories
        return undefined;
    }
    const p = path.resolve(directory, tmp);

    return p;
}
/**
 * Searches directories recursively upwards to find a jakefile with
 * one of the default names
 */
exports.findJakeFileStartingAt = findJakeFileStartingAt;
function findJakeFileStartingAt(aDirectory)
{
    return recursiveFindFile(aDirectory, defaultFilenames());
}

