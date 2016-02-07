var React = require('react');
var ToDoActions = require('../actions/ToDoActions');

var ToDoItem = React.createClass({
    render: function () {
        var todo = this.props.todo;

        return (
            <li key={todo.id}>
                {todo.title}
                &nbsp;<button onClick={this.removeToDo}>x</button>
            </li>
        );
    },

    removeToDo: function () {
        ToDoActions.remove(this.props.todo.id);
    }
});

module.exports = ToDoItem;