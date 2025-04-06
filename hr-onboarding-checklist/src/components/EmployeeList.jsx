import React from 'react';
import { Link } from 'react-router-dom';

function EmployeeList({ employees }) {
  const today = new Date();

  // A helper to determine if an employee's start date is near (e.g., within 7 days)
  const isStartDateNear = (startDate) => {
    const diffDays = (new Date(startDate) - today) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div>
      <h2>Employees</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.id} style={{ backgroundColor: isStartDateNear(emp.startDate) ? '#fffae6' : 'transparent' }}>
            <Link to={`/employee/${emp.id}`}>
              {emp.name} {isStartDateNear(emp.startDate) && <span>(Starting Soon!)</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeeList;
