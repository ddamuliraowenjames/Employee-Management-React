// src/pages/Reports.jsx
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const PAGE_SIZE = 10;

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startFrom, setStartFrom] = useState('');
  const [startTo, setStartTo] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch('/employees')
      .then(res => res.json())
      .then(setEmployees)
      .catch(console.error);
  }, []);

  // Filtered list
  const filtered = employees.filter(emp => {
    const matchesName = emp.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department ? emp.department === department : true;
    const matchesStatus = statusFilter
      ? emp.tasks.some(t => t.status === statusFilter)
      : true;
    const hireDate = new Date(emp.startDate);
    const fromOK = startFrom ? hireDate >= new Date(startFrom) : true;
    const toOK = startTo ? hireDate <= new Date(startTo) : true;
    return matchesName && matchesDept && matchesStatus && fromOK && toOK;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Summary metrics (based on filtered)
  const totalEmployees = filtered.length;
  const totalTasks = filtered.reduce((sum, e) => sum + e.tasks.length, 0);
  const completedTasks = filtered.reduce(
    (sum, e) => sum + e.tasks.filter(t => t.status === 'Completed').length,
    0
  );
  const pendingTasks = totalTasks - completedTasks;

  // Export full report
  const exportCSV = () => {
    let csv = 'data:text/csv;charset=utf-8,Name,Role,Department,Start Date,Completed,Pending\n';
    filtered.forEach(e => {
      const done = e.tasks.filter(t => t.status === 'Completed').length;
      const pend = e.tasks.length - done;
      csv += `${e.name},${e.role},${e.department},${e.startDate},${done},${pend}\n`;
    });
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = 'employee_report.csv';
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Employee Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Total Employees: ${totalEmployees}`, 14, 30);
    doc.text(`Total Tasks: ${totalTasks}`, 14, 36);
    doc.text(`Completed Tasks: ${completedTasks}`, 14, 42);
    doc.text(`Pending Tasks: ${pendingTasks}`, 14, 48);

    let y = 60;
    doc.setFontSize(14);
    doc.text('Details:', 14, y);
    y += 6;
    doc.setFontSize(10);
    filtered.forEach(e => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const done = e.tasks.filter(t => t.status === 'Completed').length;
      const pend = e.tasks.length - done;
      doc.text(
        `${e.name} | ${e.role} | ${e.department} | ${e.startDate} | ✔️${done} ⏳${pend}`,
        14,
        y
      );
      y += 6;
    });
    doc.save('employee_report.pdf');
  };

  // Export individual employee
  const exportEmployeeCSV = e => {
    let csv = 'data:text/csv;charset=utf-8,Task Title,Status\n';
    e.tasks.forEach(t => {
      csv += `${t.title},${t.status}\n`;
    });
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `${e.name}_tasks.csv`;
    document.body.appendChild(link);
    link.click();
  };

  const exportEmployeePDF = e => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${e.name} — ${e.role}`, 14, 20);
    let y = 30;
    doc.setFontSize(12);
    e.tasks.forEach(t => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      let color;
      if (t.status === 'Completed') color = [0, 128, 0];
      else if (t.status === 'In progress') color = [255, 165, 0];
      else color = [0, 0, 0];
      doc.setTextColor(...color);
      doc.text(`${t.title} — ${t.status}`, 14, y);
      y += 8;
    });
    doc.save(`${e.name}_tasks.pdf`);
  };

  // Unique departments for filter dropdown
  const departments = Array.from(new Set(employees.map(e => e.department)));

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800 text-center">Reports</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Statuses</option>
          <option value="Not started">Not started</option>
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          value={startFrom}
          onChange={e => setStartFrom(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={startTo}
          onChange={e => setStartTo(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <h2 className="text-lg font-medium">Total Employees</h2>
          <p className="text-2xl font-bold">{totalEmployees}</p>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-medium">Total Tasks</h2>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-medium">Completed Tasks</h2>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>
        <div className="card text-center">
          <h2 className="text-lg font-medium">Pending Tasks</h2>
          <p className="text-2xl font-bold">{pendingTasks}</p>
        </div>
      </div>

      {/* Export Full Report */}
      <div className="flex gap-4">
        <button onClick={exportCSV} className="btn bg-indigo-600 hover:bg-indigo-700">
          Export CSV
        </button>
        <button onClick={exportPDF} className="btn bg-red-600 hover:bg-red-700">
          Export PDF
        </button>
      </div>

      {/* Individual Reports */}
      <h2 className="text-2xl font-semibold text-gray-800 mt-8">Individual Reports</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(e => (
            <tr key={e.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{e.name}</td>
              <td className="border px-4 py-2">{e.role}</td>
              <td className="border px-4 py-2">{e.department}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => exportEmployeeCSV(e)}
                  className="btn bg-green-500 hover:bg-green-600 text-sm"
                >
                  CSV
                </button>
                <button
                  onClick={() => exportEmployeePDF(e)}
                  className="btn bg-blue-500 hover:bg-blue-600 text-sm"
                >
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="btn bg-gray-300 hover:bg-gray-400"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="btn bg-gray-300 hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Reports;
