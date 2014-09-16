var fs = require('fs'),
	path= require('path'),
	MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	Grid = require('mongodb').Grid;

/**
 * Copy <filename> file from the local file system into GridFS storage with this <_id>.
 * Without the --replace option if the _id exists raises an error
 *
 * @param {String} Filename to save in the local file system
 * @param {String} String _id
 * @param {Object} Commander options
 */
module.exports = function(filename, _id, options) {
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

		db.collection(opt.gridfsnamespace + '.files', {strict:true}, function(err, col) {
			if (err) {
				console.log(err);
				db.close(true);
				process.exit(1);
			}

			// _id exists?
			col.findOne({_id: oid}, function(err, doc) {
				if (err) {
					console.log(err);
					db.close(true);
					process.exit(1);
				}

				if (doc != null && !opt.replace) { // _id exists and not replace
					console.log('Error: _id=' + _id + ' found! If you want to update the file use the --replace option');
					db.close(true);
					process.exit(1);
				}
				fs.readFile(filename, function (err, data) {
					if (err) {
						console.log(err);
						db.close(true);
						process.exit(1);
					}

					// Create a new grid instance
					var grid= new Grid(db, opt.gridfsnamespace);

					// Write data to gridfs
					grid.put(data, {_id: oid, root: opt.gridfsnamespace, filename: path.basename(filename), content_type: opt.content_type}, function(err) {
						if (err) {
							console.log(err);
							db.close(true);
							process.exit(1);
						}

						console.log('File with _id=' + _id + ' added!');

						db.close(true);
					});
				});
			});
		});
	});
};
