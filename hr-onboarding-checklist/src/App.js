import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EmployeeListPage from './pages/EmployeeListPage';
import EmployeeDetails from './pages/EmployeeDetails';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">HR Onboarding App</h1>
          <nav className="space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Dashboard
            </Link>
            <Link to="/employees" className="text-gray-600 hover:text-gray-800">
              Employees
            </Link>
            <Link to="/reports" className="text-gray-600 hover:text-gray-800">
              Reports
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-gray-800">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
