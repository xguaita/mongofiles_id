#!/usr/bin/env node

var program= require('commander'),
	list= require('./list.js'), // Lists the files in the GridFS store
	search= require('./search.js'), // Search files in the GridFS store
	get= require('./get.js'), // Get a file from the GridFS store
	put= require('./put.js'), // Insert/update a file to the GridFS store
	del= require('./del.js'); // Delete a file from the GridFS store

program
.version('0.1.0')
.option('--host [hostname]', 'Hostname. Default localhost', 'localhost')
.option('--port [port]', 'Port. Default 27017', 27017)
.option('--database <database>', 'Specifies the name of the database to work with')
.option('--gridfsnamespace [prefix]', 'The gridfs namespace (prefix) to work with. Default fs', 'fs')
.option('-u, --username [username]', 'Username')
.option('-p, --password [password]', 'Password')
.option('--content_type [content_type]', 'Mime type of the file. Default binary/octet-stream', 'binary/octet-stream')
.option('--replace', 'Replace file with PUT');

program
.command('list [prefix]')
.description('Lists the files in the GridFS store. Optionally limit the list of returned items to files that names begin with [prefix]')
.action(function(prefix, options){
	if (!options.parent.database) {
		console.log('Error: <database> required');
		process.exit(1);
	}
	list(prefix, options);
});

program
.command('search <string>')
.description('Lists the files in the GridFS store with names that match any portion of <string>')
.action(function(string, options){
	if (!options.parent.database) {
		console.log('Error: <database> required');
		process.exit(1);
	}
	search(string, options);
});

program
.command('get <_id> <filename>')
.description('Copy the file specified by <_id> from GridFS storage to the local file system as <filename>')
.action(function(_id, filename, options){
	if (!options.parent.database) {
		console.log('Error: <database> required');
		process.exit(1);
	}
	get(_id, filename, options);
});

program
.command('put <filename> <_id>')
.description('Copy <filename> file from the local file system into GridFS storage with this <_id>. Without the --replace option if the _id exists raises an error')
.action(function(filename, _id, options){
	if (!options.parent.database) {
		console.log('Error: <database> required');
		process.exit(1);
	}
	put(filename, _id, options);
});

program
.command('delete <_id>')
.description('Delete the specified file by <_id> from GridFS storage')
.action(function(_id, options){
	if (!options.parent.database) {
		console.log('Error: <database> required');
		process.exit(1);
	}
	del(_id, options);
});


program
.command('*')
.action(function(env){
	console.log('Invalid command ' + env + '. Enter a valid command!');
	program.help();
});


program.parse(process.argv);

if (!program.args.length) {
	program.help();
}
