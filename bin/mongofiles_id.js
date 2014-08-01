#!/usr/bin/env node

var program= require('commander');

program
.version('0.1.0')
.option('--host [hostname]', 'Hostname. Default localhost')
.option('--port [port]', 'Port. Default 27017')
.option('--database <database>', 'Specifies the name of the database to work with')
.option('--gridfsnamespace [prefix]', 'The gridfs namespace (prefix) to work with. Default fs')
.option('-u, --username [username]', 'Username')
.option('-p, --password [password]', 'Password')
.option('--replace', 'Replace file with PUT');

program
.command('list [prefix]')
.description('Lists the files in the GridFS store. Optionally limit the list of returned items to files that names begin with [prefix]')
.action(function(){
	console.log('Lists the files in the GridFS store');
});

program
.command('search <string>')
.description('Lists the files in the GridFS store with names that match any portion of <string>')
.action(function(string){
	console.log('Lists the files in the GridFS store with names that match any portion of ' + string);
});

program
.command('get <_id>')
.description('Copy the file specified by <_id> from GridFS storage to the local file system')
.action(function(_id){
	console.log('Copy the specified file by _id ' + _id + ' from GridFS storage to the local file system');
});

program
.command('put <filename> <_id>')
.description('Copy <filename> file from the local file system into GridFS storage with this <_id>. Without the --replace option if the _id exists raises an error')
.action(function(_id, filename){
	console.log('Copy ' + filename + ' into GridFS storage with _id '+ _id);
});

program
.command('delete <_id>')
.description('Delete the specified file by <_id> from GridFS storage')
.action(function(_id){
	console.log('Delete the specified file by ' + _id + ' from GridFS storage');
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
