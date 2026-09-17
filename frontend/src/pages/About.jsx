import React from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Database,
  ShieldAlert,
  Sparkles,
  GitBranch,
} from 'lucide-react';

export default function About() {
  const vivaQuestions = [
    {
      q: '1. Why is Explainable AI (XAI) critical in Credit Risk Assessment?',
      a: 'Credit decisions are legally governed (e.g., US Equal Credit Opportunity Act, EU GDPR Article 22 "Right to Explanation"). If a loan is denied, financial institutions must provide Adverse Action Notices detailing the exact reasons. LIME provides the local mathematical evidence for each denial.',
    },
    {
      q: '2. How does LIME generate local explanations?',
      a: 'LIME draws synthetic samples around the applicant instance by perturbing feature values, calculates the black-box model’s prediction probabilities for each synthetic sample, weights them by exponential proximity kernel π(z), and fits an interpretable linear surrogate model whose coefficients serve as feature importance weights.',
    },
    {
      q: '3. Why use Logistic Regression as the baseline rather than a Deep Neural Network?',
      a: 'Tabular credit risk datasets have structured interactions where Logistic Regression provides calibrated probabilities, avoids severe overfitting on small datasets (~1,000 samples), and is computationally fast and compliant with central bank stress-testing frameworks.',
    },
    {
      q: '4. What is the difference between Global Feature Importance and Local Explanations?',
      a: 'Global importance (like Random Forest Gini importance) shows which features reduce impurity across the whole portfolio. Local explanation (LIME) isolates the exact sub-conditions (e.g. checking_account < 0 DM, duration > 24) responsible for one specific individual applicant’s decision.',
    },
    {
      q: '5. In credit risk, which is worse: Type I (False Positive) or Type II (False Negative) error?',
      a: 'Type II error (predicting Low Risk when the applicant actually defaults) is catastrophic because the bank loses the entire principal amount. Type I error (rejecting a good customer) only causes an opportunity cost of lost interest.',
    },
  ];

  const pipelineSteps = [
    { num: '01', title: 'UCI German Credit Dataset', desc: '1,000 loan applicants with 20 raw demographic & financial attributes.' },
    { num: '02', title: 'Preprocessing Pipeline', desc: 'Median/Constant imputation, StandardScaler for continuous & OneHotEncoder for categoricals.' },
    { num: '03', title: 'Stratified Split (80/20)', desc: '800 training samples and 200 hold-out evaluation samples preserving class ratios.' },
    { num: '04', title: 'Model Training', desc: 'Balanced Logistic Regression (Primary) + 200-estimator Random Forest (Benchmark).' },
    { num: '05', title: 'LIME Tabular Explainer', desc: 'Discretized continuous features and local linear surrogate model fitting.' },
    { num: '06', title: 'FastAPI & React Dashboard', desc: 'Real-time REST API serving predictions, SQLite audit logging, and Recharts visualization.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Project Overview Card */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(17, 24, 39, 0.9) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GraduationCap size={26} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              Credit Risk Assessment using LIME
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              B.Tech Artificial Intelligence & Machine Learning Capstone Demonstration
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
          This full-stack system solves the classic credit underwriting problem by marrying machine learning classification accuracy with interpretable local explanations. Built with Python FastAPI, Scikit-learn, LIME, React, and Recharts.
        </p>
      </div>

      {/* ML Pipeline Flow */}
      <div className="glass-card">
        <h3 className="section-title">
          <GitBranch size={20} color="#818cf8" />
          End-to-End Machine Learning Pipeline
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {pipelineSteps.map((s) => (
            <div
              key={s.num}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '16px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#818cf8',
                  fontFamily: 'var(--font-mono)',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                STAGE {s.num}
              </span>
              <h5 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                {s.title}
              </h5>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Viva / Interview Defense Cheat Sheet */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <BookOpen size={20} color="#34d399" />
          <h3 className="section-title" style={{ margin: 0 }}>
            Viva Voce & Technical Defense Reference
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {vivaQuestions.map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px 20px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
              }}
            >
              <h5 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#a5b4fc', marginBottom: '8px' }}>
                {item.q}
              </h5>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
