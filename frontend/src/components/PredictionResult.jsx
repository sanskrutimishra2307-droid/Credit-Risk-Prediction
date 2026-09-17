import React from 'react';
import RiskBadge from './RiskBadge';
import LimeChart from './LimeChart';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertCircle, FileText, BarChart2 } from 'lucide-react';

export default function PredictionResult({ result }) {
  if (!result) return null;

  const { id, prediction, probability, confidence, probabilities, explanation, input_data } = result;
  const isHighRisk = prediction === 'High Risk';
  const probHigh = probability || probabilities?.high_risk || 0;
  const probLow = probabilities?.low_risk || (1 - probHigh);

  // Lending policy recommendation based on prediction and risk probability
  const getRecommendation = () => {
    if (probHigh < 0.3) {
      return {
        action: 'Approve Loan (Auto-pass)',
        description: 'Standard interest rate, no exceptional collateral required.',
        icon: CheckCircle2,
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
      };
    } else if (probHigh < 0.5) {
      return {
        action: 'Conditional Approval',
        description: 'Standard credit terms; recommend automated recurring debit schedule.',
        icon: ShieldCheck,
        color: '#34d399',
        bg: 'rgba(52, 211, 153, 0.1)',
      };
    } else if (probHigh < 0.7) {
      return {
        action: 'Manual Underwriter Review',
        description: 'Risk factors require senior credit officer verification and co-signer.',
        icon: AlertCircle,
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
      };
    } else {
      return {
        action: 'Decline / High Risk Escalation',
        description: 'Risk score exceeds tolerance limit. Adverse action notice required.',
        icon: XCircle,
        color: '#f43f5e',
        bg: 'rgba(244, 63, 94, 0.1)',
      };
    }
  };

  const rec = getRecommendation();
  const RecIcon = rec.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner Result Card */}
      <div
        className="glass-card"
        style={{
          background: isHighRisk
            ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(17, 24, 39, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(17, 24, 39, 0.9) 100%)',
          borderColor: isHighRisk ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.35)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Assessment ID: #{id}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              <RiskBadge risk={prediction} size="lg" />
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                Classification: {prediction}
              </span>
            </div>
          </div>

          {/* Probability Metric */}
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Model Confidence</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {confidence.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Probability Dual Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>
              Low Risk P(Good): {(probLow * 100).toFixed(1)}%
            </span>
            <span style={{ color: '#fb7185', fontWeight: 600 }}>
              High Risk P(Bad): {(probHigh * 100).toFixed(1)}%
            </span>
          </div>
          <div
            style={{
              height: '10px',
              width: '100%',
              borderRadius: '9999px',
              background: '#334155',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <div
              style={{
                width: `${probLow * 100}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                transition: 'width 0.6s ease',
              }}
            />
            <div
              style={{
                width: `${probHigh * 100}%`,
                background: 'linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Financial Action Recommendation */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px 16px',
            borderRadius: '10px',
            background: rec.bg,
            border: `1px solid ${rec.color}40`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <RecIcon size={24} color={rec.color} />
          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Lending Recommendation: {rec.action}
            </h5>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, marginTop: '2px' }}>
              {rec.description}
            </p>
          </div>
        </div>
      </div>

      {/* Applicant Profile Snapshot */}
      {input_data && (
        <div className="glass-card" style={{ padding: '18px 24px' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="#818cf8" />
            Applicant Profile Parameters
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Age / Sex</span>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                {input_data.age} yrs ({input_data.sex})
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Loan Amount</span>
              <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
                {input_data.credit_amount?.toLocaleString()} DM
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Duration</span>
              <div style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>
                {input_data.duration} months
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Checking Acc</span>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>
                {input_data.checking_account}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Savings</span>
              <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, textTransform: 'capitalize' }}>
                {input_data.saving_accounts}
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Purpose</span>
              <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600, textTransform: 'capitalize' }}>
                {input_data.purpose}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIME Local Explanation Chart Card */}
      <div className="glass-card">
        <LimeChart explanation={explanation} />
      </div>
    </div>
  );
}
