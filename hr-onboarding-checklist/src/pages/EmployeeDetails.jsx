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
    doc.text(`Employee: ${employee.name} — ${employee.role}`, 10, 10);
    let y = 20;
    employee.tasks.forEach(t => {
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

  return (
    <div className="container py-8 space-y-8">
      {/* Employee Info */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Employee Details
        </h2>

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
              <button
                type="submit"
                className="btn bg-green-500 hover:bg-green-600 w-full"
              >
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
              className="btn bg-blue-500 hover:bg-blue-600"
            >
              Edit Employee Info
            </button>
          </div>
        )}
      </div>

      {/* Onboarding Checklist */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Onboarding Checklist
        </h3>
        <ul className="space-y-3 mb-6">
          {employee.tasks.map(t => (
            <li
              key={t.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              <span
                className={`font-medium ${
                  t.status === 'Completed'
                    ? 'text-green-600'
                    : t.status === 'In progress'
                    ? 'text-orange-600'
                    : 'text-gray-800'
                }`}
              >
                {t.title}
              </span>
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

        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Add Custom Task</h4>
          <NewTaskForm onAddTask={handleAddTask} />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={exportCSV}
            className="btn bg-indigo-500 hover:bg-indigo-600"
          >
            Export as CSV
          </button>
          <button
            onClick={exportPDF}
            className="btn bg-red-500 hover:bg-red-600"
          >
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
