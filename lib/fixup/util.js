module.exports = {
	copy : function(objSrc){
		var obj = {};
		Object.assign(obj, objSrc );
		return obj;
	}
};