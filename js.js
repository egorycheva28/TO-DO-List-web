let todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const url = 'http://localhost:5186/api/todo'; // URL для запросов
let list = [];

getTasks();

async function getTasks() {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            list = data;
            todoList.innerHTML = "";
            data.forEach(task => {
                getTask(task);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось добавить дело. Попробуйте снова.');
        });
}

async function getTask(task) {
    let li = document.createElement('li');
    li.innerHTML = task.description;
    li.id = task.id;
    li.setAttribute('data-completed', task.status);
    const status = li.getAttribute('data-completed');
    if (status == 'true') {
        li.classList.toggle('check');
    }

    let button = document.createElement('button');
    button.className = 'edit';
    let img = document.createElement('img');
    img.src = 'edit.png';
    img.className = 'Edit';
    button.appendChild(img);
    li.appendChild(button);

    let span = document.createElement('span');
    span.innerHTML = '\u00d7';
    li.appendChild(span);

    todoList.appendChild(li);
}

async function addTask() {
    if (todoInput.value === '') {
        alert("Введите дело");
    }
    else {
        let task = todoInput.value;
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            });
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось добавить дело. Попробуйте снова.');
        }
    }
    todoInput.value = "";
    getTasks();
}

todoList.addEventListener('click', async function (event) {
    if (event.target.tagName === 'LI') {
        let taskId = event.target.id;
        const status = event.target.getAttribute('data-completed');

        if (status == 'true') {
            try {
                let response = await fetch(`http://localhost:5186/api/todo/${taskId}/incomplete`, {
                    method: 'PATCH'
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            }
            catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось изменить статус дела. Попробуйте снова.');
            }
        }
        else if (status == 'false') {
            try {
                let response = await fetch(`http://localhost:5186/api/todo/${taskId}/complete`, {
                    method: 'PATCH'
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            }
            catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось изменить статус дела. Попробуйте снова.');
            }
        }
    }
    else if (event.target.tagName === 'SPAN') {
        let taskId = event.target.parentElement.id;
        try {
            let response = await fetch(`http://localhost:5186/api/todo/${taskId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось удалить дело. Попробуйте снова.');
        }
    }
    else if (event.target.className === 'Edit') {
        let currentLi = event.target.parentElement.parentElement;
        let currentText = currentLi.firstChild.textContent;
        let editedText = prompt("Редактировать дело:", currentText);

        if (editedText !== null && editedText !== '') {
            let taskId = currentLi.id;
            try {
                let response = await fetch(`http://localhost:5186/api/todo/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedText)
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            }
            catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось изменить дело. Попробуйте снова.');
            }
        }
    }
    getTasks();
}, false);