# Yake

The name, __Y__et another j/Y/R __AKE__.

Why - thats takes a bit longer. 

Like a number of folks I got tired of grunt and gulp with all their dependencies and having to learn how to use plugins. Also I am a bit old school having been brought up on (and before) `make`.
Though I have used `make` in a number of php and js projects it is a bit too temperamental for my taste,
	does not translate to the modern generation well, and
further `php` and `js` projects tend not to require the `file task` dependencies that are makes diet.

I was introduced to using `npm` together with [`./taskfile`](https://hackernoon.com/introducing-the-taskfile-5ddfe7ed83bd) for building and really liked the simplicity. However when one has `node+javascript` available writing even a small `shell script` does not taste right. I have been spoiled by `node+javascript+chrome debugger`.

Hence I went looking for a `simple javascript solution`. 

That's when I found [jake](https://github.com/jakejs/jake), and a very nice tool it is too. 

But still it seemed a little too sophisticated, and by now I was looking for a little javascript project where I could play around with `functional programming ideas` that I had been reading about.

So I got the idea of implementing a `cut down jake` in my version of a functional approach. 

## Requirements

So this is the list of my requirements:

-	written in javascript and node
- 	run either like `Rake/jake` or as `./taskfile` (see usage)
-	easy command line execution
- 	undertand preresuisite tasks
-  be lightweight (both in number of dependencies and the length of the task file). If it is as convenient as [__taskfile__](https://hackernoon.com/introducing-the-taskfile-5ddfe7ed83bd) I will be satisfied
-  support task descriptions and `-T` option
-  pass through colored output for example from webpack

On top of that some things it did not have to do:

-	have file tasks like r/jake
- 	plugins for things like webpack, less etc - simply use the command line


And finally things I might get it to do eventually if I find the need:

-	have `watch` tasks built in
-	async tasks
- 	passing arguments from the command line through to task action functions

## Install

Simple 

```
	npm --save-dev install yake
```

## Usage

As noted above, a goal was to allow this tool to be used in either of two ways.

### As a command

As in

```
	yake [options] taskname arg1 arg2 .... argn
	
	where options are:
	
		-T --showTasks 	show all tasks with descriptions
		-f --file			path to a config file, defaults to one of ['yakefile']
	
```
