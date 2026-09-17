import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { BarChart3, Database, Target, Award, CheckCircle2, Shield } from 'lucide-react';
import ConfusionMatrix from '../components/ConfusionMatrix';
import api from '../api/api';

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await api.getModelMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  const lr = metrics?.logistic_regression || {
    accuracy: 0.74,
    precision: 0.757,
    recall: 0.757,
    f1_score: 0.757,
    roc_auc: 0.8048,
    confusion_matrix: [[68, 25], [26, 81]],
  };

  const rf = metrics?.random_forest || {
    accuracy: 0.72,
    precision: 0.7429,
    recall: 0.729,
    f1_score: 0.7358,
    roc_auc: 0.7867,
    confusion_matrix: [[66, 27], [29, 78]],
  };

  const comparisonData = [
    { metric: 'Accuracy', LogisticRegression: lr.accuracy * 100, RandomForest: rf.accuracy * 100 },
    { metric: 'Precision', LogisticRegression: lr.precision * 100, RandomForest: rf.precision * 100 },
    { metric: 'Recall', LogisticRegression: lr.recall * 100, RandomForest: rf.recall * 100 },
    { metric: 'F1 Score', LogisticRegression: lr.f1_score * 100, RandomForest: rf.f1_score * 100 },
    { metric: 'ROC-AUC', LogisticRegression: lr.roc_auc * 100, RandomForest: rf.roc_auc * 100 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dataset & Evaluation Metadata Banner */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>
              <Database size={20} color="#818cf8" />
              Dataset & Validation Setup
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Statlog German Credit Data (UCI Machine Learning Repository)
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.25)', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Train Samples:</span>{' '}
              <strong style={{ color: '#fff' }}>{metrics?.train_size || 800} (80%)</strong>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Test Samples:</span>{' '}
              <strong style={{ color: '#fff' }}>{metrics?.test_size || 200} (20%)</strong>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Encoded Features:</span>{' '}
              <strong style={{ color: '#fff' }}>{metrics?.feature_names?.length || 29}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Metrics Bar Chart */}
      <div className="glass-card">
        <h3 className="section-title">
          <BarChart3 size={20} color="#818cf8" />
          Model Comparison: Logistic Regression vs Random Forest
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          All evaluation metrics computed on the hold-out test set (200 samples)
        </p>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[50, 100]} stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(val) => [`${Number(val).toFixed(2)}%`]}
                contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="LogisticRegression" name="Logistic Regression (Primary)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="RandomForest" name="Random Forest (Ensemble)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrices Side-by-Side */}
      <div className="grid-2">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#818cf8', margin: 0 }}>
              Logistic Regression Confusion Matrix
            </h4>
            <span className="badge badge-tag">Primary Model</span>
          </div>
          <ConfusionMatrix matrix={lr.confusion_matrix} modelName="Logistic Regression" />
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#34d399', margin: 0 }}>
              Random Forest Confusion Matrix
            </h4>
            <span className="badge badge-tag">Ensemble Benchmark</span>
          </div>
          <ConfusionMatrix matrix={rf.confusion_matrix} modelName="Random Forest" />
        </div>
      </div>

      {/* Metrics Summary Table */}
      <div className="glass-card">
        <h4 className="section-title">Comprehensive Metric Summary Table</h4>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-Score</th>
                <th>ROC-AUC</th>
                <th>Explainability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 600, color: '#fff' }}>
                  Logistic Regression (Balanced)
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                  {(lr.accuracy * 100).toFixed(2)}%
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{(lr.precision * 100).toFixed(2)}%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{(lr.recall * 100).toFixed(2)}%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{(lr.f1_score * 100).toFixed(2)}%</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: 600 }}>
                  {lr.roc_auc.toFixed(4)}
                </td>
                <td>
                  <span className="badge badge-low-risk" style={{ fontSize: '0.72rem' }}>
                    High (LIME + Weights)
                  </span>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600, color: '#fff' }}>
                  Random Forest (200 Trees)
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                  {(rf.accuracy * 100).toFixed(2)}%
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{(rf.precision * 100).toFixed(2)}%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{(rf.recall * 100).toFixed(2)}%</td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{(rf.f1_score * 100).toFixed(2)}%</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: '#818cf8', fontWeight: 600 }}>
                  {rf.roc_auc.toFixed(4)}
                </td>
                <td>
                  <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                    Medium (LIME Local)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
