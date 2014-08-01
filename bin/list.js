var MongoClient = require('mongodb').MongoClient;

/**
 * Lists the files in the GridFS store. Optionally limit the list of returned
 * items to files that names begin with [prefix]
 *
 * @param {String} List prefix
 * @param {Object} Commander options
 */
module.exports = function(prefix, options) {
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

			var selector= (prefix ? {'filename': {$regex: '^' + prefix, $options: 'i'}} : {});

			col.find(selector, {'filename': 1, 'length': 1})
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
