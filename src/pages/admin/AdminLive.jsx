import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Clock, Users, User, Send, Monitor, Smartphone, Globe, CheckCircle2, Loader2, Info } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';

export default function AdminLive() {
  const [liveActivity, setLiveActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notifyState, setNotifyState] = useState({ token: null, title: '', body: '', url: '', status: 'idle' });

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const response = await axios.get('/api/analytics/live');
        setLiveActivity(response.data);
      } catch (error) {
        console.error("Failed to fetch live activity:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLive();
    const interval = setInterval(fetchLive, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifyState.token) return;
    
    setNotifyState(prev => ({ ...prev, status: 'loading' }));
    
    try {
      await axios.post('/api/analytics/notify', {
        fcmToken: notifyState.token,
        title: notifyState.title || 'Hello from Prime Pets',
        body: notifyState.body,
        url: notifyState.url || window.location.origin
      });
      setNotifyState(prev => ({ ...prev, status: 'success' }));
      setTimeout(() => {
        setNotifyState({ token: null, title: '', body: '', url: '', status: 'idle' });
      }, 3000);
    } catch (err) {
      console.error(err);
      setNotifyState(prev => ({ ...prev, status: 'error' }));
    }
  };

  const getDeviceIcon = (deviceStr) => {
    if (!deviceStr) return <Monitor size={14} />;
    const l = deviceStr.toLowerCase();
    if (l.includes('mobile') || l.includes('phone') || l.includes('iphone') || l.includes('android')) return <Smartphone size={14} />;
    return <Monitor size={14} />;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </div>
              Live Visitors & Activity
            </h1>
            <p className="text-gray-500 font-medium mt-1">Real-time overview of who is on the site right now.</p>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Activity Feed */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col items-center justify-center text-gray-400 gap-4">
              <Loader2 size={48} className="animate-spin text-green-500" />
              <p className="font-medium animate-pulse">Connecting to live feed...</p>
            </div>
          ) : liveActivity.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 flex flex-col items-center justify-center text-gray-400 gap-4">
              <Clock size={48} className="opacity-20" />
              <p className="font-medium">Waiting for live activity...</p>
            </div>
          ) : (
            liveActivity.map((log) => (
              <ScrollReveal key={log.id}>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                    
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${log.type === 'visit' ? 'bg-blue-50 border border-blue-100 text-blue-500' : 'bg-orange-50 border border-orange-100 text-[#d07e20]'}`}>
                      {log.type === 'visit' ? <Globe size={24} /> : <Activity size={24} />}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <User size={16} className="text-gray-400" />
                            <span className="font-bold text-gray-800">{log.displayName}</span>
                            {log.visitor?.phone && (
                              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                                {log.visitor.phone}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg">{log.action}</h3>
                          <p className="text-gray-500 text-sm">{log.details}</p>
                        </div>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Visitor Details Pill */}
                      {log.visitor && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200">
                            {getDeviceIcon(log.visitor.device)}
                            <span className="font-medium truncate max-w-[120px]">{log.visitor.device}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200">
                            <Globe size={14} />
                            <span className="font-medium">{log.visitor.browser} • {log.visitor.os}</span>
                          </div>
                          
                          {log.visitor.ip && (
                            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200">
                              <Info size={14} />
                              <span className="font-medium">{log.visitor.ip}</span>
                            </div>
                          )}

                          {log.visitor.fcmToken && (
                            <button 
                              onClick={() => setNotifyState(prev => ({ ...prev, token: log.visitor.fcmToken }))}
                              className="ml-auto flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs px-3 py-1.5 rounded-lg border border-blue-200 font-bold transition-colors"
                            >
                              <Send size={14} />
                              Send Push
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))
          )}
        </div>

        {/* Sidebar Tools (e.g. Notify Box) */}
        <div className="lg:col-span-1 space-y-6">
          <ScrollReveal delay={100}>
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Send size={20} className="text-indigo-300" />
                Push Notification
              </h3>
              <p className="text-indigo-200 text-sm mb-6">
                Target a specific active user by clicking "Send Push" on their activity card.
              </p>

              {notifyState.token ? (
                <form onSubmit={handleSendNotification} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-indigo-200 mb-1">Title</label>
                    <input 
                      type="text" 
                      value={notifyState.title}
                      onChange={e => setNotifyState(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400"
                      placeholder="Special Offer!"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-200 mb-1">Message Body</label>
                    <textarea 
                      value={notifyState.body}
                      onChange={e => setNotifyState(prev => ({ ...prev, body: e.target.value }))}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400 min-h-[80px]"
                      placeholder="Get 20% off today..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-200 mb-1">Click URL (Optional)</label>
                    <input 
                      type="url" 
                      value={notifyState.url}
                      onChange={e => setNotifyState(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-indigo-300/50 focus:outline-none focus:border-indigo-400"
                      placeholder="https://..."
                    />
                  </div>
                  
                  <button 
                    disabled={notifyState.status === 'loading' || notifyState.status === 'success'}
                    type="submit" 
                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {notifyState.status === 'loading' ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : notifyState.status === 'success' ? (
                      <><CheckCircle2 size={18} /> Sent!</>
                    ) : (
                      <><Send size={18} /> Send Notification</>
                    )}
                  </button>
                  
                  {notifyState.status === 'error' && (
                    <p className="text-red-300 text-xs text-center mt-2 font-medium">Failed to send notification. Is Firebase setup?</p>
                  )}
                </form>
              ) : (
                <div className="bg-black/20 border border-white/10 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3">
                  <Smartphone size={32} className="text-indigo-400 opacity-50" />
                  <p className="text-sm font-medium text-indigo-200">
                    Select a user from the live feed who has enabled push notifications to send them a message.
                  </p>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

      </div>
    </div>
  );
}
