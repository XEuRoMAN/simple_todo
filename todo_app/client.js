var React = require('react');
var ReactDOM = require('react-dom');
var ToDoApp = require('./components/ToDoApp.react');

ReactDOM.render(
    <ToDoApp />,
    document.getElementById('todo_app')
);