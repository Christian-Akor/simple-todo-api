async function api(path, options = {}) {
  const res = await fetch(path, Object.assign({ headers: { 'Content-Type': 'application/json' } }, options));
  if (res.status === 204) return null;
  return res.json();
}

function el(tag, props = {}, ...children) {
  const e = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => { if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v); else e.setAttribute(k, v); });
  children.forEach(c => { if (typeof c === 'string') e.appendChild(document.createTextNode(c)); else if (c) e.appendChild(c); });
  return e;
}

async function fetchTodos() {
  const todos = await api('/todos');
  const list = document.getElementById('todos');
  list.innerHTML = '';
  todos.forEach(t => {
    const li = el('li', { class: t.completed ? 'done' : '' },
      el('input', { type: 'checkbox', checked: t.completed, onchange: async () => {
        await api('/todos/' + t.id, { method: 'PUT', body: JSON.stringify({ completed: !t.completed }) });
        fetchTodos();
      }}),
      el('span', {}, t.title),
      el('button', { onclick: async () => { await api('/todos/' + t.id, { method: 'DELETE' }); fetchTodos(); } }, 'Delete')
    );
    list.appendChild(li);
  });
}

document.getElementById('new-todo-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  if (!title) return;
  await api('/todos', { method: 'POST', body: JSON.stringify({ title }) });
  document.getElementById('title').value = '';
  fetchTodos();
});

fetchTodos();