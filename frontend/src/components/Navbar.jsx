import React from 'react';
import { useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, Database } from 'lucide-react';

export default function Navbar({ backendStatus = true }) {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return { title: 'Executive Risk Dashboard', subtitle: 'Real-time overview of portfolio credit risk and ML performance' };
      case '/assess':
        return { title: 'Credit Risk Assessment', subtitle: 'Evaluate loan applicants using Logistic Regression with instant LIME explanation' };
      case '/lime':
        return { title: 'LIME Explainability Lab', subtitle: 'Local Interpretable Model-agnostic Explanations for individual credit decisions' };
      case '/performance':
        return { title: 'Model Performance & Benchmark', subtitle: 'Comparative evaluation between Logistic Regression and Random Forest' };
      case '/profiles':
        return { title: 'Customer Profiles & Audit History', subtitle: 'Explore benchmark personas and historical risk assessments' };
      case '/about':
        return { title: 'Academic Project & Viva Reference', subtitle: 'System architecture, methodology, formulas, and defense cheat sheet' };
      default:
        return { title: 'Credit Risk Assessment', subtitle: 'Explainable AI System' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '20px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', margin: 0 }}>
          {title}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0 }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '20px',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid var(--border-color)',
            fontSize: '0.82rem',
          }}
        >
          <Database size={15} color="#818cf8" />
          <span style={{ color: 'var(--text-muted)' }}>Dataset:</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>1,000 Loans</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '20px',
            background: backendStatus ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${backendStatus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.82rem',
          }}
        >
          <span className={`status-dot ${backendStatus ? 'status-dot-online' : 'status-dot-offline'}`}></span>
          <span style={{ color: backendStatus ? '#34d399' : '#f87171', fontWeight: 600 }}>
            {backendStatus ? 'API Connected' : 'Connecting to API...'}
          </span>
        </div>
      </div>
    </header>
  );
}
