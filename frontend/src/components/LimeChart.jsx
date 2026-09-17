import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

// Custom tooltip for LIME chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isHighRisk = data.weight > 0;
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: `1px solid ${isHighRisk ? '#f43f5e' : '#10b981'}`,
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          maxWidth: '300px',
        }}
      >
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>
          {data.feature}
        </p>
        <p style={{ fontSize: '0.8rem', color: isHighRisk ? '#fb7185' : '#34d399', margin: 0 }}>
          {isHighRisk ? '▲ Increases Risk by' : '▼ Lowers Risk by'}:{' '}
          <strong>{Math.abs(data.weight).toFixed(4)}</strong>
        </p>
        <p style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
          {isHighRisk
            ? 'This condition pushes the applicant toward a High Risk prediction.'
            : 'This condition provides positive support toward a Low Risk prediction.'}
        </p>
      </div>
    );
  }
  return null;
};

export default function LimeChart({ explanation }) {
  if (!explanation || !explanation.features || explanation.features.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
        }}
      >
        No LIME explanation data available. Run an assessment to generate local explanations.
      </div>
    );
  }

  // Format data for Recharts
  // Sort features by absolute weight for clearest visualization
  const chartData = [...explanation.features]
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 8)
    .map((item) => ({
      feature: item.feature,
      weight: item.weight,
      absWeight: Math.abs(item.weight),
      direction: item.weight > 0 ? 'High Risk' : 'Low Risk',
    }))
    .reverse(); // reverse for top-to-bottom in horizontal bar chart

  const positiveFactors = explanation.positive_factors || [];
  const negativeFactors = explanation.negative_factors || [];

  return (
    <div>
      {/* Chart Title & Explanation */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
            LIME Feature Contribution Breakdown (Local Surrogate)
          </h4>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f43f5e' }}></span>
              Increases High Risk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981' }}></span>
              Decreases Risk (Protective)
            </span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
          Weights represent local linear regression coefficients fitted around this applicant's profile.
        </p>
      </div>

      {/* Horizontal Bar Chart */}
      <div style={{ width: '100%', height: 320, background: 'rgba(0, 0, 0, 0.15)', borderRadius: '10px', padding: '12px 10px 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
          >
            <XAxis
              type="number"
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(val) => val.toFixed(2)}
            />
            <YAxis
              type="category"
              dataKey="feature"
              stroke="#94a3b8"
              fontSize={11}
              width={130}
              tick={{ fill: '#cbd5e1' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
            <Bar dataKey="weight" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.weight > 0 ? '#f43f5e' : '#10b981'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Key Drivers Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '20px' }}>
        {/* Top Risk Drivers */}
        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ArrowUpRight size={18} color="#fb7185" />
            <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fb7185', margin: 0 }}>
              Top Risk Escalators (+Weight)
            </h5>
          </div>
          {positiveFactors.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No strong risk increasing factors.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {positiveFactors.slice(0, 3).map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                    {item.feature}
                  </span>
                  <span style={{ fontWeight: 600, color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
                    +{item.weight.toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Protective Drivers */}
        <div
          style={{
            padding: '16px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <ArrowDownRight size={18} color="#34d399" />
            <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#34d399', margin: 0 }}>
              Top Protective Factors (-Weight)
            </h5>
          </div>
          {negativeFactors.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No strong protective factors.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {negativeFactors.slice(0, 3).map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                    {item.feature}
                  </span>
                  <span style={{ fontWeight: 600, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                    {item.weight.toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
