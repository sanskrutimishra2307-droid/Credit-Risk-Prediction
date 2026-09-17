import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import LimeChart from '../components/LimeChart';
import api from '../api/api';

export default function CustomerProfiles({ onSelectPrediction }) {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [profilesData, historyData] = await Promise.allSettled([
          api.getSampleProfiles(),
          api.getPredictionHistory(100),
        ]);

        if (profilesData.status === 'fulfilled') {
          setProfiles(profilesData.value || []);
        }
        if (historyData.status === 'fulfilled') {
          setHistory(historyData.value || []);
        }
      } catch (err) {
        console.error('Failed to load profiles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter history by search term
  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    const idMatch = item.id?.toLowerCase().includes(term);
    const predMatch = item.prediction?.toLowerCase().includes(term);
    const purposeMatch = item.input_data?.purpose?.toLowerCase().includes(term);
    return idMatch || predMatch || purposeMatch;
  });

  const handleRunPersona = async (profileData) => {
    try {
      const res = await api.predictRisk(profileData);
      if (onSelectPrediction) {
        onSelectPrediction(res);
      }
      navigate('/assess');
    } catch (e) {
      console.error('Failed to run persona:', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Benchmark Persona Cards */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            <Users size={20} color="#818cf8" />
            Standard Benchmark Personas
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Pre-configured loan applicant archetypes for quick demonstration and viva examination
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {profiles.map((p, idx) => {
            const isHigh = p.name.includes('High');
            const isBorder = p.name.includes('Borderline');
            return (
              <div
                key={idx}
                className="glass-card glass-card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${isHigh ? '#f43f5e' : isBorder ? '#f59e0b' : '#10b981'}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {p.name}
                    </h4>
                    <span
                      className="badge"
                      style={{
                        background: isHigh ? 'var(--risk-high-bg)' : isBorder ? 'var(--warning-bg)' : 'var(--risk-low-bg)',
                        color: isHigh ? '#fb7185' : isBorder ? '#fbbf24' : '#34d399',
                        fontSize: '0.72rem',
                      }}
                    >
                      {isHigh ? 'High Risk' : isBorder ? 'Moderate' : 'Low Risk'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    {p.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
                    <div>Age: <strong style={{ color: '#fff' }}>{p.data.age} yrs</strong></div>
                    <div>Amount: <strong style={{ color: '#34d399' }}>{p.data.credit_amount} DM</strong></div>
                    <div>Duration: <strong style={{ color: '#fbbf24' }}>{p.data.duration} mos</strong></div>
                    <div>Checking: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{p.data.checking_account}</strong></div>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => handleRunPersona(p.data)}
                >
                  <span>Evaluate with LIME</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Audit Log Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>
              SQLite Prediction Audit Registry
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              All predictions stored locally with complete JSON payload and LIME explanation weights
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by ID, Risk, Purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No audit records matching criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Audit ID</th>
                  <th>Timestamp</th>
                  <th>Applicant Info</th>
                  <th>Loan Amount</th>
                  <th>Duration</th>
                  <th>Risk Decision</th>
                  <th>Confidence</th>
                  <th>LIME Explanations</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((row) => (
                  <tr key={row.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#818cf8' }}>
                      #{row.id}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      {row.input_data?.age} yrs, {row.input_data?.sex}
                    </td>
                    <td style={{ color: '#34d399', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {row.input_data?.credit_amount?.toLocaleString()} DM
                    </td>
                    <td>{row.input_data?.duration} mos</td>
                    <td>
                      <RiskBadge risk={row.prediction} size="sm" />
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {row.confidence?.toFixed(1)}%
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedRecord(row)}
                      >
                        Inspect LIME
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal / Overlay for Inspecting Historical LIME explanation */}
      {selectedRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0f172a',
              borderColor: 'rgba(99, 102, 241, 0.4)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Audit Record: #{selectedRecord.id}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {new Date(selectedRecord.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSelectedRecord(null)}
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <RiskBadge risk={selectedRecord.prediction} size="md" />
                <span style={{ color: '#fff', fontWeight: 600 }}>
                  Confidence: {selectedRecord.confidence?.toFixed(1)}% (P(Bad): {(selectedRecord.probability * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {selectedRecord.explanation && (
              <LimeChart explanation={selectedRecord.explanation} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
