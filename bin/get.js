var fs = require('fs'),
	MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	Grid = require('mongodb').Grid;

/**
 * Copy the file specified by _id from GridFS storage to the local file system
 *
 * @param {String} String _id
 * @param {String} Filename to save in the local file system
 * @param {Object} Commander options
 */
module.exports = function(_id, filename, options) {
	var oid= ObjectID.isValid(_id) ? new ObjectID(_id) : _id,
		opt= options.parent,
		url= "mongodb://" +
		(opt.username && opt.password ? opt.username + ':' + opt.password : "") +
		opt.host +
		':' + opt.port + '/' +
		opt.database;

	// Establish connection to db
	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log(err);
			process.exit(1);
		}

		console.log('Connected to: ' + opt.database);

		// Create a new grid instance
		var grid= new Grid(db, opt.gridfsnamespace);

		// Fetch the content
		grid.get(oid, function(err, data) {
			if (err) {
				console.log(err);
				db.close(true);
				process.exit(1);
			}

			fs.writeFileSync(filename, data);
			console.log('File with _id=' + _id + ' saved to ' + filename)

			db.close();
		});
	});
};
