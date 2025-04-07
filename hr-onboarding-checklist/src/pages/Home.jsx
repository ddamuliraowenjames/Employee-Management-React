// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  const renderUrl = 'https://employee-management-react-j7lg.onrender.com';

  return (
    <div className="container py-20 space-y-12">
      {/* Welcome Banner */}
      <div className="bg-blue-600 text-white rounded-lg p-12 text-center shadow-lg space-y-6">
        <h1 className="text-5xl font-bold">Welcome to HR Onboarding App</h1>
        <p className="text-xl opacity-90">
          Streamline your employee onboarding process with ease.<br/>
          Add new hires, track their tasks, and generate reports all in one place.
        </p>
        <div className="bg-yellow-100 text-yellow-800 rounded-md p-4 inline-block">
          <p>
            Note: The live app on Render supports full dynamic features (task management, archiving, reports). 
            GitHub Pages is static only.
          </p>
        </div>
        <a
          href={renderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-green-600 transition"
        >
          Click here to Visit Live App
        </a>
      </div>
    </div>
  );
};

export default Home;
