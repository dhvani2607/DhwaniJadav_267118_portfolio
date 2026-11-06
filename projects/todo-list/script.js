/**
 * TaskMate / To-Do List Application
 * College Web Technology Assessment - Practice Project 2
 * Demonstrates: DOM manipulation, event listeners, localStorage persistence, form validation & dynamic filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // DOM Elements
  const todoForm = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority-select');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const itemsLeft = document.getElementById('items-left');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const inputError = document.getElementById('input-error');

  // State
  let currentFilter = 'all';
  let todos = [];

  // Load from localStorage
  const loadTodos = () => {
    try {
      const saved = localStorage.getItem('taskmate_todos');
      if (saved) {
        todos = JSON.parse(saved);
      } else {
        // Initial sample tasks for first-time visitors
        todos = [
          { id: 1, text: 'Review Web Technology college assessment guidelines', priority: 'study', completed: true },
          { id: 2, text: 'Test interactive calculator and practice projects', priority: 'urgent', completed: false },
          { id: 3, text: 'Verify GitHub repository and README documentation', priority: 'normal', completed: false }
        ];
        saveTodos();
      }
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
      todos = [];
    }
  };

  // Save to localStorage
  const saveTodos = () => {
    try {
      localStorage.setItem('taskmate_todos', JSON.stringify(todos));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  // Render Todos to DOM
  const render = () => {
    todoList.innerHTML = '';

    // Filter todos
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    // Toggle empty state
    if (filteredTodos.length === 0) {
      emptyState.classList.add('visible');
    } else {
      emptyState.classList.remove('visible');
    }

    // Populate tasks
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.setAttribute('data-id', todo.id);

      li.innerHTML = `
        <div class="todo-left">
          <button type="button" class="custom-checkbox" aria-label="Toggle task status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
          <span class="todo-text">${escapeHtml(todo.text)}</span>
          <span class="todo-tag tag-${todo.priority}">${todo.priority}</span>
        </div>
        <div class="todo-right">
          <button type="button" class="btn-delete" aria-label="Delete task">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      // Checkbox click event (toggle completed)
      const checkboxBtn = li.querySelector('.custom-checkbox');
      checkboxBtn.addEventListener('click', () => {
        toggleComplete(todo.id);
      });

      // Delete button click event
      const deleteBtn = li.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', () => {
        deleteTodo(todo.id);
      });

      todoList.appendChild(li);
    });

    // Update remaining items count
    const remainingCount = todos.filter(t => !t.completed).length;
    itemsLeft.textContent = `${remainingCount} task${remainingCount === 1 ? '' : 's'} remaining`;
  };

  // Add Todo Handler
  const addTodo = (text, priority) => {
    const trimmed = text.trim();
    if (!trimmed) {
      inputError.classList.add('visible');
      taskInput.focus();
      return;
    }

    inputError.classList.remove('visible');

    const newTodo = {
      id: Date.now(),
      text: trimmed,
      priority: priority,
      completed: false
    };

    todos.unshift(newTodo);
    saveTodos();
    render();
    taskInput.value = '';
    taskInput.focus();
  };

  // Toggle Todo Status
  const toggleComplete = (id) => {
    todos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    saveTodos();
    render();
  };

  // Delete Todo
  const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    render();
  };

  // Clear Completed
  clearCompletedBtn?.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    render();
  });

  // Filter Tabs Event Listeners
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      render();
    });
  });

  // Form Submit Event
  todoForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo(taskInput.value, prioritySelect.value);
  });

  // Clear error on input
  taskInput?.addEventListener('input', () => {
    if (taskInput.value.trim().length > 0) {
      inputError.classList.remove('visible');
    }
  });

  // XSS prevention helper
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Initial load & render
  loadTodos();
  render();
});
