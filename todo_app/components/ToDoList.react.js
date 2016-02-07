var React = require('react');
var ToDoItem = require('./ToDoItem.react');
var ToDoActions = require('../actions/ToDoActions');

var ToDoList = React.createClass({
    getInitialState: function () {
        return {
            title: ''
        };
    },

    render: function () {
        var todo_list = this.props.todo_list;
        var todo_items = [];

        for (var todo_id in todo_list) {
            todo_items.push(<ToDoItem key={todo_id} todo={todo_list[todo_id]} />);
        }

        return (
            <div className={'todo_container' + (this.props.is_loading ? ' hidden' : '')}>
                <ul id='todo_list'>{todo_items}</ul>
                <input
                    name='todo_title'
                    value={this.state.title}
                    onChange={this.changeState}
                    placeholder='Enter your new task...' />
                <button onClick={this.addNewToDo}>+</button>
            </div>
        );
    },

    changeState: function (event) {
        this.setState({
            title: event.target.value
        });
    },

    addNewToDo: function () {
        ToDoActions.create(this.state.title);

        this.setState({
            title: ''
        });
    }
});

module.exports = ToDoList;