import React, { useState, useEffect } from 'react';
import CustomerForm from '../components/CustomerForm';
import PredictionResult from '../components/PredictionResult';
import api from '../api/api';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export default function Assessment({ activeResult, setActiveResult }) {
  const [sampleProfiles, setSampleProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSamples() {
      try {
        const data = await api.getSampleProfiles();
        setSampleProfiles(data || []);
      } catch (err) {
        console.error('Failed to load sample profiles:', err);
      }
    }
    loadSamples();
  }, []);

  const handleAssess = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const model = formData.model || 'logistic';
      const result = await api.predictRisk(formData, model);
      setActiveResult(result);
    } catch (err) {
      console.error('Assessment failed:', err);
      setError(
        err.response?.data?.detail ||
          'Failed to connect to ML backend. Please ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Error Alert */}
      {error && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertCircle size={20} color="#f87171" />
          <span style={{ fontSize: '0.9rem' }}>{error}</span>
        </div>
      )}

      {/* Grid: Form on left/top, Result on right/bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: activeResult ? '1fr 1fr' : '1fr', gap: '24px' }}>
        {/* Form Container Card */}
        <div className="glass-card">
          <div style={{ marginBottom: '18px' }}>
            <h3 className="section-title" style={{ margin: 0 }}>
              Loan Applicant Input Form
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Enter borrower financial parameters or select a test persona
            </p>
          </div>

          <CustomerForm
            onSubmit={handleAssess}
            loading={loading}
            sampleProfiles={sampleProfiles}
          />
        </div>

        {/* Prediction & LIME Result Panel */}
        {activeResult ? (
          <div>
            <PredictionResult result={activeResult} />
          </div>
        ) : (
          <div
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '380px',
              textAlign: 'center',
              padding: '40px 24px',
              borderStyle: 'dashed',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <ShieldCheck size={30} color="#818cf8" />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>
              Ready for Assessment
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.5 }}>
              Click <strong>“Assess Credit Risk”</strong> to execute model inference and generate a full local LIME feature importance breakdown.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
