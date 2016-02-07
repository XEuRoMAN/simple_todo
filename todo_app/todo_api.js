function makeGetRequest(url, callback) {
    var request = new XMLHttpRequest();

    request.open('GET', url, true);
    request.onload = function () {
        if (200 <= request.status && 400 > request.status){
            callback(JSON.parse(request.responseText));
        } else {
            callback(null);
        }
    };
    request.send();
}

function makePostRequest(url, post_data, callback) {
    var request = new XMLHttpRequest();

    request.open('POST', url, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.onload = function () {
        if (200 <= request.status && 400 > request.status){
            callback(JSON.parse(request.responseText));
        } else {
            callback(null);
        }
    };
    request.send(JSON.stringify(post_data));
}

function makeDeleteRequest(url, callback) {
    var request = new XMLHttpRequest();

    request.open('DELETE', url, true);
    request.onload = function () {
        if (200 <= request.status && 400 > request.status){
            callback(JSON.parse(request.responseText));
        } else {
            callback(null);
        }
    };
    request.send();
}

module.exports = {
    getToDoList: function (callback) {
        makeGetRequest('/api/todo', callback);
    },

    addToDoItem: function (post_data, callback) {
        makePostRequest('/api/todo', post_data, callback);
    },

    removeToDoItem: function (todo_id, callback) {
        makeDeleteRequest('/api/todo/' + todo_id, callback);
    }
};
