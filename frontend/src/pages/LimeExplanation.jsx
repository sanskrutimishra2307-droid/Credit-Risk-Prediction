import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Code2,
  ArrowRight,
  Sliders,
  Layers,
} from 'lucide-react';
import LimeChart from '../components/LimeChart';
import api from '../api/api';

export default function LimeExplanation({ activeResult }) {
  const navigate = useNavigate();
  const [sampleResult, setSampleResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // If no active result, auto-generate explanation for default sample
  useEffect(() => {
    if (!activeResult && !sampleResult) {
      async function fetchDefault() {
        setLoading(true);
        try {
          const res = await api.predictRisk({
            age: 38,
            sex: 'female',
            job: 2,
            housing: 'rent',
            saving_accounts: 'little',
            checking_account: 'little',
            credit_amount: 6000,
            duration: 36,
            purpose: 'car',
            model: 'logistic',
          });
          setSampleResult(res);
        } catch (e) {
          console.error('Failed to load default LIME demo:', e);
        } finally {
          setLoading(false);
        }
      }
      fetchDefault();
    }
  }, [activeResult, sampleResult]);

  const currentResult = activeResult || sampleResult;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Educational Header Card */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(17, 24, 39, 0.8) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BrainCircuit size={28} color="#818cf8" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              What is LIME? (Local Interpretable Model-agnostic Explanations)
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6 }}>
              While traditional ML models (even Logistic Regression with scaled/encoded features or ensemble trees) can behave like black-boxes to loan applicants and auditors, <strong>LIME explains individual predictions locally</strong> by perturbing the applicant’s input, observing how the model's confidence changes, and fitting an interpretable surrogate model.
            </p>
          </div>
        </div>
      </div>

      {/* Concept Comparison Grid */}
      <div className="grid-2">
        {/* Global vs Local Card */}
        <div className="glass-card">
          <h4 className="section-title" style={{ color: '#818cf8' }}>
            <Layers size={18} />
            Global vs. Local Interpretability
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.86rem' }}>
            <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
                Global Explanation (e.g., Gini Importance)
              </strong>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Explains which features matter across the <em>entire dataset overall</em> (e.g. "Credit duration is generally important"). It cannot explain why Applicant #452 was rejected.
              </p>
            </div>

            <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <strong style={{ color: '#a5b4fc', display: 'block', marginBottom: '4px' }}>
                Local Explanation (LIME)
              </strong>
              <p style={{ color: '#cbd5e1', margin: 0 }}>
                Explains why <em>this specific customer</em> received their decision (e.g., "This loan was flagged High Risk primarily because checking account &lt; 0 DM and duration was 36 months").
              </p>
            </div>
          </div>
        </div>

        {/* LIME Algorithm Mechanics */}
        <div className="glass-card">
          <h4 className="section-title" style={{ color: '#34d399' }}>
            <Code2 size={18} />
            How LIME Works (4 Step Pipeline)
          </h4>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong style={{ color: '#fff' }}>Instance Selection:</strong> Select a single applicant vector $x$.
            </li>
            <li>
              <strong style={{ color: '#fff' }}>Local Perturbation:</strong> Generate $N$ artificial synthetic samples in the neighborhood of $x$.
            </li>
            <li>
              <strong style={{ color: '#fff' }}>Proximity Weighting:</strong> Assign weights $\pi_x(z) = \exp(-D(x,z)^2 / \sigma^2)$ based on distance.
            </li>
            <li>
              <strong style={{ color: '#fff' }}>Surrogate Fitting:</strong> Train a weighted sparse linear regressor to extract exact feature contributions.
            </li>
          </ol>
        </div>
      </div>

      {/* Active LIME Explanation Deep Dive */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>
              Live LIME Local Explanation Inspection
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              {activeResult
                ? `Showing explanation for Applicant #${activeResult.id} (${activeResult.prediction})`
                : 'Showing demonstration profile explanation (Run an assessment to see custom applicants)'}
            </p>
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => navigate('/assess')}>
            <span>Assess Another Applicant</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div className="animate-pulse">Calculating LIME surrogate model...</div>
          </div>
        ) : (
          currentResult && (
            <LimeChart explanation={currentResult.explanation} />
          )
        )}
      </div>
    </div>
  );
}
