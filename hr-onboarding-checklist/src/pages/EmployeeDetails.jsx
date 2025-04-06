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

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`http://localhost:5000/employees/${id}`);
        if (!res.ok) throw new Error('Employee not found');
        const data = await res.json();
        setEmployee(data);
        setEditForm({
          name: data.name,
          role: data.role,
          department: data.department,
          startDate: data.startDate
        });
      } catch (err) {
        console.error(err);
        navigate('/');
      }
    }
    fetchEmployee();
  }, [id, navigate]);

  const updateEmployeeData = async (updated) => {
    try {
      const res = await fetch(`http://localhost:5000/employees/${id}`, {
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
    const updated = {
      ...employee,
      tasks: employee.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    };
    updateEmployeeData(updated);
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
    doc.text(`Employee: ${employee.name} - ${employee.role}`, 10, 10);
    let y = 20;
    employee.tasks.forEach(t => {
      let color;
      if (t.status === 'Completed') color = [0, 128, 0];
      else if (t.status === 'In progress') color = [255, 165, 0];
      else color = [0, 0, 0];
      doc.setTextColor(...color);
      doc.text(`${t.title} - ${t.status}`, 10, y);
      y += 10;
    });
    doc.save(`${employee.name}_tasks.pdf`);
  };

  if (!employee) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Employee Details
        </h2>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 mb-6">
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
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {employee.name}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {employee.role}
            </p>
            <p>
              <span className="font-semibold">Department:</span> {employee.department}
            </p>
            <p>
              <span className="font-semibold">Start Date:</span> {employee.startDate}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Edit Employee Info
            </button>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-4 text-gray-700">
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
          <h4 className="font-semibold mb-2 text-gray-700">Add Custom Task</h4>
          <NewTaskForm onAddTask={handleAddTask} />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={exportCSV}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
          >
            Export as CSV
          </button>
          <button
            onClick={exportPDF}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
