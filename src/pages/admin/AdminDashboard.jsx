import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Package, Tag, Image as ImageIcon, Percent, Plus, TrendingUp, Settings, Users, Activity, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollReveal from '../../components/ScrollReveal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// Mock data for the last 7 days of web analytics
const analyticsData = [
  { name: 'Mon', visits: 400, leads: 24 },
  { name: 'Tue', visits: 300, leads: 13 },
  { name: 'Wed', visits: 550, leads: 48 },
  { name: 'Thu', visits: 450, leads: 39 },
  { name: 'Fri', visits: 700, leads: 68 },
  { name: 'Sat', visits: 850, leads: 92 },
  { name: 'Sun', visits: 920, leads: 115 },
];

export default function AdminDashboard() {
  const { activityLog } = useData();
  const navigate = useNavigate();
  const [serverStats, setServerStats] = React.useState(null);

  React.useEffect(() => {
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

  const recentActivity = useMemo(() => {
    return (activityLog || []).slice(0, 10);
  }, [activityLog]);

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
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> Web Analytics (Last 7 Days)
            </h3>
            <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  <Area type="monotone" dataKey="leads" stroke="#d07e20" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Website Activity */}
        <ScrollReveal delay={200} className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-green-500 animate-pulse" /> Live Activity
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <Clock size={32} className="opacity-20" />
                  <p className="text-sm">No recent activity</p>
                </div>
              ) : (
                recentActivity.map((log) => (
                  <div key={log.id} className="flex gap-4 relative">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    {/* Connection Line */}
                    <div className="absolute top-10 left-5 bottom-[-16px] w-px bg-gray-100 -z-0" />
                    
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-bold text-gray-800">{log.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
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
