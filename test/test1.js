var JAKE = require('../lib/jake.js');
var TaskManager = require('../lib/jake/taskmanager.js').TaskManager;
var util = require('util');

console.log(util.inspect(JAKE));
var tm = new TaskManager();
console.log(util.inspect(tm));
