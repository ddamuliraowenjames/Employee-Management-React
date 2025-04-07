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
      name,
      role,
      department,
      startDate,
      tasks: predefinedTasks.map(task => ({ ...task })),
    };

    try {
      const response = await fetch('/employees', {
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
    <div className="card max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Add New Employee
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Job Role
          </label>
          <input
            id="role"
            type="text"
            placeholder="e.g. Software Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            id="department"
            type="text"
            placeholder="e.g. Engineering"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn w-full text-center"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
