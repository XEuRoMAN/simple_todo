var Dispatcher = require('../dispatchers/ToDoDispatcher');
const Actions = require('./ToDoActions.json');

var TodoActions = {
    load: function () {
        Dispatcher.dispatch({
            action_type: Actions.LOAD
        });
    },

    create: function (title) {
        Dispatcher.dispatch({
            action_type: Actions.CREATE,
            title: title
        });
    },

    remove: function (id) {
        Dispatcher.dispatch({
            action_type: Actions.REMOVE,
            id: id
        });
    }
};

module.exports = TodoActions;