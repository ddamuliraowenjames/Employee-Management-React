// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';

function Home() {
  const [employees, setEmployees] = useState([]);

  // Load employees from JSON Server on mount
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch('http://localhost:5000/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    }
    fetchEmployees();
  }, []);

  // Add new employee to state
  const handleAddEmployee = (newEmployee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        HR Onboarding Checklist
      </h1>

      {/* Add Employee Section */}
      <section className="bg-gray-50 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Employee
        </h2>
        <EmployeeForm onAddEmployee={handleAddEmployee} />
      </section>

      {/* Employee List Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Employee List
        </h2>
        <EmployeeList employees={employees} />
      </section>
    </div>
  );
}

export default Home;
