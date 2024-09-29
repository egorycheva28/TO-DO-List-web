let todoList = document.getElementById('todoList');
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('addButton');
const url = 'http://localhost:5186/api/todo'; // URL для запроса
let list = [];

// Выполнение GET-запроса
fetch(url)
    .then(response => {
        // Проверка, успешен ли ответ
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        return response.json(); // Преобразуем ответ в формат JSON
    })
    .then(data => {
        list = data;
        //console.log(data); // Обработка данных
        data.forEach(task => {
            getTask(task);
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

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
            alert('Не удалось добавить задачу. Попробуйте снова.');
        }
    }
    todoInput.value = "";
    getTasks();
}

async function getTasks() {
    fetch(url)
        /* if (response.ok) { // если HTTP-статус в диапазоне 200-299
             // получаем тело ответа (см. про этот метод ниже)
             let json = await response.json();
           } */
        .then(response => {
            // Проверка, успешен ли ответ
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json(); // Преобразуем ответ в формат JSON
        })
        .then(data => {
            list = data;
            console.log(data); // Обработка данных
            todoList.innerHTML = "";
            data.forEach(task => {
                getTask(task);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

async function getTask(task) {
    let li = document.createElement('li');
    li.innerHTML = task.description;
    li.id = task.id;
    li.setAttribute('data-completed', task.status);
    const status = li.getAttribute('data-completed');
    console.log(status);
    if(status=='true')
    {
        li.classList.toggle('check');
    }
    /*else if(status=='false')
    {
        li.classList.toggle('check');
    }*/

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

todoList.addEventListener('click', async function (event) {
    if (event.target.tagName === 'LI') {
        
        let taskId = event.target.id;
        const status = event.target.getAttribute('data-completed');
        console.log(taskId);
        //patch запрос (не сделано)
        if(status=='true')
        {
            try {
                let response = await fetch(`http://localhost:5186/api/todo/${taskId}/incomplete`, {
                    method: 'PATCH' // Указываем метод PATCH
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            }
            catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось изменить статус задачи. Попробуйте снова.');
            }
        }
        //patch запрос (сделано)
        else if(status=='false')
        {
            try {
                let response = await fetch(`http://localhost:5186/api/todo/${taskId}/complete`, {
                    method: 'PATCH' // Указываем метод PATCH
                });
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            }
            catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось изменить статус задачи. Попробуйте снова.');
            }
        }
        //event.target.classList.toggle('check');
    }
    else if (event.target.tagName === 'SPAN') {
        //delete запрос
        let taskId = event.target.parentElement.id;
        try {
            let response = await fetch(`http://localhost:5186/api/todo/${taskId}`, {
                method: 'DELETE' // Указываем метод DELETE
            });
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
        }
        catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось удалить задачу. Попробуйте снова.');
        }


    }
    else if (event.target.className === 'Edit') {
        let currentLi = event.target.parentElement.parentElement;
        let currentText = currentLi.firstChild.textContent;
        let editedText = prompt("Редактировать дело:", currentText);
        if (editedText !== null && editedText !== '') {
            //put запрос
            let taskId = currentLi.id;
            try {
                let response = await fetch(`http://localhost:5186/api/todo/${taskId}`, {
                    method: 'PUT', // Указываем метод PUT
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
                alert('Не удалось изменить задачу. Попробуйте снова.');
            }
        }

    }
    getTasks();
}, false);

/*function addTask() {
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
});*/






