const util = require('util');
const chai = require('chai');

const CLI = require('../src/yake/cli_args.js');
const JAKE = require('../src/yake.js');

describe('cli', function(done)
{
	describe('cli-options', function()
	{
		it('simple', function(done)
		{
			let cliopt = CLI.CliOptions({'T':true, 'file': './jakefile'});
			chai.expect(cliopt instanceof CLI.CliOptions).equal(true);
			let T = cliopt.getValueFor('T');
			chai.expect(T).to.equal(true);
			let file = cliopt.getValueFor('file');
			chai.expect(file).to.equal('./jakefile');
			let u = cliopt.getValueFor('junk');
			chai.expect(u).equal(undefined);
			done();
		});
		it('not found', function(done)
		{
			let cliopt = CLI.CliOptions({'T':true, 'file': './jakefile'});
			chai.expect(cliopt instanceof CLI.CliOptions).equal(true);
			let u = cliopt.getValueFor('junk');
			chai.expect(u).equal(undefined);
			done();
		});
		it('immutable', function(done)
		{
			let cliopt = CLI.CliOptions({'T':true, 'file': './jakefile'});
			chai.expect(cliopt instanceof CLI.CliOptions).equal(true);
			let T = cliopt.getValueFor('T');
			chai.expect(T).to.equal(true);
			T = false;
			let T2 = cliopt.getValueFor('T');
			chai.expect(T2).to.equal(true);

			let file = cliopt.getValueFor('file');
			file = 'junk';
			let file2 = cliopt.getValueFor('file');
			chai.expect(file2).to.equal('./jakefile');
			done();
		});		
		it('immutable input', function(done)
		{
			let input = {'T':true, 'file': './jakefile'};
			let cliopt = CLI.CliOptions(input);
			input['newkey'] = 'newvalue';
			// console.log(`input ${util.inspect(input)}`)
			// console.log(`getOptions ${util.inspect(cliopt.getOptions())}`)
			chai.expect(cliopt instanceof CLI.CliOptions).equal(true);

			// changing input after creation should not change object
			let I = cliopt.getValueFor('newkey');
			chai.expect(I).to.equal(undefined);

			let T = cliopt.getValueFor('T');
			chai.expect(T).to.equal(true);
			T = false;
			let T2 = cliopt.getValueFor('T');
			chai.expect(T2).to.equal(true);

			let file = cliopt.getValueFor('file');
			file = 'junk';
			let file2 = cliopt.getValueFor('file');
			chai.expect(file2).to.equal('./jakefile');
			done();
		});		
	});
	describe('cli-args', function()
	{
		it('simple', function()
		{
			let cliopt = CLI.CliArguments(['one','two']);
			chai.expect(cliopt instanceof CLI.CliArguments).equal(true);

			let args = cliopt.getArgs();
			chai.expect(Array.isArray(args)).to.equal(true);
			chai.expect(args.length).to.equal(2);
			chai.expect(args[0]).to.equal('one');
			chai.expect(args[1]).to.equal('two');
		})
		it('immutable', function()
		{
			let cliopt = CLI.CliArguments(['one','two']);
			chai.expect(cliopt instanceof CLI.CliArguments).equal(true);

			let args = cliopt.getArgs();
			args.push('three');
			chai.expect(Array.isArray(args)).to.equal(true);
			chai.expect(args.length).to.equal(3);
			chai.expect(args[0]).to.equal('one');
			chai.expect(args[1]).to.equal('two');
			chai.expect(args[2]).to.equal('three');
			let args2 = cliopt.getArgs();
			chai.expect(Array.isArray(args)).to.equal(true);
			chai.expect(args2.length).to.equal(2);
			chai.expect(args2[0]).to.equal('one');
			chai.expect(args2[1]).to.equal('two');
		})		
		it('immutable input', function()
		{
			let input = ['one', 'two'];
			let cliopt = CLI.CliArguments(input);
			input.push('three');

			chai.expect(cliopt instanceof CLI.CliArguments).equal(true);

			// object should not have changed as result of changing input after creation
			let args = cliopt.getArgs();
			chai.expect(Array.isArray(args)).to.equal(true);
			chai.expect(args.length).to.equal(2);
			chai.expect(args[0]).to.equal('one');
			chai.expect(args[1]).to.equal('two');
			chai.expect(args[2]).to.equal(undefined);
		})		

	});
	describe('cli-parse', function()
	{
		it('simple', function(done)
		{
			let [opts, args] = CLI.CliParse([ '/usr/local/bin/node', 'jake', '--file=yakefile.js', '-T', 'arg1', 'arg2']);

			chai.expect(opts.getValueFor('showTasks')).equals(true);
			chai.expect(opts.getValueFor('file')).equals('yakefile.js');
			// console.log(`${util.inspect(opts.getOptions())}`);
			chai.expect(Object.keys(opts.getOptions()).length).equal(2);
			// console.log(`${util.inspect(args)}`);
			chai.expect(args.getArgs().length).equals(2);
			chai.expect(args.getArgs()[0]).equals('arg1');
			chai.expect(args.getArgs()[1]).equals('arg2');

			// console.log(`${util.inspect(opts)}`);
			// console.log(`${util.inspect(args)}`);
			done();
		});
	});

})