var util = require('util');
module.exports = {
	printf : function(){
		var s = util.format.apply(null, arguments);
		console.log(s);
	},
	print : console.log,
}