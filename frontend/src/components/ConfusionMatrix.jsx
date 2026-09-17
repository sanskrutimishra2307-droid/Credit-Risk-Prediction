import React from 'react';

export default function ConfusionMatrix({ matrix, modelName = 'Logistic Regression' }) {
  if (!matrix || matrix.length !== 2) {
    return (
      <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
        Confusion matrix not available.
      </div>
    );
  }

  // matrix = [[TN, FP], [FN, TP]]
  // For German Credit: Class 0 = Good (Low Risk), Class 1 = Bad (High Risk)
  const tn = matrix[0][0];
  const fp = matrix[0][1];
  const fn = matrix[1][0];
  const tp = matrix[1][1];

  const total = tn + fp + fn + tp;
  const accuracy = ((tn + tp) / total * 100).toFixed(1);
  const precision = (tp / (tp + fp) * 100).toFixed(1);
  const recall = (tp / (tp + fn) * 100).toFixed(1);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        {/* True Negatives: Correctly predicted Low Risk */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '0.74rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 600 }}>
            True Negative (TN)
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
            {tn}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Actual Good / Predicted Good ({((tn / total) * 100).toFixed(0)}%)
          </span>
        </div>

        {/* False Positives: Type I Error (Good classified as Bad) */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '0.74rem', color: '#fcd34d', textTransform: 'uppercase', fontWeight: 600 }}>
            False Positive (FP - Type I)
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
            {fp}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Actual Good / Predicted Bad ({((fp / total) * 100).toFixed(0)}%)
          </span>
        </div>

        {/* False Negatives: Type II Error (Bad classified as Good - Costly for Banks) */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '0.74rem', color: '#fca5a5', textTransform: 'uppercase', fontWeight: 600 }}>
            False Negative (FN - Type II)
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f87171', margin: '4px 0' }}>
            {fn}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Actual Bad / Predicted Good ({((fn / total) * 100).toFixed(0)}%)
          </span>
        </div>

        {/* True Positives: Correctly identified High Risk */}
        <div
          style={{
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '0.74rem', color: '#c7d2fe', textTransform: 'uppercase', fontWeight: 600 }}>
            True Positive (TP)
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#818cf8', margin: '4px 0' }}>
            {tp}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Actual Bad / Predicted Bad ({((tp / total) * 100).toFixed(0)}%)
          </span>
        </div>
      </div>

      {/* Summary Note */}
      <div
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Test Set Total: <strong style={{ color: '#fff' }}>{total} samples</strong></span>
        <span>Accuracy: <strong style={{ color: '#34d399' }}>{accuracy}%</strong></span>
        <span>Recall: <strong style={{ color: '#818cf8' }}>{recall}%</strong></span>
      </div>
    </div>
  );
}
