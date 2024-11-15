import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date');
  const [error, setError] = useState('');

  // Load tasks from local storage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  // Update local storage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const handleAddTask = () => {
    if (taskTitle.trim() === '') {
      setError('Task title is required.');
      return;
    }
    setError(''); // Clear error message
    if (taskTitle.trim()) {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false,
        priority: 'Low',
        date: new Date(),
      };
      setTasks([...tasks, newTask]);
      setTaskTitle('');
    }
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Mark task as completed
  const handleToggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Set priority of a task
  const handlePriorityChange = (id, priority) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  // Filter tasks by search term
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort tasks based on the selected option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortOption) {
      case 'priority':
        return a.priority.localeCompare(b.priority);
      case 'completed':
        return a.completed - b.completed;
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="max-w-md p-4 mx-auto border-2 rounded task-manager">
      <h1 className="mb-4 text-xl font-bold">Task Manager</h1>
      
      {/* Task Input */}
      <input
        type="text"
        placeholder="Add a new task..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className={`border p-2 w-full mb-1 ${error ? 'border-red-500' : 'border-gray-300'}`}
        
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <button
        onClick={handleAddTask}
        className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
      >
        Add Task
      </button>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-2 border"
      />

      {/* Sort Options */}
      <select
        onChange={(e) => setSortOption(e.target.value)}
        className="w-full p-2 mb-4 border"
      >
        <option value="date">Sort by Date</option>
        <option value="priority">Sort by Priority</option>
        <option value="completed">Sort by Completion</option>
      </select>

      {/* Task List */}
      <ul>
        {sortedTasks.map((task) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`task-item p-2 border rounded mb-2 ${task.completed ? 'bg-green-100' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleCompletion(task.id)}
                  className="mr-2"
                />
                <span className={`${task.completed ? 'line-through' : ''}`}>{task.title}</span>
              </div>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
            <div className="flex items-center mt-2">
              <label>Priority:</label>
              <select
                value={task.priority}
                onChange={(e) => handlePriorityChange(task.id, e.target.value)}
                className="p-1 ml-2 border rounded"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default App;
