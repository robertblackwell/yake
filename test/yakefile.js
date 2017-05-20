const util = require('util');
const chai = require('chai');
const path = require('path');

const JF = require('../src/yake/yakefile.js');

describe('yakefile', function(done)
{
	describe('findfile', function()
	{
		it('defaults', function(done)
		{
			// console.log(JF.defaultFilenames());
			chai.expect(Array.isArray(JF.defaultFilenames())).equal(true);
			chai.expect(JF.defaultFilenames().length).equal(6);
			done();
		});
		it('find cwd', function(done)
		{
			chai.expect((JF.directoryHasFile(path.resolve(__dirname, "data/sub1"), JF.defaultFilenames() ))).equal('yakefile.js');
			done();
		});
	});	
	describe('findfilerecursive', function()
	{
		it('find recursive', function(done)
		{
			let dir = path.resolve(__dirname, 'data/sub1');
			let fp = path.resolve(__dirname, 'data/sub1/yakefile.js');
			let tmp = JF.recursiveFindFile(path.resolve(__dirname, "data/sub1/sub2/sub3"), JF.defaultFilenames() );
			chai.expect(tmp).equal(fp);
			done();
		});
	});	
	describe('put it all together', function()
	{
		it('find recursive', function(done)
		{
			const startDir = path.resolve(__dirname, 'data/sub1/sub2/sub3');
			let fp = path.resolve(__dirname, 'data/sub1/yakefile.js');

			let dir = path.resolve(__dirname, 'data/sub1');
			
			let tmp = JF.findJakeFileStartingAt(startDir);
			chai.expect(tmp).equal(fp);
			done();
		});
	});		
});