var React = require('react');
var ToDoStore = require('../stores/ToDoStore');
var ToDoList = require('./ToDoList.react');
var ToDoActions = require('../actions/ToDoActions');

var ToDoApp = React.createClass({
    getInitialState: function () {
        return {
            todo_list: {},
            loading: false
        };
    },

    componentDidMount: function () {
        ToDoStore.addChangeListener(this.onChange);
        ToDoActions.load();
    },

    componentWillUnmount: function () {
        ToDoStore.removeChangeListener(this.onChange);
    },

    render: function () {
        return (
            <div>
                <div className={'loader' + (this.state.loading ? ' active' : '')}>Loading...</div>
                <ToDoList
                    is_loading={this.state.loading}
                    todo_list={this.state.todo_list} />
            </div>
        );
    },

    onChange: function () {
        this.setState({
            todo_list: ToDoStore.getAll(),
            loading: ToDoStore.getLoadStatus()
        });
    }
});

module.exports = ToDoApp;