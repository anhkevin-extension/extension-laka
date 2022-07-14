$(function () {
    setTimeout(function(){
        // icon task
        if ($('#navigation').length > 0) {
            $('#navigation ul.nav-icon li:first-child').before('<li class="nav-item"><span id="nav-icon-todo-list"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 470.767 470.767" style="enable-background:new 0 0 470.767 470.767;" xml:space="preserve"><g><path d="M362.965,21.384H289.62L286.638,7.99C285.614,3.323,281.467,0,276.685,0h-82.618c-4.782,0-8.913,3.323-9.953,7.99l-2.967,13.394h-73.36c-26.835,0-48.654,21.827-48.654,48.662v352.06c0,26.835,21.819,48.662,48.654,48.662h255.179c26.835,0,48.67-21.827,48.67-48.662V70.046C411.635,43.211,389.8,21.384,362.965,21.384z M379.831,422.105c0,9.295-7.563,16.858-16.866,16.858H107.786c-9.287,0-16.85-7.563-16.85-16.858V70.046c0-9.295,7.563-16.857,16.85-16.857h66.294l-1.692,7.609c-0.684,3.02,0.062,6.188,1.988,8.596c1.94,2.415,4.876,3.82,7.965,3.82h106.082c3.091,0,6.026-1.405,7.951-3.82c1.942-2.415,2.687-5.575,2.004-8.596l-1.692-7.609h66.279c9.303,0,16.866,7.563,16.866,16.857V422.105z"/><path d="M170.835,188.426h43.249l-10.279-7.019c-14.506-9.899-18.232-29.693-8.325-44.197c9.893-14.489,29.693-18.239,44.197-8.324l1.694,1.157v-12.136c0-7.866-6.383-14.248-14.242-14.248h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.271C156.595,182.045,162.978,188.426,170.835,188.426z"/><path d="M303.256,110.313l-49.85,47.194l-22.704-15.49c-7.221-4.962-17.13-3.083-22.099,4.162c-4.954,7.251-3.09,17.144,4.178,22.098l33.28,22.727c2.718,1.864,5.839,2.772,8.961,2.772c3.96,0,7.888-1.474,10.933-4.356l59.167-56.014c6.382-6.033,6.645-16.104,0.62-22.479C319.686,104.552,309.637,104.28,303.256,110.313z"/><path d="M170.835,297.669H214.1l-10.295-7.027c-14.506-9.901-18.232-29.693-8.325-44.197c9.893-14.498,29.693-18.248,44.197-8.325l1.694,1.158v-12.136c0-7.865-6.383-14.248-14.242-14.248h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.279C156.595,291.286,162.978,297.669,170.835,297.669z"/><path d="M303.256,219.555l-49.85,47.186l-22.704-15.49c-7.221-4.97-17.13-3.098-22.099,4.162c-4.954,7.253-3.09,17.144,4.178,22.099l33.28,22.727c2.718,1.864,5.839,2.772,8.961,2.772c3.96,0,7.888-1.476,10.933-4.356l59.167-56.007c6.382-6.033,6.645-16.096,0.62-22.479C319.686,213.793,309.637,213.529,303.256,219.555z"/><path d="M227.129,322.135h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.271c0,7.865,6.383,14.248,14.24,14.248h56.294c7.859,0,14.242-6.383,14.242-14.248v-56.271C241.371,328.518,234.988,322.135,227.129,322.135z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></span></li>');

            loadHtmlTodolist();

            refreshTodoList();
        }
    }, 5000);
});

function loadHtmlTodolist(){
    $('body').append('<div id="loading_to_do_list"><div class="body_todolist"><section class="container_todolist"><div class="heading"><img class="heading__img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/756881/laptop.svg"><h1 class="heading__title">To-Do List</h1></div><div id="myDIV" class="header_todolist form"><div><label class="form__label" for="todo">~ Today I need to ~</label><input class="form__input" type="text" id="myInput" placeholder="Add your todo here..."><button class="button addBtn" id="btnAddTodo"><span>Submit</span></button></div></div><div><ul id="myUL" class="toDoList"></ul></div></section></div></div>');
}

