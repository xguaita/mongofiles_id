var MongoClient = require('mongodb').MongoClient,
	ObjectID = require('mongodb').ObjectID,
	Grid = require('mongodb').Grid;

/**
 * Delete the file specified by _id from GridFS storage
 *
 * @param {String} String _id
 * @param {Object} Commander options
 */
module.exports = function(_id, options) {
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

		// Grid.delete doesn't raise a error if _id not exist
		db.collection(opt.gridfsnamespace + '.files', {strict:true}, function(err, col) {
			if (err) {
				console.log(err);
				db.close(true);
				process.exit(1);
			}

			col.findOne({_id: oid}, function(err, doc) {
				if (err) {
					console.log(err);
					db.close(true);
					process.exit(1);
				}

				if (doc == null) { // _id not found
					console.log('Error: _id=' + _id + ' not found!');
					db.close(true);
					process.exit(1);
				}

				// Create a new grid instance
				var grid= new Grid(db, opt.gridfsnamespace);

				// Delete file from gridfs
				grid.delete(oid, function(err) {
					if (err) {
						console.log(err);
						db.close(true);
						process.exit(1);
					}

					console.log('File with _id=' + _id + ' deleted!');

					db.close(true);
				});
			});
		});
	});
};
