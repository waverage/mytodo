( function () {
'use strict';
var mongo = require('mongodb').MongoClient;
var Tasks = Object.create(null);

mongo.connect('mongodb://localhost:27017/tasksdb', function (err, db) {
    var coll = db.collection('tasks');

    Tasks.list = function (callback) {
        coll.find({type: 'task'}).toArray(function (err, data) {
            callback(data);
        });
    };

    Tasks.add = function (data, callback) {
        coll.insert(data, function (err, res) {
            if (err)
                throw new Error( err );
            callback();
        });
    };

    Tasks.del = function (id, callback) {
        coll.remove({id: id, type: 'task'}, function (err, res) {
            if (err)
                throw new Error( err );
            callback();
        });
    };

    Tasks.update = function (data, callback) {
        coll.update({'id': data.id}, data);
        callback();
    };
});

module.exports = Tasks;
} )();