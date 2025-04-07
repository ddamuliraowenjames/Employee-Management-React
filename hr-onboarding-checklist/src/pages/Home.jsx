// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';

const Home = () => {
  const [employees, setEmployees] = useState([]);

  // Load employees from JSON‑Server on mount
  useEffect(() => {
    fetch('/employees')
      .then(res => res.json())
      .then(setEmployees)
      .catch(err => console.error('Error fetching employees:', err));
  }, []);

  // Called by EmployeeForm after a successful POST
  const handleAddEmployee = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8 text-center">
        HR Onboarding Checklist
      </h1>

      {/* Add Employee Section */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Add New Employee
        </h2>
        <EmployeeForm onAddEmployee={handleAddEmployee} />
      </div>

      {/* Employee List Section */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Employee List
        </h2>
        <EmployeeList employees={employees} />
      </div>
    </div>
  );
};

export default Home;
