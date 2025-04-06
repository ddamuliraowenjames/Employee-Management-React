// src/components/NewTaskForm.jsx
import React, { useState } from 'react';

function NewTaskForm({ onAddTask }) {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim());
      setTaskTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        placeholder="Enter task title..."
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="border rounded p-2 flex-grow"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add
      </button>
    </form>
  );
}

export default NewTaskForm;
