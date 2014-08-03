var MongoClient = require('mongodb').MongoClient;

/**
 * Search files in the GridFS store with names that match any portion of <string>
 *
 * @param {String} String search
 * @param {Object} Commander options
 */
module.exports = function(string, options) {
	var opt= options.parent,
		url= "mongodb://" +
		(opt.username && opt.password ? opt.username + ':' + opt.password : "") +
		opt.host +
		':' + opt.port + '/' +
		opt.database;

	MongoClient.connect(url, function(err, db) {
		if (err) {
			console.log(err);
			process.exit(1);
		}

		console.log('Connected to: ' + opt.database);

		// Access files collection
		db.collection(opt.gridfsnamespace + '.files', {strict:true}, function(err, col) {
			if (err) {
				console.log(err);
				db.close(true);
				process.exit(1);
			}

			col.find({'filename': {$regex: string, $options: 'i'}}, {'filename': 1, 'length': 1})
			.each(function(err, doc) {
				if (doc !== null) {
					console.log(doc._id + '\t' + doc.length + '\t' + doc.filename);
				} else {
					db.close(true);
					process.exit(0);
				}
			});

		});
	});
};
