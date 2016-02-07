var Dispatcher = require('../dispatchers/ToDoDispatcher');
var ToDoAPI = require('../todo_api');
var EventEmitter = require('events').EventEmitter;
const Actions = require('../actions/ToDoActions.json');

var _is_loading = false;
var _todo_list = {};

function create(id, title) {
    _todo_list[id] = {
        id: id,
        title: title
    };
}

function remove(id) {
    delete _todo_list[id];
}

function enableLoader() {
    _is_loading = true;
}

function disableLoader() {
    _is_loading = false;
}

var TodoStore = Object.assign({}, EventEmitter.prototype, {
    getAll: function () {
        return _todo_list;
    },

    getLoadStatus: function () {
        return _is_loading;
    },

    emitChange: function () {
        this.emit('change');
    },

    addChangeListener: function (callback) {
        this.on('change', callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener('change', callback);
    }
});


Dispatcher.register(function (action) {
    switch (action.action_type) {
        case Actions.LOAD:
            enableLoader();

            TodoStore.emitChange();

            ToDoAPI.getToDoList(function (result) {
                disableLoader();

                if (null !== result && null === result.errors) {
                    var todo_items = result.todos;

                    todo_items.forEach(function (todo_item) {
                        create(todo_item._id, todo_item.title);
                    });
                }

                TodoStore.emitChange();
            });

            break;
        case Actions.CREATE:
            var title = action.title.trim();

            if ('' !== title) {
                var post_data = {
                    title: title
                };

                ToDoAPI.addToDoItem(post_data, function (result) {
                    if (null !== result && null === result.errors) {
                        var todo_item = result.todo;

                        create(todo_item._id, todo_item.title);
                    }

                    TodoStore.emitChange();
                });
            }

            break;
        case Actions.REMOVE:
            ToDoAPI.removeToDoItem(action.id, function (result) {
                if (null !== result && null === result.errors && true === result.deleted) {
                    remove(action.id);
                }

                TodoStore.emitChange();
            });

            break;
        default:
            return false;
    }
});

module.exports = TodoStore;