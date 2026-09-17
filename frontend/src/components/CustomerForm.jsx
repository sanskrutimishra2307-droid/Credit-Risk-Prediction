import React, { useState } from 'react';
import { User, DollarSign, Calendar, Sliders, Play, RotateCcw, Sparkles } from 'lucide-react';

const INITIAL_FORM = {
  age: 35,
  sex: 'male',
  job: 2,
  housing: 'own',
  saving_accounts: 'moderate',
  checking_account: 'moderate',
  credit_amount: 3500,
  duration: 18,
  purpose: 'car',
  model: 'logistic',
};

export default function CustomerForm({ onSubmit, loading, sampleProfiles = [] }) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSliderChange = (name, val) => {
    setFormData((prev) => ({
      ...prev,
      [name]: Number(val),
    }));
  };

  const loadPreset = (profileData) => {
    setFormData((prev) => ({
      ...prev,
      ...profileData,
    }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Sample Profile Quick Fill */}
      {sampleProfiles.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#818cf8" />
            Quick Test Bench (Load Preset Personas)
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {sampleProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => loadPreset(p.data)}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model Selection Toggle */}
      <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Classification Model</span>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
              Choose which trained model to query and explain with LIME
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn btn-sm ${formData.model === 'logistic' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFormData(prev => ({ ...prev, model: 'logistic' }))}
            >
              Logistic Regression
            </button>
            <button
              type="button"
              className={`btn btn-sm ${formData.model === 'random_forest' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFormData(prev => ({ ...prev, model: 'random_forest' }))}
            >
              Random Forest
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Sliders & Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '20px' }}>
        {/* Age */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Applicant Age</label>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
              {formData.age} yrs
            </span>
          </div>
          <input
            type="range"
            min="18"
            max="75"
            value={formData.age}
            onChange={(e) => handleSliderChange('age', e.target.value)}
            style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
          />
        </div>

        {/* Credit Amount */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Credit Amount (DM)</label>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {formData.credit_amount.toLocaleString()} DM
            </span>
          </div>
          <input
            type="range"
            min="250"
            max="18000"
            step="250"
            value={formData.credit_amount}
            onChange={(e) => handleSliderChange('credit_amount', e.target.value)}
            style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="form-label" style={{ margin: 0 }}>Loan Duration</label>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {formData.duration} mos
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="72"
            step="2"
            value={formData.duration}
            onChange={(e) => handleSliderChange('duration', e.target.value)}
            style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Categorical Dropdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Sex */}
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select name="sex" value={formData.sex} onChange={handleChange} className="form-select">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Job */}
        <div className="form-group">
          <label className="form-label">Job Skill Category</label>
          <select name="job" value={formData.job} onChange={handleChange} className="form-select">
            <option value="0">0: Unskilled / Non-resident</option>
            <option value="1">1: Unskilled / Resident</option>
            <option value="2">2: Skilled Employee / Official</option>
            <option value="3">3: Highly Skilled / Management</option>
          </select>
        </div>

        {/* Housing */}
        <div className="form-group">
          <label className="form-label">Housing Status</label>
          <select name="housing" value={formData.housing} onChange={handleChange} className="form-select">
            <option value="own">Own Property</option>
            <option value="rent">Renting</option>
            <option value="free">Free Accommodation</option>
          </select>
        </div>

        {/* Checking Account */}
        <div className="form-group">
          <label className="form-label">Checking Account Balance</label>
          <select name="checking_account" value={formData.checking_account} onChange={handleChange} className="form-select">
            <option value="little">Little (&lt; 0 DM / Low)</option>
            <option value="moderate">Moderate (0 – 200 DM)</option>
            <option value="rich">Rich (&gt; 200 DM)</option>
            <option value="unknown">Unknown / None</option>
          </select>
        </div>

        {/* Saving Accounts */}
        <div className="form-group">
          <label className="form-label">Savings Balance</label>
          <select name="saving_accounts" value={formData.saving_accounts} onChange={handleChange} className="form-select">
            <option value="little">Little (&lt; 100 DM)</option>
            <option value="moderate">Moderate (100 – 500 DM)</option>
            <option value="quite rich">Quite Rich (500 – 1000 DM)</option>
            <option value="rich">Rich (&gt; 1000 DM)</option>
            <option value="unknown">Unknown / None</option>
          </select>
        </div>

        {/* Purpose */}
        <div className="form-group">
          <label className="form-label">Credit Purpose</label>
          <select name="purpose" value={formData.purpose} onChange={handleChange} className="form-select">
            <option value="car">Car Purchase</option>
            <option value="radio/TV">Radio / Television</option>
            <option value="furniture/equipment">Furniture / Equipment</option>
            <option value="education">Education</option>
            <option value="business">Business Investment</option>
            <option value="repairs">Repairs</option>
            <option value="domestic appliances">Domestic Appliances</option>
            <option value="vacation/others">Vacation / Other</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
        <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading}>
          <RotateCcw size={16} />
          Reset Form
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '180px' }}>
          {loading ? (
            <span className="animate-pulse">Computing LIME...</span>
          ) : (
            <>
              <Play size={16} />
              Assess Credit Risk
            </>
          )}
        </button>
      </div>
    </form>
  );
}
