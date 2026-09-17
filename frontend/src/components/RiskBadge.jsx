import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function RiskBadge({ risk, probability, showIcon = true, size = 'md' }) {
  const isHighRisk = risk === 'High Risk' || (typeof risk === 'number' && risk === 1);
  const isBorderline = probability !== undefined && probability >= 0.45 && probability <= 0.55;

  const sizeStyles = {
    sm: { padding: '3px 10px', fontSize: '0.75rem', iconSize: 13 },
    md: { padding: '5px 14px', fontSize: '0.85rem', iconSize: 16 },
    lg: { padding: '8px 20px', fontSize: '1rem', iconSize: 20 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  if (isBorderline) {
    return (
      <span
        className="badge"
        style={{
          background: 'var(--warning-bg)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 0 12px rgba(245, 158, 11, 0.2)',
          ...currentSize,
        }}
      >
        {showIcon && <AlertTriangle size={currentSize.iconSize} />}
        <span>Borderline</span>
      </span>
    );
  }

  return (
    <span
      className={`badge ${isHighRisk ? 'badge-high-risk' : 'badge-low-risk'}`}
      style={currentSize}
    >
      {showIcon && (
        isHighRisk ? (
          <ShieldAlert size={currentSize.iconSize} />
        ) : (
          <ShieldCheck size={currentSize.iconSize} />
        )
      )}
      <span>{isHighRisk ? 'High Risk' : 'Low Risk'}</span>
    </span>
  );
}
