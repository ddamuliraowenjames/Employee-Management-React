// src/components/EmployeeForm.jsx
import React, { useState } from 'react';
import { predefinedTasks } from '../data/predefinedTasks';

function EmployeeForm({ onAddEmployee }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmployee = {
      // Do not generate ID manually if JSON Server auto-generates it;
      // you can omit the id field, or use Date.now() if preferred.
      name,
      role,
      department,
      startDate,
      tasks: predefinedTasks.map(task => ({ ...task })),
    };

    try {
      const response = await fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) {
        throw new Error('Failed to add employee');
      }
      const savedEmployee = await response.json();
      onAddEmployee(savedEmployee);
      // Reset form fields
      setName('');
      setRole('');
      setDepartment('');
      setStartDate('');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Employee Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      />
      <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <button type="submit">Add Employee</button>
    </form>
  );
}

export default EmployeeForm;
