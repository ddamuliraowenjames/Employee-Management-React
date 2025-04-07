// src/pages/EmployeeListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeForm from '../components/EmployeeForm';

const PAGE_SIZE = 20;

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Load a page of employees
  const loadPage = async (pageNum) => {
    const res = await fetch(`/employees?_page=${pageNum}&_limit=${PAGE_SIZE}`);
    const data = await res.json();
    const total = parseInt(res.headers.get('X-Total-Count'), 10);
    setEmployees(data);
    setTotalCount(total);
    setPage(pageNum);
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  const handleAddEmployee = async (newEmp) => {
    await fetch('/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newEmp, archived: false }),
    });
    setShowModal(false);
    loadPage(1);
  };

  const handleArchiveSelected = async () => {
    await Promise.all(
      selectedIds.map(id => {
        const emp = employees.find(e => e.id === id);
        return fetch(`/employees/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...emp, archived: true }),
        });
      })
    );
    setSelectedIds([]);
    loadPage(1);
  };

  const toggleArchive = async (id, archived) => {
    const emp = employees.find(e => e.id === id);
    await fetch(`/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...emp, archived: !archived }),
    });
    loadPage(page);
  };

  const toggleSelect = id =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  const toggleSelectAll = () => {
    const ids = employees.map(e => e.id);
    setSelectedIds(prev =>
      prev.length === ids.length ? [] : ids
    );
  };

  const isUpcoming = date => {
    const diff = (new Date(date) - new Date()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  const filtered = employees.filter(emp => {
    const matchesName = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus
      ? emp.tasks.some(t => t.status === filterStatus)
      : true;
    return matchesName && matchesStatus;
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="container py-12 space-y-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Employee List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn bg-blue-600 hover:bg-blue-700 text-white"
        >
          + Add Employee
        </button>
      </div>

      {/* Filters & Bulk Actions */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Statuses</option>
              <option value="Not started">Not started</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={handleArchiveSelected}
              className="btn bg-red-600 hover:bg-red-700 text-white"
            >
              Archive Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Employee Table */}
      <div className="card p-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={selectedIds.length === employees.length && employees.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-2 border text-left">Name</th>
              <th className="px-4 py-2 border text-left">Role</th>
              <th className="px-4 py-2 border text-left">Department</th>
              <th className="px-4 py-2 border text-left">Start Date</th>
              <th className="px-4 py-2 border text-left">Status</th>
              <th className="px-4 py-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => toggleSelect(emp.id)}
                  />
                </td>
                <td className="px-4 py-2 border">{emp.name}</td>
                <td className="px-4 py-2 border">{emp.role}</td>
                <td className="px-4 py-2 border">{emp.department}</td>
                <td className="px-4 py-2 border">{emp.startDate}</td>
                <td className="px-4 py-2 border">
                  {emp.archived
                    ? <span className="text-red-600 font-semibold">Archived</span>
                    : <span className="text-green-600 font-semibold">Active</span>
                  }
                </td>
                <td className="px-4 py-2 border">
                  <div className="flex space-x-2">
                    <Link
                      to={`/employee/${emp.id}`}
                      className="btn bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 text-sm"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => toggleArchive(emp.id, emp.archived)}
                      className={`btn px-3 py-1 text-sm text-white ${
                        emp.archived ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {emp.archived ? 'Unarchive' : 'Archive'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => loadPage(page - 1)}
            className="btn bg-gray-300 hover:bg-gray-400"
          >
            Prev
          </button>
          <span>Page {page} of {totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 1}</span>
          <button
            disabled={page === Math.ceil(totalCount / PAGE_SIZE)}
            onClick={() => loadPage(page + 1)}
            className="btn bg-gray-300 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <EmployeeForm onAddEmployee={handleAddEmployee} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;
