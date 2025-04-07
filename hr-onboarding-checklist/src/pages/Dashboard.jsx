// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container py-12 text-center">
      <h1 className="text-4xl mb-8">Dashboard</h1>

      <div className="flex flex-wrap justify-center gap-8">
        <Link
          to="/employees"
          className="card w-64 flex flex-col items-center px-6 py-8 transition-colors duration-200 hover:bg-blue-50"
        >
          <span className="text-2xl font-semibold mb-2">Manage Employees</span>
          <span className="text-sm text-gray-600">
            Add, edit &amp; track onboarding
          </span>
        </Link>

        <Link
          to="/reports"
          className="card w-64 flex flex-col items-center px-6 py-8 transition-colors duration-200 hover:bg-green-50"
        >
          <span className="text-2xl font-semibold mb-2">Summary Reports</span>
          <span className="text-sm text-gray-600">
            Download CSV / PDF summaries
          </span>
        </Link>

        <Link
          to="/settings"
          className="card w-64 flex flex-col items-center px-6 py-8 transition-colors duration-200 hover:bg-purple-50"
        >
          <span className="text-2xl font-semibold mb-2">Settings</span>
          <span className="text-sm text-gray-600">
            Configure your app
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
