const https = require('https');
function getPostsWithCallback(callback) {
    https.get('https://typicode.com', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            const posts = JSON.parse(data);
            const sorted = posts.sort((a, b) => b.title.length - a.title.length);
            callback(null, sorted);
        });
    }).on('error', (err) => callback(err, null));
}
function getCommentsWithCallback(callback) {
    https.get('https://typicode.com', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            const comments = JSON.parse(data);
            const sorted = comments.sort((a, b) => a.name.localeCompare(b.name));
            callback(null, sorted);
        });
    }).on('error', (err) => callback(err, null));
}
function getUsersWithPromises() {
    return fetch('https://typicode.com')
        .then(res => res.json())
        .then(users => {
            return users.map(({ id, name, username, email, phone }) => ({ id, name, username, email, phone }));
        });
}
function getTodosWithPromises() {
    return fetch('https://typicode.com')
        .then(res => res.json())
        .then(todos => {
            return todos.filter(todo => !todo.completed);
        });
}
async function getPostsAsync() {
    const res = await fetch('https://typicode.com');
    const posts = await res.json();
    return posts.sort((a, b) => b.title.length - a.title.length);
}
async function getCommentsAsync() {
    const res = await fetch('https://typicode.com');
    const comments = await res.json();
    return comments.sort((a, b) => a.name.localeCompare(b.name));
}
async function getUsersAsync() {
    const res = await fetch('https://typicode.com');
    const users = await res.json();
    return users.map(({ id, name, username, email, phone }) => ({ id, name, username, email, phone }));
}
async function getTodosAsync() {
    const res = await fetch('https://typicode.com');
    const todos = await res.json();
    return todos.filter(todo => !todo.completed);
}
function runTests() {
    console.log("ТЕСТИРОВАНИЕ:");
    getPostsWithCallback((err, posts) => {
        if (err) return console.error(err);
        console.log("\n[Callback] Тест /posts (первые 2 элемента):", posts.slice(0, 2));
    });

    getCommentsWithCallback((err, comments) => {
        if (err) return console.error(err);
        console.log("\n[Callback] Тест /comments (первые 2 элемента):", comments.slice(0, 2));
    });
    getUsersWithPromises()
        .then(users => console.log("\n[Promise] Тест /users (первый элемент):", users[0]))
        .catch(err => console.error(err));

    getTodosWithPromises()
        .then(todos => console.log("\n[Promise] Тест /todos (первые 2 falsy):", todos.slice(0, 2)))
        .catch(err => console.error(err));
    (async () => {
        try {
            console.log("\nЗапуск тестов Async/Await");
            const posts = await getPostsAsync();
            console.log("[Async/Await] Успешно получено постов:", posts.length);

            const todos = await getTodosAsync();
            console.log("[Async/Await] Успешно отфильтровано неоконченных задач:", todos.length);
        } catch (e) {
            console.error(e);
        }
    })();
}

runTests();
