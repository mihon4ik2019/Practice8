let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  const filtered = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'completed') return task.done;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';
    li.innerHTML = `
      <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${index})">
      ${task.text}
      <button onclick="deleteTask(${index})">✖</button>
    `;
    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  const task = { text, done: false };
  tasks.push(task);
  saveTasks();
  renderTasks();
  input.value = '';

  showNotification('Добавлена новая задача');
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function enableNotifications() {
  Notification.requestPermission().then(result => {
    if (result === 'granted') {
      showNotification('Уведомления включены');
    }
  });
}

function showNotification(message) {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        reg.showNotification(message);
      }
    });
  }
}

setInterval(() => {
  const hasActive = tasks.some(t => !t.done);
  if (hasActive) {
    showNotification('Есть невыполненные задачи');
  }
}, 2 * 60 * 60 * 1000); // каждые 2 часа

renderTasks();
