/**
 * Module for managing all operations related to finding and resolving jakefile.
 */
const process = require('process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const debug = false;
/**
 * Returns an array of file names that are the default names for jakefiles
 *
 * @return     {array of strings}  Array of filenames
 */
exports.defaultFilenames = defaultFilenames;
function defaultFilenames()
{
	const DEFAULT_JAKEFILES = ["jakefile", "Jakefile", "jakefile.js", "Jakefile.js", "jakefile.j", "Jakefile.j"];
	return DEFAULT_JAKEFILES.slice();
}

// Find the rakefile and then load it and any pending imports.
exports.loadFile = function load() 
{
    rawLoadJakefile();
}

// True if one of the files in JAKEFILES is in the current directory.
// If a match is found, it is copied into @jakefile.

/**
 * directoryHasFile - searches a directory to see if one of the filenames in arrayOfFileNames
 * exists in that directory
 *
 * @param      {string}  			aDirectory        A directory
 * @param      {array of string}  	arrayOfFileNames  The array of file names
 * @return     {string | undefined}	returns the filename is successful else undefined
 */
exports.directoryHasFile = directoryHasFile;
function directoryHasFile(/*String*/ aDirectory, arrayOfFileNames) 
{
	if(debug) console.log(`directoryHasFile dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)}`);
    for (var i = 0; i < arrayOfFileNames.length; ++i) 
    {
        var jakefile = arrayOfFileNames[i];

        if (fs.existsSync(path.join(aDirectory, jakefile)))
        {

			if(debug) console.log(`directoryHasFile found: ${jakefile} dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)} `);
            return jakefile;
        }

        else if (jakefile === "")
        {
			if(debug) console.log(`directoryHasFile NOTfound: ${jakefile} dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)} `);
            return void 0;
        }
    }
	if(debug) console.log(`directoryHasFile NOTfound: ${jakefile} dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)} `);
    return void 0;
}

/**
 * Search upwards from and including aDirectory to find one of the files named in arrayOfFiles
 * returns the full path of the file if it exists
 *
 * @param 	{string}							path to a directory where the search should start
 * @param   {array of strings}            		arrayOfFileNames  The array of file names
 * @return  {string | undefined}  				full path of the jakefile that was found or undefined if none found
 */

exports.recursiveFindFile = recursiveFindFile;
function recursiveFindFile(aDirectory, arrayOfFileNames) 
{

	const tailRecursion = true;

	if(debug) console.log(`recursiveFindFile dir: ${aDirectory}, filenames: ${util.inspect(arrayOfFileNames)}`);
    // var directory = process.cwd();
    var directory = aDirectory;
    var filename = void 0;

    if( ! tailRecursion )
	{    // while (!((filename = directoryHasFile(directory, arrayOfFileNames) ! == undefined) && directory !== "/")
    // {
    // 	// go up a directory
    //     directory = path.normalize(path.join(directory, ".."));
    // }
	}
	else
	{
	    let tmp = directoryHasFile(directory, arrayOfFileNames)

	    if( (tmp === undefined) && directory !== '/' )
	    {
			if(debug) console.log(`recursiveFindFile recursing 1 dir: ${directory}`);
	        directory = path.dirname(directory);
			if(debug) console.log(`recursiveFindFile recursing 2 dir: ${directory}`);
	    	let anotherTmp = recursiveFindFile(directory, arrayOfFileNames);
			if(debug) console.log(`recursiveFindFile up dir: ${directory}, filename: ${filename} anotherTmp : ${util.inspect(anotherTmp)}`);

	   		return anotherTmp;
	    }
	    else if(tmp === undefined )
	    {
	    	// ran out of directories
	    	return void 0;
	    } 
	    else
	    {
	    	// found it
	    	let p = path.resolve(directory, tmp);
	    	return p;
	    	// return [tmp, directory];
	    }
	}
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
/**
 * Finds and loads a jakefile from the array of candidates filenames
 *
 * @param      {array of string}  			arrayOfFileNames  The array of file names
 * @param      {boolean}  silent            If silent dont print any error messages
 */
exports.loadRaw = function loadRaw(arrayOfFileNames, silent=rue) 
{
    var result = findJakefileLocation(arrayOfFileNames);
    var jakefile = (result !== undefined)  ? result[0] : false;
    var location = (result !== undefined)  ? result[1] : false;

    if (!jakefile)
        throw "No Jakefile found (looking for: " + this._jakefiles.join(', ') + ")";

    if (!silent)
        print("(in " + process.cwd() + ")");

    if (jakefile && jakefile.length)
    {
        require(path.normalize(path.join(location, jakefile)));
    }
}

