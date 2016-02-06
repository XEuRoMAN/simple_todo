var express = require('express');
var router = express.Router();

module.exports = function (app, mongoose) {
    router.get('/', function (request, response, next) {
        var TodoModel = mongoose.model('todo');

        var result = {
            errors: null,
            todos: []
        };

        var query = {
            deleted: null
        };

        TodoModel.find(query, function (error, todo_list) {
            if (error) {
                response.status(500);

                result.errors = error;
            } else {
                var list_length = todo_list.length;

                for (var i = 0; i < list_length; ++i) {
                    var todo_item = todo_list[i].toObject();
                    var allowed_keys = [
                        '_id',
                        'title'
                    ];

                    filterObjectKeys(todo_item, allowed_keys);

                    result.todos.push(todo_item);
                }
            }

            response.json(result);
        });
    });

    router.post('/', function (request, response, next) {
        var TodoModel = mongoose.model('todo');

        var result = {
            errors: null,
            todo: null
        };

        var posted_values = request.body;

        // We don't want to let client to initiate any other value.
        var allowed_keys = [
            'title'
        ];

        filterObjectKeys(posted_values, allowed_keys);

        var todo = new TodoModel(posted_values);

        todo.save(function (error, todo_item) {
            if (error) {
                response.status(500);

                result.errors = error;
            } else {
                var response_item = todo_item.toObject();
                var allowed_keys = [
                    '_id',
                    'title'
                ];

                filterObjectKeys(response_item, allowed_keys);

                result.todo = response_item;
            }

            response.json(result);
        });
    });

    router.put('/:todo_id', function (request, response, next) {
        var TodoModel = mongoose.model('todo');

        var result = {
            errors: null,
            todo: null
        };

        var query = {
            _id: request.params.todo_id,
            deleted: null
        };

        TodoModel.findOne(query, function (error, todo_item) {
            if (error) {
                response.status(500);

                result.errors = error;

                response.json(result);
            } else if (null === todo_item) {
                response.status(500);

                result.errors = 'Can not update ToDo item with ID: ' + request.params.todo_id;

                response.json(result);
            } else {
                var posted_values = request.body;

                // We don't want to let client to modify any other value.
                var allowed_keys = [
                    'title'
                ];

                filterObjectKeys(posted_values, allowed_keys);

                Object.assign(todo_item, posted_values);

                todo_item.save(function (error, updated_todo_item) {
                    if (error) {
                        response.status(500);

                        result.errors = error;
                    } else {
                        var response_item = updated_todo_item.toObject();
                        var allowed_keys = [
                            '_id',
                            'title'
                        ];

                        filterObjectKeys(response_item, allowed_keys);

                        result.todo = response_item;
                    }

                    response.json(result);
                });
            }
        });
    });

    router.delete('/:todo_id', function (request, response, next) {
        var TodoModel = mongoose.model('todo');

        var result = {
            errors: null,
            deleted: false
        };

        var query = {
            _id: request.params.todo_id,
            deleted: null
        };
        var update = {
            $set: {
                deleted: getTimestamp()
            }
        };

        TodoModel.update(query, update, function (error, info) {
            if (error) {
                response.status(500);

                result.errors = error;
            } else if (0 === info.nModified) {
                response.status(500);

                result.errors = 'Can not delete ToDo item with ID: ' + request.params.todo_id;
            } else {
                result.deleted = true;
            }

            response.json(result);
        });
    });

    // default URL prefix
    app.use('/api/todo', router);
};

function filterObjectKeys(item, allowed_keys) {
    Object.keys(item).forEach(function (key) {
        if (-1 === allowed_keys.indexOf(key)) {
            delete item[key];
        }
    });
}

function getTimestamp() {
    var timestamp = +new Date();

    return Math.round(timestamp / 1000);
}