$(document).on('click', '#nav-icon-todo-list', function() {
    $('#loading_to_do_list').css('visibility', 'visible').css('opacity', 1);
});

$(document).click(function (e) {
    if ($(e.target).is('div.body_todolist')) {
        $('#loading_to_do_list').css('visibility', 'hidden').css('opacity', 0);
    }
});

$("#btnAddTodo").on("keyup change", function(e) {
    if (ev.keyCode == 13) {
        document.getElementById('btnAddTodo').click();
    }
});

$(document).on('click', '#btnAddTodo', function() {
    var text = $("#myInput").val();
    if (text === '') {
        alert("You must write something!");
        return;
    }

    var todo = {};
    todo.text = text;
    todo.date = new Date().toDateString();
    todo.checked = false;

    addTodo(todo);
    refreshTodoList();

    $("#myInput").val('');
});

$(document).on('click', '#myUL', function(ev) {
    var target = ev.target;
    // click Li
    if (target.tagName === 'LI') {
        var t = target.textContent;
        var t = t.substring(0, t.length - 2); // remove x symbol
        var checkStage = (target.classList != 'checked');
        checkedTodo(t, checkStage);

    // Click Close button
    } else if (target.tagName === 'SPAN' && target.classList == 'close') {
        var div = target.parentElement;

        var t = div.textContent; 
        t = t.substring(0, t.length - 2); // remove x symbol
        removeTodo(t);

    // Click Edit button
    } else if(target.tagName === 'SPAN' && target.classList == 'edit') {
        var div = target.parentElement;

        var t = div.textContent; 
        t = t.substring(0, t.length - 2); // remove x symbol
        removeTodo(t);

        var input = document.getElementById('myInput');
        input.value = t;
        input.focus();
    }

    refreshTodoList();
});

// -------------- add todo list to ul ----------------
function refreshTodoList() {
    document.getElementById('myUL').innerHTML = '';
    for (var todo of getLocalTodoList()) {
        createNewTodo(todo);
    }
}

// Create a new list item when clicking on the "Add" button
function createNewTodo(todo) {
    // ------------- show todo
    var li = document.createElement("li");
    var t = document.createTextNode(todo.text);
    li.appendChild(t);

    if (todo.checked) li.classList = 'checked';

    var spanEdit = document.createElement('SPAN');
    var txt1 = document.createTextNode('\u270E');
    spanEdit.className = 'edit';
    spanEdit.appendChild(txt1);
    li.appendChild(spanEdit);

    // Create a "close" button and append it to each list item
    var spanDelete = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    spanDelete.className = "close";
    spanDelete.appendChild(txt);
    li.appendChild(spanDelete);

    document.getElementById("myUL").appendChild(li);
}

// ----------- local storage -------------
function getLocalTodoList() {
    var localList = localStorage.getItem('todolist');
    if (!localList) return [];
    return JSON.parse(localList);
}

function setLocalTodoList(list) {
    localStorage.setItem('todolist', JSON.stringify(list));
}

function checkedTodo(todoText, check) {
    var list = getLocalTodoList();
    for (var t of list) {
        if (t.text == todoText) {
            t.checked = check;
            break;
        }
    }
    setLocalTodoList(list);
}

function removeTodo(todoText) {
    var list = getLocalTodoList();
    for (var t of list) {
        if (t.text == todoText) {
            list.splice(list.indexOf(t), 1);
            break;
        }
    }
    setLocalTodoList(list);
}

function addTodo(todo) {
    var list = getLocalTodoList();

    var alreadyHave = false;
    for (var t of list) {
        if (t.text == todo.text) {
            t = todo;
            alreadyHave = true;
            break;
        }
    }
    if (!alreadyHave) list.push(todo);

    setLocalTodoList(list);
}