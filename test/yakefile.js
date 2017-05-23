const util = require('util');
const chai = require('chai');
const path = require('path');

const YF = require('../src/yake/yakefile.js');

describe('yakefile', function(done)
{
	describe('findfile', function()
	{
		it('defaults', function(done)
		{
			// console.log(YF.defaultFilenames());
			chai.expect(Array.isArray(YF.defaultFilenames())).equal(true);
			chai.expect(YF.defaultFilenames().length).equal(6);
			done();
		});
		it('find cwd', function(done)
		{
			chai.expect((YF.directoryHasFile(path.resolve(__dirname, "data/sub1"), YF.defaultFilenames() ))).equal('yakefile.js');
			done();
		});
	});	
	describe('findfilerecursive', function()
	{
		it('find recursive', function(done)
		{
			let dir = path.resolve(__dirname, 'data/sub1');
			let fp = path.resolve(__dirname, 'data/sub1/yakefile.js');
			let tmp = YF.recursiveFindFile(path.resolve(__dirname, "data/sub1/sub2/sub3"), YF.defaultFilenames() );
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
			
			let tmp = YF.findJakeFileStartingAt(startDir);
			chai.expect(tmp).equal(fp);
			done();
		});
	});		
});