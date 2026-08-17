import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFirebaseAuth } from '../../firebase';
import { Truck, Save, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function AdminShipping() {
  const [settings, setSettings] = useState({
    username: '',
    password: '',
    apiKey: '',
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connected' | 'failed' | 'disconnected'
  const [saveMessage, setSaveMessage] = useState(null); // { text: '', type: 'success' | 'error' }

  useEffect(() => {
    fetchSettings();
  }, []);

  const getAuthToken = async () => {
    const auth = await getFirebaseAuth();
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  };

  const fetchSettings = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      const { data } = await axios.get('/api/shipping/dtdc', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data) {
        setSettings({
          username: data.username || '',
          password: data.password || '',
          apiKey: data.apiKey || '',
          isActive: data.isActive
        });
        
        // Auto-test connection on load if we have an API key
        if (data.apiKey) {
          testConnectionWithKey(data.apiKey);
        }
      }
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnectionWithKey = async (apiKeyToTest) => {
    try {
      const token = await getAuthToken();
      const { data } = await axios.post('/api/shipping/dtdc/test', 
        { apiKey: apiKeyToTest },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('failed');
      }
    } catch (error) {
      setConnectionStatus('failed');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const token = await getAuthToken();
      await axios.put('/api/shipping/dtdc', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaveMessage({ text: 'Settings saved successfully!', type: 'success' });
      
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      setSaveMessage({ text: 'Failed to save settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setSaveMessage(null);
    setConnectionStatus('disconnected');
    try {
      const token = await getAuthToken();
      const { data } = await axios.post('/api/shipping/dtdc/test', 
        { username: settings.username, password: settings.password, apiKey: settings.apiKey },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setConnectionStatus('connected');
        setSaveMessage({ text: data.message || 'Connection successful!', type: 'success' });
      } else {
        setConnectionStatus('failed');
        setSaveMessage({ text: data.message || 'Connection failed.', type: 'error' });
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      setConnectionStatus('failed');
      setSaveMessage({ text: error.response?.data?.message || 'Connection failed. Please check credentials.', type: 'error' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500">
          <Truck size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping & Delivery</h1>
          <p className="text-gray-500">Manage your logistics providers and API settings.</p>
        </div>
      </div>

      <ScrollReveal>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center font-bold text-xl">
                D
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">DTDC Express</h2>
                <p className="text-sm text-gray-500">Live API Integration</p>
              </div>
            </div>
            
            {/* Live Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${connectionStatus === 'connected' ? 'bg-green-50 text-green-600 border border-green-200' : connectionStatus === 'failed' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
              <span className="relative flex h-2.5 w-2.5">
                {connectionStatus === 'connected' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'failed' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
              </span>
              {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'failed' ? 'Failed' : 'Disconnected'}
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-6">
            {saveMessage && (
              <div className={`p-4 rounded-xl flex items-start gap-3 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                {saveMessage.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 text-green-600" /> : <AlertCircle size={20} className="shrink-0 text-red-600" />}
                <p className="text-sm font-medium">{saveMessage.text}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live Username</label>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  placeholder="e.g. PO4418"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Live Password</label>
                <input
                  type="password"
                  value={settings.password}
                  onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 outline-none transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">LIVE API Key</label>
                <input
                  type="text"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="e.g. 3f7bac4827bc43f6bf6ea6de401846"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? 'Saving...' : 'Save Settings'}
              </button>

              <button
                type="button"
                onClick={testConnection}
                disabled={testing || !settings.username || !settings.apiKey}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {testing ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}
