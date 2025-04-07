// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { predefinedTasks as defaultTasks } from '../data/predefinedTasks';

const Settings = () => {
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  // API endpoint state
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('apiUrl') || '/');
  // Departments lookup
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');
  // Predefined tasks lookup
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  // Feedback message
  const [message, setMessage] = useState('');

  // Load settings & lookups on mount
  useEffect(() => {
    // Theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
    // Departments
    const storedDeps = JSON.parse(localStorage.getItem('departments') || '[]');
    setDepartments(storedDeps.length ? storedDeps : []);
    // Tasks
    const storedTasks = JSON.parse(localStorage.getItem('predefinedTasks') || '[]');
    setTasks(storedTasks.length ? storedTasks : defaultTasks.map(t => t.title));
  }, []); // eslint-disable-line

  // Persist theme whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handlers for saving API URL
  const handleSaveApi = () => {
    localStorage.setItem('apiUrl', apiUrl);
    setMessage('API URL saved.');
    setTimeout(() => setMessage(''), 3000);
  };

  // Handlers for departments
  const addDepartment = () => {
    if (!newDept.trim()) return;
    const updated = [...departments, newDept.trim()];
    setDepartments(updated);
    localStorage.setItem('departments', JSON.stringify(updated));
    setNewDept('');
  };
  const removeDepartment = (dep) => {
    const updated = departments.filter(d => d !== dep);
    setDepartments(updated);
    localStorage.setItem('departments', JSON.stringify(updated));
  };

  // Handlers for tasks
  const addTask = () => {
    if (!newTask.trim()) return;
    const updated = [...tasks, newTask.trim()];
    setTasks(updated);
    localStorage.setItem('predefinedTasks', JSON.stringify(updated));
    setNewTask('');
  };
  const removeTask = (t) => {
    const updated = tasks.filter(task => task !== t);
    setTasks(updated);
    localStorage.setItem('predefinedTasks', JSON.stringify(updated));
  };

  // Reset all settings
  const handleReset = () => {
    localStorage.removeItem('theme');
    localStorage.removeItem('apiUrl');
    localStorage.removeItem('departments');
    localStorage.removeItem('predefinedTasks');
    setTheme('light');
    setApiUrl('/');
    setDepartments([]);
    setTasks(defaultTasks.map(t => t.title));
    setMessage('Settings reset to defaults.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container py-8 space-y-12">
      <h1 className="text-3xl font-semibold text-gray-800 text-center">
        Settings
      </h1>

      {/* Theme */}
      <div className="card max-w-md mx-auto">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Theme</h2>
        <div className="flex items-center space-x-6">
          {['light', 'dark'].map(mode => (
            <label key={mode} className="inline-flex items-center space-x-2">
              <input
                type="radio"
                name="theme"
                value={mode}
                checked={theme === mode}
                onChange={() => setTheme(mode)}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="capitalize">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* API Endpoint */}
      <div className="card max-w-md mx-auto">
        <h2 className="text-xl font-medium text-gray-700 mb-4">API Endpoint</h2>
        <input
          type="text"
          value={apiUrl}
          onChange={e => setApiUrl(e.target.value)}
          placeholder="e.g. https://api.example.com/"
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSaveApi}
          className="btn bg-blue-600 hover:bg-blue-700 w-full"
        >
          Save API URL
        </button>
      </div>

      {/* Lookup Data */}
      <div className="card max-w-2xl mx-auto space-y-6">
        <h2 className="text-xl font-medium text-gray-700">Manage Lookup Data</h2>

        {/* Departments */}
        <div>
          <h3 className="font-semibold mb-2">Departments</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newDept}
              onChange={e => setNewDept(e.target.value)}
              placeholder="New department"
              className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={addDepartment}
              className="btn bg-green-600 hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {departments.map(dep => (
              <li key={dep} className="flex justify-between">
                <span>{dep}</span>
                <button
                  onClick={() => removeDepartment(dep)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
            {departments.length === 0 && (
              <li className="text-gray-500">No departments defined.</li>
            )}
          </ul>
        </div>

        {/* Predefined Tasks */}
        <div>
          <h3 className="font-semibold mb-2">Predefined Tasks</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              placeholder="New task title"
              className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={addTask}
              className="btn bg-green-600 hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {tasks.map(t => (
              <li key={t} className="flex justify-between">
                <span>{t}</span>
                <button
                  onClick={() => removeTask(t)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="text-gray-500">No predefined tasks defined.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Reset & Feedback */}
      <div className="max-w-md mx-auto space-y-4 text-center">
        <button
          onClick={handleReset}
          className="text-sm text-red-600 hover:underline"
        >
          Reset to Defaults
        </button>
        {message && (
          <p className="text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
