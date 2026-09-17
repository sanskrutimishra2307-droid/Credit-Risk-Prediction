import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import LimeExplanation from './pages/LimeExplanation';
import ModelPerformance from './pages/ModelPerformance';
import CustomerProfiles from './pages/CustomerProfiles';
import About from './pages/About';
import api from './api/api';

export default function App() {
  const [activeResult, setActiveResult] = useState(null);
  const [backendStatus, setBackendStatus] = useState(true);

  // Periodic health check
  useEffect(() => {
    async function checkBackend() {
      try {
        const health = await api.checkHealth();
        setBackendStatus(health.status === 'ok');
      } catch (err) {
        setBackendStatus(false);
      }
    }
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Navbar backendStatus={backendStatus} />
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard onSelectPrediction={(record) => setActiveResult(record)} />
              }
            />
            <Route
              path="/assess"
              element={
                <Assessment
                  activeResult={activeResult}
                  setActiveResult={setActiveResult}
                />
              }
            />
            <Route
              path="/lime"
              element={<LimeExplanation activeResult={activeResult} />}
            />
            <Route path="/performance" element={<ModelPerformance />} />
            <Route
              path="/profiles"
              element={
                <CustomerProfiles
                  onSelectPrediction={(record) => setActiveResult(record)}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
