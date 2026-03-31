import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ResumeUpload from './components/ResumeUpload';
import CareerCopilot from './components/CareerCopilot';
import JobMatching from './components/JobMatching';
import VersionHistory from './components/VersionHistory';

function App() {
  const [user, setUser] = useState(null);
  const [activeResume, setActiveResume] = useState(null);

  return (
    <Router>
      <div className="min-h-screen relative flex flex-col">
        <Navbar user={user} setUser={setUser} />

        <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard activeResume={activeResume} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<ResumeUpload setActiveResume={setActiveResume} />} />
            <Route path="/copilot" element={<CareerCopilot activeResume={activeResume} />} />
            <Route path="/jobs" element={<JobMatching activeResume={activeResume} />} />
            <Route path="/history" element={<VersionHistory />} />
          </Routes>
        </main>

        <footer className="py-6 text-center text-gray-400 text-sm border-t border-white/10 glass mt-auto">
          &copy; 2026 AI Resume Analyzer & Career Copilot. Powered by AG-AI.
        </footer>
      </div>
    </Router>
  );
}

export default App;
