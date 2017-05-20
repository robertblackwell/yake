/**
 * Yake can operate in three modes:
 * 	-	a jake/ruby mode where the yake bin is executed and loads a yakefile
 * 	-	where yake is part of a cli script (in js) and loads tasks from an array data sctructure
 * 	-	where yake is part of a cli script (in js) and loads tasks using the yake.task() and related functions
*/

// these are destinguished by an enumerated typeof - correspondingly
exports.MODE = {
    yakeCmd : 'yake_cmd',
    yakeFromArray : 'yakeFromArray',
    yakeTaskfile : 'yake_taskfile',
};
