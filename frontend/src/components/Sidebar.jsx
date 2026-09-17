import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  BrainCircuit,
  BarChart3,
  Users,
  Info,
  Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/assess', label: 'Credit Assessment', icon: ShieldAlert },
    { path: '/lime', label: 'LIME Explainability', icon: BrainCircuit },
    { path: '/performance', label: 'Model Performance', icon: BarChart3 },
    { path: '/profiles', label: 'Profiles & History', icon: Users },
    { path: '/about', label: 'About & Viva Guide', icon: Info },
  ];

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
          }}
        >
          <Sparkles size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
            CreditRisk<span style={{ color: '#818cf8' }}>AI</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            LIME Explainable AI
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 16px',
                borderRadius: '9px',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} color={isActive ? '#818cf8' : '#94a3b8'} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div
        style={{
          padding: '18px 20px',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="status-dot status-dot-online"></span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            FastAPI Backend Live
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
          German Credit Dataset (UCI)
        </p>
      </div>
    </aside>
  );
}
