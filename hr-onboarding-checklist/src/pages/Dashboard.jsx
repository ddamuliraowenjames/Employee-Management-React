// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <p className="text-gray-600">Loading dashboard…</p>
      </div>
    );
  }

  // Summary calculations
  const totalEmployees = employees.length;
  let totalTasks = 0;
  let completedTasks = 0;
  employees.forEach(emp => {
    totalTasks += emp.tasks.length;
    completedTasks += emp.tasks.filter(t => t.status === 'Completed').length;
  });
  const pendingTasks = totalTasks - completedTasks;

  // New hires in last 30 days
  const today = new Date();
  const newHires = employees.filter(emp => {
    const start = new Date(emp.startDate);
    const diffDays = (today - start) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  // Chart data for hires over last 6 months
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return d.toLocaleString('default', { month: 'short' });
  });
  const hiresPerMonth = months.map((_, i) => {
    const monthIndex = new Date().getMonth() - (5 - i);
    const year = new Date().getFullYear() + (monthIndex < 0 ? -1 : 0);
    const month = (monthIndex + 12) % 12;
    return employees.filter(emp => {
      const d = new Date(emp.startDate);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
  });

  const hireChartData = {
    labels: months,
    datasets: [{
      label: 'New Hires',
      data: hiresPerMonth,
      backgroundColor: 'rgba(59,130,246,0.5)',
      borderColor: 'rgba(59,130,246,1)',
      borderWidth: 1,
      tension: 0.4
    }]
  };
  const statusChartData = {
    labels: ['Pending', 'Completed'],
    datasets: [{
      label: 'Tasks',
      data: [pendingTasks, completedTasks],
      backgroundColor: ['rgba(251,191,36,0.8)', 'rgba(34,197,94,0.8)']
    }]
  };

  return (
    <div className="container relative pt-12 pb-8">
      <h1 className="text-3xl font-semibold text-gray-800 text-center mb-8">
        Dashboard
      </h1>

      {/* Quick Access Tabs */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <Link
          to="/employees"
          className="w-28 h-10 flex items-center justify-center text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow"
        >
          Employees
        </Link>
        <Link
          to="/reports"
          className="w-28 h-10 flex items-center justify-center text-sm bg-green-600 hover:bg-green-700 text-white rounded-md shadow"
        >
          Reports
        </Link>
        <Link
          to="/settings"
          className="w-28 h-10 flex items-center justify-center text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow"
        >
          Settings
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <h2 className="text-lg font-medium">Total Employees</h2>
          <p className="text-2xl font-bold">{totalEmployees}</p>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-medium">Pending Tasks</h2>
          <p className="text-2xl font-bold">{pendingTasks}</p>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-medium">Completed Tasks</h2>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-medium">New Hires (30d)</h2>
          <p className="text-2xl font-bold">{newHires}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Hires Over Time</h3>
          <Line data={hireChartData} />
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Task Status Breakdown</h3>
          <Bar data={statusChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
