// src/pages/EmployeeListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch employees on mount
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch('/employees');
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEmployees();
  }, []);

  // Add a new employee
  const handleAddEmployee = async (newEmp) => {
    try {
      const res = await fetch('/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp),
      });
      const saved = await res.json();
      setEmployees(prev => [...prev, saved]);
    } catch (err) {
      console.error('Failed to add:', err);
    }
  };

  // Check if start date is within next 7 days
  const isUpcoming = (startDate) => {
    const today = new Date();
    const diff = (new Date(startDate) - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  // Apply search & filter
  const filtered = employees.filter(emp => {
    const matchesName = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus
      ? emp.tasks.some(t => t.status === filterStatus)
      : true;
    return matchesName && matchesStatus;
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Manage Employees
      </h1>

      {/* Add Employee Form */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Add New Employee
        </h2>
        <EmployeeForm onAddEmployee={handleAddEmployee} />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-6 mb-6">
        <input
          type="text"
          placeholder="Search by name…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Statuses</option>
          <option value="Not started">Not started</option>
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Employee List */}
      <ul className="space-y-4">
        {filtered.map(emp => (
          <li
            key={emp.id}
            className={`
              card flex items-center justify-between
              ${isUpcoming(emp.startDate) ? 'bg-yellow-100' : 'bg-white'}
            `}
          >
            <div>
              <Link
                to={`/employee/${emp.id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                {emp.name}
              </Link>
              <span className="ml-2 text-sm text-gray-500">({emp.role})</span>
            </div>
            {isUpcoming(emp.startDate) && (
              <span className="text-xs text-red-600 font-semibold">
                Starting Soon!
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeListPage;
