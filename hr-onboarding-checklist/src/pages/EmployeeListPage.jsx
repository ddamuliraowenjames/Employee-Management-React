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
        const res = await fetch('http://localhost:5000/employees');
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
      const res = await fetch('http://localhost:5000/employees', {
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
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Employees
      </h1>

      {/* Add Employee Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Employee
        </h2>
        <EmployeeForm onAddEmployee={handleAddEmployee} />
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded-lg p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              flex items-center justify-between p-4 border rounded-lg transition 
              ${isUpcoming(emp.startDate) ? 'bg-yellow-100' : 'bg-white'}
              hover:shadow
            `}
          >
            <div>
              <Link to={`/employee/${emp.id}`} className="text-blue-600 font-medium hover:underline">
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
