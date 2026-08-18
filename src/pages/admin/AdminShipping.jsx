import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFirebaseAuth } from '../../firebase';
import { Truck, Save, RefreshCw, CheckCircle2, XCircle, AlertCircle, MapPin, Search, PackageSearch, Package } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import { useCart } from '../../context/CartContext';

export default function AdminShipping() {
  const { showToast } = useCart();
  const [activeTab, setActiveTab] = useState('settings'); // settings, pickup, pincode, track, book
  const [settings, setSettings] = useState({
    username: '', password: '', apiKey: '', isActive: true,
    senderName: '', senderPhone: '', senderAddress: '', senderPincode: '', senderCity: '', senderState: ''
  });
  const [orders, setOrders] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [saveMessage, setSaveMessage] = useState(null);

  // Pincode Search State
  const [pincodeQuery, setPincodeQuery] = useState({ origin: '', dest: '' });
  const [pincodeResult, setPincodeResult] = useState(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  // Booking State
  const [bookingForm, setBookingForm] = useState({ orderId: '', weight: 1, length: 10, width: 10, height: 10 });
  const [bookingResult, setBookingResult] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  // Tracking State
  const [awbToTrack, setAwbToTrack] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const getAuthToken = async () => {
    const auth = await getFirebaseAuth();
    return auth.currentUser ? await auth.currentUser.getIdToken() : null;
  };

  const fetchData = async () => {
    try {
      const token = await getAuthToken();
      if (!token) return;
      
      const [settingsRes, ordersRes] = await Promise.all([
        axios.get('/api/shipping/dtdc', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/orders') // Needs auth in real world, but assuming public/admin mixed for now
      ]);

      if (settingsRes.data) {
        setSettings(prev => ({ ...prev, ...settingsRes.data }));
        if (settingsRes.data.apiKey) testConnectionWithKey(settingsRes.data.apiKey);
      }
      
      if (ordersRes.data) {
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data.orders || []));
      }
    } catch (error) {
      console.error('Error fetching shipping data:', error);
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
      setConnectionStatus(data.success ? 'connected' : 'failed');
    } catch (error) {
      setConnectionStatus('failed');
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    try {
      const token = await getAuthToken();
      await axios.put('/api/shipping/dtdc', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSaveMessage({ text: 'Settings saved successfully!', type: 'success' });
      showToast('✅ Shipping settings saved');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      setSaveMessage({ text: 'Failed to save settings', type: 'error' });
      showToast('❌ Failed to save shipping settings');
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
      setConnectionStatus(data.success ? 'connected' : 'failed');
      setSaveMessage({ text: data.message || (data.success ? 'Connection successful!' : 'Connection failed.'), type: data.success ? 'success' : 'error' });
    } catch (error) {
      setConnectionStatus('failed');
      setSaveMessage({ text: error.response?.data?.message || 'Connection failed. Please check credentials.', type: 'error' });
    } finally {
      setTesting(false);
    }
  };

  const checkPincode = async (e) => {
    e.preventDefault();
    setCheckingPincode(true);
    setPincodeResult(null);
    try {
      const token = await getAuthToken();
      const { data } = await axios.post('/api/shipping/dtdc/pincode', 
        { origin: pincodeQuery.origin || settings.senderPincode, dest: pincodeQuery.dest },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success && data.data?.ZIPCODE_RESP?.[0]) {
        setPincodeResult(data.data.ZIPCODE_RESP[0]);
      } else {
        setPincodeResult({ error: 'No data found for this pincode combination.' });
      }
    } catch (error) {
      setPincodeResult({ error: error.response?.data?.message || 'Failed to check pincode' });
    } finally {
      setCheckingPincode(false);
    }
  };

  const bookShipment = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    setBookingResult(null);
    try {
      const token = await getAuthToken();
      const { data } = await axios.post('/api/shipping/dtdc/book', 
        bookingForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setBookingResult({ success: true, awb: data.awb, message: data.message });
        showToast('✅ Shipment Booked! AWB: ' + data.awb);
      }
    } catch (error) {
      setBookingResult({ success: false, message: error.response?.data?.message || 'Failed to book shipment' });
      showToast('❌ Booking Failed');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500">
            <Truck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DTDC Logistics</h1>
            <p className="text-gray-500">Manage API settings, check serviceability, and book shipments.</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${connectionStatus === 'connected' ? 'bg-green-50 text-green-600 border border-green-200' : connectionStatus === 'failed' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
          <span className="relative flex h-2.5 w-2.5">
            {connectionStatus === 'connected' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'failed' ? 'bg-red-500' : 'bg-gray-400'}`}></span>
          </span>
          {connectionStatus === 'connected' ? 'API Connected' : connectionStatus === 'failed' ? 'API Failed' : 'Disconnected'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
        {[
          { id: 'settings', label: 'API Keys', icon: Save },
          { id: 'pickup', label: 'Pickup Details', icon: MapPin },
          { id: 'book', label: 'Book Shipment', icon: Package },
          { id: 'pincode', label: 'Check Pincode', icon: Search },
          { id: 'track', label: 'Track AWB', icon: PackageSearch }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <ScrollReveal>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* TAB: API SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">DTDC API Credentials</h2>
                <p className="text-sm text-gray-500">Enter your live credentials to connect your store with DTDC.</p>
              </div>

              {saveMessage && (
                <div className={`p-4 rounded-xl flex items-start gap-3 ${saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {saveMessage.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                  <p className="text-sm font-medium">{saveMessage.text}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live Username</label>
                  <input type="text" value={settings.username || ''} onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live Password</label>
                  <input type="password" value={settings.password || ''} onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">LIVE API Key</label>
                  <input type="text" value={settings.apiKey || ''} onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl px-4 py-2.5 outline-none transition-all font-mono text-sm" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
                  {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Credentials
                </button>
                <button type="button" onClick={testConnection} disabled={testing || !settings.apiKey} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
                  <RefreshCw size={18} className={testing ? 'animate-spin' : ''} />
                  Test Connection
                </button>
              </div>
            </form>
          )}

          {/* TAB: SENDER DETAILS */}
          {activeTab === 'pickup' && (
            <form onSubmit={handleSaveSettings} className="p-6 sm:p-8 space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pickup Address</h2>
                <p className="text-sm text-gray-500">This address is required by DTDC for package pickup and returns.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Name (Company)</label>
                  <input type="text" required value={settings.senderName || ''} onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sender Phone</label>
                  <input type="text" required value={settings.senderPhone || ''} onChange={(e) => setSettings({ ...settings, senderPhone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <input type="text" required value={settings.senderAddress || ''} onChange={(e) => setSettings({ ...settings, senderAddress: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" required value={settings.senderCity || ''} onChange={(e) => setSettings({ ...settings, senderCity: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" required value={settings.senderState || ''} onChange={(e) => setSettings({ ...settings, senderState: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" required value={settings.senderPincode || ''} onChange={(e) => setSettings({ ...settings, senderPincode: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
              </div>
              <div className="pt-6 border-t border-gray-100">
                <button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
                  {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Pickup Details
                </button>
              </div>
            </form>
          )}

          {/* TAB: BOOK SHIPMENT */}
          {activeTab === 'book' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Book Shipment</h2>
                <p className="text-sm text-gray-500">Push a pending order to DTDC to generate an AWB and schedule pickup.</p>
              </div>

              {!settings.apiKey || !settings.senderPincode ? (
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="shrink-0" />
                  <p className="text-sm">You must configure your <strong>API Credentials</strong> and <strong>Pickup Details</strong> before you can book shipments.</p>
                </div>
              ) : (
                <form onSubmit={bookShipment} className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Order to Ship</label>
                    <select 
                      required
                      value={bookingForm.orderId}
                      onChange={(e) => setBookingForm({ ...bookingForm, orderId: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                    >
                      <option value="">-- Choose an order --</option>
                      {pendingOrders.map(o => (
                        <option key={o.id} value={o.id}>
                          Order #{String(o.id).slice(-6).toUpperCase()} - {o.customerName} (₹{o.totalAmount}) - {o.paymentMethod}
                        </option>
                      ))}
                    </select>
                    {pendingOrders.length === 0 && <p className="text-xs text-red-500 mt-2">No pending or confirmed orders found.</p>}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                      <input type="number" step="0.1" required value={bookingForm.weight} onChange={e => setBookingForm({...bookingForm, weight: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                      <input type="number" required value={bookingForm.length} onChange={e => setBookingForm({...bookingForm, length: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                      <input type="number" required value={bookingForm.width} onChange={e => setBookingForm({...bookingForm, width: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                      <input type="number" required value={bookingForm.height} onChange={e => setBookingForm({...bookingForm, height: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button type="submit" disabled={isBooking || !bookingForm.orderId} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                      {isBooking ? <RefreshCw className="animate-spin" size={18} /> : <Package size={18} />}
                      {isBooking ? 'Booking...' : 'Book Shipment with DTDC'}
                    </button>
                  </div>

                  {bookingResult && (
                    <div className={`p-4 rounded-xl border mt-4 ${bookingResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                      <p className="font-bold">{bookingResult.success ? '🎉 Booking Successful!' : '❌ Booking Failed'}</p>
                      <p className="text-sm mt-1">{bookingResult.message}</p>
                      {bookingResult.awb && <p className="text-sm font-mono mt-2 font-bold">AWB: {bookingResult.awb}</p>}
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

          {/* TAB: PINCODE CHECK */}
          {activeTab === 'pincode' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Serviceability Check</h2>
                <p className="text-sm text-gray-500">Check if DTDC delivers to a specific pincode from your pickup location.</p>
              </div>

              <form onSubmit={checkPincode} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin Pincode</label>
                  <input type="text" placeholder={settings.senderPincode || 'e.g. 110046'} value={pincodeQuery.origin} onChange={e => setPincodeQuery({...pincodeQuery, origin: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination Pincode</label>
                  <input type="text" required placeholder="e.g. 560040" value={pincodeQuery.dest} onChange={e => setPincodeQuery({...pincodeQuery, dest: e.target.value})} className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-2.5 outline-none" />
                </div>
                <div className="flex items-end">
                  <button type="submit" disabled={checkingPincode} className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 h-[46px]">
                    {checkingPincode ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />} Check
                  </button>
                </div>
              </form>

              {pincodeResult && (
                <div className="mt-6 border border-gray-200 rounded-2xl overflow-hidden">
                  {pincodeResult.error ? (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-medium">{pincodeResult.error}</div>
                  ) : (
                    <div className="p-6 bg-white">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="text-green-500" size={24} />
                        <h3 className="text-lg font-bold text-gray-900">Serviceable</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Destination:</span> <span className="font-semibold">{pincodeResult.DESTCITY} ({pincodeResult.DESTPIN})</span></div>
                        <div><span className="text-gray-500">COD Available:</span> <span className="font-semibold text-green-600">{pincodeResult.SERV_COD === 'Y' ? 'YES' : 'NO'}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: QUICK TRACK */}
          {activeTab === 'track' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Track</h2>
                <p className="text-sm text-gray-500">Track any DTDC AWB number directly.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
                <div className="flex-1">
                  <input type="text" placeholder="Enter AWB (e.g. V01197967)" value={awbToTrack} onChange={e => setAwbToTrack(e.target.value)} className="w-full bg-gray-50 border border-gray-200 focus:border-orange-500 rounded-xl px-4 py-3 outline-none font-mono" />
                </div>
                <a 
                  href={`https://www.dtdc.in/tracking/tracking_results.asp?awbno=${awbToTrack}`}
                  target="_blank" rel="noopener noreferrer"
                  className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${!awbToTrack ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <PackageSearch size={18} />
                  Track on DTDC
                </a>
              </div>
            </div>
          )}

        </div>
      </ScrollReveal>
    </div>
  );
}
