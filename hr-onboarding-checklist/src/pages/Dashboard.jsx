import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <Link
          to="/employees"
          className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow flex flex-col items-center transition"
        >
          <span className="text-xl font-semibold">Manage Employees</span>
          <span className="mt-2 text-sm">Add, edit & track onboarding</span>
        </Link>

        <Link
          to="/reports"
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow flex flex-col items-center transition"
        >
          <span className="text-xl font-semibold">Summary Reports</span>
          <span className="mt-2 text-sm">Download CSV / PDF summaries</span>
        </Link>

        <Link
          to="/settings"
          className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow flex flex-col items-center transition"
        >
          <span className="text-xl font-semibold">Settings</span>
          <span className="mt-2 text-sm">Configure your app</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
