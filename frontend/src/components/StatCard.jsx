import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'indigo' }) {
  const colorMap = {
    indigo: {
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.05) 100%)',
      border: 'rgba(99, 102, 241, 0.25)',
      iconBg: 'rgba(99, 102, 241, 0.2)',
      iconColor: '#818cf8',
    },
    emerald: {
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.05) 100%)',
      border: 'rgba(16, 185, 129, 0.25)',
      iconBg: 'rgba(16, 185, 129, 0.2)',
      iconColor: '#34d399',
    },
    rose: {
      gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(225, 29, 72, 0.05) 100%)',
      border: 'rgba(244, 63, 94, 0.25)',
      iconBg: 'rgba(244, 63, 94, 0.2)',
      iconColor: '#fb7185',
    },
    amber: {
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)',
      border: 'rgba(245, 158, 11, 0.25)',
      iconBg: 'rgba(245, 158, 11, 0.2)',
      iconColor: '#fbbf24',
    },
    cyan: {
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(8, 145, 178, 0.05) 100%)',
      border: 'rgba(6, 182, 212, 0.25)',
      iconBg: 'rgba(6, 182, 212, 0.2)',
      iconColor: '#22d3ee',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        background: scheme.gradient,
        borderColor: scheme.border,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '130px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: scheme.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={19} color={scheme.iconColor} />
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {value}
        </div>
        {(subtitle || trend) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '0.78rem' }}>
            {trend && (
              <span style={{ color: trend.startsWith('+') ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                {trend}
              </span>
            )}
            {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
