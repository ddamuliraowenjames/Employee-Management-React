// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="container py-20">
      {/* Welcome Banner */}
      <div className="bg-blue-600 text-white rounded-lg p-12 text-center shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Welcome to HR Onboarding App</h1>
        <p className="text-xl opacity-90">
          Streamline your employee onboarding process with ease.  
          Add new hires, track their tasks, and generate reports all in one place.
        </p>
      </div>
    </div>
  );
};

export default Home;
