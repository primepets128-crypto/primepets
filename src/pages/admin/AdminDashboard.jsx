import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Package, Tag, Image as ImageIcon, Percent, Plus, TrendingUp, Users, Activity, Clock, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../../components/ScrollReveal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [serverStats, setServerStats] = useState(null);
  const [dateRange, setDateRange] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [analyticsData, setAnalyticsData] = useState([]);
  const [liveActivity, setLiveActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setServerStats(response.data);
      } catch (error) {
        console.error("Failed to fetch server stats:", error);
      }
    };
    fetchStats();
  }, []);

  const fetchAnalytics = async () => {
    try {
      let url = `/api/analytics/stats?range=${dateRange}`;
      if (dateRange === 'custom' && customStart && customEnd) {
        url += `&start=${customStart}&end=${customEnd}`;
      }
      const response = await axios.get(url);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  useEffect(() => {
    if (dateRange === 'custom' && (!customStart || !customEnd)) return;
    fetchAnalytics();
  }, [dateRange, customStart, customEnd]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const response = await axios.get('/api/analytics/live');
        setLiveActivity(response.data);
      } catch (error) {
        console.error("Failed to fetch live activity:", error);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 5000); // refresh every 5s for snappy live feeling
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = [
    { label: 'Total Products', value: serverStats?.database?.products || 0, icon: Package, path: '/admin/products', color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20' },
    { label: 'Total Leads/Users', value: serverStats?.database?.users || 0, icon: Users, path: '/admin/customers', color: 'from-pink-500 to-rose-400', shadow: 'shadow-pink-500/20' },
    { label: 'Active Deals', value: serverStats?.database?.deals || 0, icon: Percent, path: '/admin/deals', color: 'from-orange-500 to-red-400', shadow: 'shadow-orange-500/20' },
    { label: 'Categories', value: serverStats?.database?.categories || 0, icon: Tag, path: '/admin/categories', color: 'from-green-500 to-emerald-400', shadow: 'shadow-green-500/20' },
    { label: 'Media Storage', value: formatBytes(serverStats?.cloudinary?.storageUsage || 0), icon: ImageIcon, path: '/admin/settings', color: 'from-purple-500 to-indigo-400', shadow: 'shadow-purple-500/20' },
    { label: 'Bandwidth (Month)', value: formatBytes(serverStats?.cloudinary?.bandwidthUsage || 0), icon: Activity, path: '/admin/settings', color: 'from-teal-500 to-emerald-400', shadow: 'shadow-teal-500/20' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <ScrollReveal>
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2">Welcome back, Admin 👋</h2>
            <p className="text-gray-400 max-w-lg">
              Manage your store's inventory, analyze traffic, and interact with captured leads in real-time.
            </p>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <button onClick={() => navigate('/admin/products')} className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl font-bold transition-colors">
              <Plus size={18} /> Product
            </button>
            <button onClick={() => navigate('/admin/deals')} className="flex items-center justify-center gap-2 bg-[#d07e20] hover:bg-[#E06900] px-4 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-[#d07e20]/20">
              <Plus size={18} /> Deal
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <ScrollReveal delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Link key={idx} to={stat.path} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                    <p className="text-sm text-gray-500 font-semibold">{stat.label}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Web Analytics Chart */}
        <ScrollReveal delay={150} className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Web Analytics
              </h3>
              
              {/* Date Filters */}
              <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button 
                  onClick={() => setDateRange('7d')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${dateRange === '7d' ? 'bg-white shadow text-[#d07e20]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  7 Days
                </button>
                <button 
                  onClick={() => setDateRange('1m')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${dateRange === '1m' ? 'bg-white shadow text-[#d07e20]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  1 Month
                </button>
                <div className="flex items-center gap-2 px-2">
                  <button 
                    onClick={() => setDateRange('custom')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${dateRange === 'custom' ? 'bg-white shadow text-[#d07e20]' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Calendar size={14} /> Custom
                  </button>
                  {dateRange === 'custom' && (
                    <div className="flex items-center gap-2">
                      <input type="date" className="text-xs border border-gray-200 rounded p-1.5 focus:outline-none focus:border-[#d07e20]" value={customStart} onChange={e => setCustomStart(e.target.value)} />
                      <span className="text-gray-400">-</span>
                      <input type="date" className="text-xs border border-gray-200 rounded p-1.5 focus:outline-none focus:border-[#d07e20]" value={customEnd} onChange={e => setCustomEnd(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
              {analyticsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Activity size={32} className="opacity-20 mb-2" />
                  <p>No analytics data for this period</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d07e20" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#d07e20" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Area type="monotone" name="Page Views" dataKey="visits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                    <Area type="monotone" name="Interactions" dataKey="interactions" stroke="#d07e20" strokeWidth={3} fillOpacity={1} fill="url(#colorInteractions)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Live Website Activity */}
        <ScrollReveal delay={200} className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 opacity-[0.03] rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                Live Website
              </h3>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">Auto-sync</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[350px]">
              {liveActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <Clock size={32} className="opacity-20" />
                  <p className="text-sm">Waiting for live activity...</p>
                </div>
              ) : (
                liveActivity.map((log) => (
                  <div key={log.id} className="flex gap-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm ${log.type === 'visit' ? 'bg-blue-50 border border-blue-100 text-blue-500' : 'bg-orange-50 border border-orange-100 text-[#d07e20]'}`}>
                      {log.type === 'visit' ? <Users size={16} /> : <Activity size={16} />}
                    </div>
                    {/* Connection Line */}
                    <div className="absolute top-10 left-5 bottom-[-16px] w-px bg-gray-100 -z-0" />
                    
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-800">{log.action}</p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
