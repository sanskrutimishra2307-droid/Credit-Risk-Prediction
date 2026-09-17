import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const api = {
  // Check API & model health
  checkHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  // Predict credit risk & get LIME explanation
  predictRisk: async (customerData, model = 'logistic') => {
    const payload = { ...customerData, model };
    const res = await apiClient.post('/predict', payload);
    return res.data;
  },

  // Generate LIME explanation only
  explainPrediction: async (customerData, model = 'logistic') => {
    const payload = { ...customerData, model };
    const res = await apiClient.post('/explain', payload);
    return res.data;
  },

  // Get model performance metrics
  getModelMetrics: async () => {
    const res = await apiClient.get('/model-metrics');
    return res.data;
  },

  // Get prediction history from SQLite
  getPredictionHistory: async (limit = 50) => {
    const res = await apiClient.get(`/prediction-history?limit=${limit}`);
    return res.data;
  },

  // Get single prediction by ID
  getPredictionById: async (id) => {
    const res = await apiClient.get(`/prediction/${id}`);
    return res.data;
  },

  // Get preset sample profiles
  getSampleProfiles: async () => {
    const res = await apiClient.get('/sample-profiles');
    return res.data;
  },
};

export default api;
