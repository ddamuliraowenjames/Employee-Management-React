// src/pages/EmployeeDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NewTaskForm from '../components/NewTaskForm';
import { jsPDF } from 'jspdf';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    department: '',
    startDate: ''
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskPage, setTaskPage] = useState(1);
  const TASK_PAGE_SIZE = 5;

  // Fetch employee on mount
  useEffect(() => {
    fetch(`/employees/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Employee not found');
        return res.json();
      })
      .then(data => {
        setEmployee(data);
        setEditForm({
          name: data.name,
          role: data.role,
          department: data.department,
          startDate: data.startDate
        });
      })
      .catch(err => {
        console.error(err);
        navigate('/');
      });
  }, [id, navigate]);

  // Persist updates
  const updateEmployeeData = async (updated) => {
    try {
      const res = await fetch(`/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      setEmployee(data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateEmployeeData({
      ...employee,
      tasks: employee.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    });
  };

  const handleAddTask = (title) => {
    const newTask = { id: Date.now(), title, status: 'Not started' };
    updateEmployeeData({ ...employee, tasks: [...employee.tasks, newTask] });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateEmployeeData({ ...employee, ...editForm });
  };

  const exportCSV = () => {
    let csv = 'data:text/csv;charset=utf-8,Task Title,Status\n';
    employee.tasks.forEach(t => {
      csv += `${t.title},${t.status}\n`;
    });
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `${employee.name}_tasks.csv`;
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Employee: ${employee.name} — ${employee.role}`, 10, 10);
    let y = 20;
    doc.setFontSize(12);
    employee.tasks.forEach(t => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      let color;
      if (t.status === 'Completed') color = [0, 128, 0];
      else if (t.status === 'In progress') color = [255, 165, 0];
      else color = [0, 0, 0];
      doc.setTextColor(...color);
      doc.text(`${t.title} — ${t.status}`, 10, y);
      y += 10;
    });
    doc.save(`${employee.name}_tasks.pdf`);
  };

  if (!employee) {
    return (
      <div className="container py-8 text-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  // Progress calculation
  const totalTasks = employee.tasks.length;
  const completedCount = employee.tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Paginate tasks
  const totalTaskPages = Math.ceil(employee.tasks.length / TASK_PAGE_SIZE);
  const pagedTasks = employee.tasks.slice(
    (taskPage - 1) * TASK_PAGE_SIZE,
    taskPage * TASK_PAGE_SIZE
  );

  return (
    <div className="container py-8 space-y-8">
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button onClick={exportCSV} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
          Export CSV
        </button>
        <button onClick={exportPDF} className="btn bg-red-500 hover:bg-red-600 text-white">
          Export PDF
        </button>
        <button onClick={() => setShowTaskModal(true)} className="btn bg-green-500 hover:bg-green-600 text-white">
          Add Task
        </button>
      </div>

      {/* Employee Info */}
      <div className="card p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employee Details</h2>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <input
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              required
            />
            <input
              name="role"
              value={editForm.role}
              onChange={handleEditChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Role"
              required
            />
            <input
              name="department"
              value={editForm.department}
              onChange={handleEditChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Department"
              required
            />
            <input
              type="date"
              name="startDate"
              value={editForm.startDate}
              onChange={handleEditChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <div className="flex space-x-4">
              <button type="submit" className="btn bg-green-500 hover:bg-green-600 w-full">
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn bg-gray-300 hover:bg-gray-400 text-gray-800 w-full"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 mb-6">
            <p><span className="font-semibold">Name:</span> {employee.name}</p>
            <p><span className="font-semibold">Role:</span> {employee.role}</p>
            <p><span className="font-semibold">Department:</span> {employee.department}</p>
            <p><span className="font-semibold">Start Date:</span> {employee.startDate}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Edit Employee Info
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Onboarding Progress</h3>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
          <div className="bg-blue-600 h-4" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="text-sm">{progressPercent}% completed</p>
      </div>

      {/* Paginated Onboarding Checklist */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Onboarding Checklist</h3>
        <ul className="space-y-3">
          {pagedTasks.map(t => (
            <li
              key={t.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow-sm ${
                t.status === 'Completed'
                  ? 'bg-green-50'
                  : t.status === 'In progress'
                  ? 'bg-yellow-50'
                  : 'bg-white'
              }`}
            >
              <span className="font-medium">{t.title}</span>
              <select
                value={t.status}
                onChange={e => handleStatusChange(t.id, e.target.value)}
                className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
            </li>
          ))}
        </ul>

        {/* Task Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={taskPage === 1}
            onClick={() => setTaskPage(tp => tp - 1)}
            className="btn bg-gray-300 hover:bg-gray-400"
          >
            Prev
          </button>
          <span>
            Page {taskPage} of {totalTaskPages}
          </span>
          <button
            disabled={taskPage === totalTaskPages}
            onClick={() => setTaskPage(tp => tp + 1)}
            className="btn bg-gray-300 hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
            <NewTaskForm
              onAddTask={(title) => {
                handleAddTask(title);
                setShowTaskModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
