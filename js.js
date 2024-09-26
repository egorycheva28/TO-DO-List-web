let todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');

function addTask() {
    if (todoInput.value === '') {
        alert("Введите дело");
    }
    else {
        let li = document.createElement('li');
        li.innerHTML = todoInput.value;

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
    todoInput.value = "";
}

todoList.addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        event.target.classList.toggle('check');
    }
    else if (event.target.tagName === 'SPAN') {
        event.target.parentElement.remove();
    }
    else if (event.target.className === 'Edit') {
        let currentLi = event.target.parentElement.parentElement;
        let currentText = currentLi.firstChild.textContent;
        let editedText = prompt("Редактировать дело:", currentText);
        if (editedText !== null && editedText !== '') {
            currentLi.firstChild.textContent = editedText;
        }
    }
}, false);

const downloadJSON = (todoList, name) => {
    const dataUri = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(todoList));
    const element = document.createElement('a');
    element.href = dataUri;
    element.download = `${name}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function save() {
    const tasks = Array.from(todoList.children).map(li => {
        return {
            text: li.firstChild.textContent,
            status: li.classList.contains('check')
        };
    });
    downloadJSON(tasks, 'TO-DO List');
}

openFile.addEventListener('change', function () {
    const reader = new FileReader();
    reader.onload = function (event) {
        const text = event.target.result;
        const json = JSON.parse(text);

        todoList.innerHTML = '';

        json.forEach(task => {
            let li = document.createElement('li');
            li.innerHTML = task.text;

            if (task.status) {
                li.classList.add('check');
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
        });
    };

    reader.readAsText(openFile.files[0]);
});






