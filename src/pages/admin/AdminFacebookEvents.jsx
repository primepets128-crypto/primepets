import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Eye, ShoppingCart, CreditCard, ShoppingBag, 
  Settings, Loader2, Calendar, Search, ArrowRight, RefreshCw, CheckCircle, XCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import ScrollReveal from '../../components/ScrollReveal';
import { useCart } from '../../context/CartContext';

const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export default function AdminFacebookEvents() {
  const { showToast } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState(null);

  const getPathname = (urlString) => {
    try {
      if (!urlString) return '/';
      if (urlString.startsWith('/') || !urlString.includes('://')) return urlString;
      return new URL(urlString).pathname;
    } catch (e) {
      return urlString || '/';
    }
  };

  const fetchEvents = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      const response = await axios.get(`/api/analytics/facebook-events?range=${range}`);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch Facebook events:', error);
      showToast('Error loading Facebook events data.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [range]);

  const getEventBadge = (name) => {
    const badges = {
      PageView: 'bg-blue-100 text-blue-800 border-blue-200',
      AddToCart: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      InitiateCheckout: 'bg-purple-100 text-purple-800 border-purple-200',
      Purchase: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return badges[name] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getEventIcon = (name) => {
    switch (name) {
      case 'PageView': return <Eye size={16} />;
      case 'AddToCart': return <ShoppingCart size={16} />;
      case 'InitiateCheckout': return <CreditCard size={16} />;
      case 'Purchase': return <ShoppingBag size={16} />;
      default: return <Facebook size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={36} />
      </div>
    );
  }

  const { events = [], chartData = [], counts = {}, configStatus = {} } = data || {};

  const filteredEvents = events.filter(e => 
    (e.eventName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.userEmail && e.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (e.visitorId && e.visitorId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Configuration Status & Info */}
      <ScrollReveal>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Facebook size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Facebook Events & Pixel Tracking</h2>
              <p className="text-sm text-gray-500">Track and monitor conversion events fired by visitors.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 text-xs font-semibold">
              <span className="text-gray-400">Meta Pixel:</span>
              {configStatus.pixelId ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle size={14} /> Active ({configStatus.pixelId})
                </span>
              ) : (
                <span className="text-rose-500 flex items-center gap-1">
                  <XCircle size={14} /> Inactive
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 text-xs font-semibold">
              <span className="text-gray-400">Conversions API:</span>
              {configStatus.hasAccessToken ? (
                <span className="text-emerald-600 flex items-center gap-1" title={configStatus.conversionsUrl || 'Direct Graph API'}>
                  <CheckCircle size={14} /> {configStatus.conversionsUrl ? 'Gateway Connected' : 'Connected'}
                </span>
              ) : (
                <span className="text-gray-500 flex items-center gap-1">
                  <XCircle size={14} /> Local Logs Only
                </span>
              )}
            </div>
            <button 
              onClick={() => fetchEvents(true)}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* KPI Section */}
      <ScrollReveal delay={50}>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-blue-500 mb-2"><Eye size={20} /></div>
            <p className="text-2xl font-black text-gray-800">{counts.PageView || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1">Page Views</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-emerald-500 mb-2"><ShoppingCart size={20} /></div>
            <p className="text-2xl font-black text-gray-800">{counts.AddToCart || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1">Add to Cart</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-purple-500 mb-2"><CreditCard size={20} /></div>
            <p className="text-2xl font-black text-gray-800">{counts.InitiateCheckout || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1">Checkouts</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-amber-500 mb-2"><ShoppingBag size={20} /></div>
            <p className="text-2xl font-black text-gray-800">{counts.Purchase || 0}</p>
            <p className="text-xs text-gray-400 font-bold uppercase mt-1">Purchases</p>
          </div>
          <div className="bg-orange-500 p-5 rounded-2xl text-white col-span-2 lg:col-span-1 shadow-lg shadow-orange-500/20">
            <div className="text-white/80 mb-2"><Facebook size={20} /></div>
            <p className="text-2xl font-black">{counts.Total || 0}</p>
            <p className="text-xs text-white/80 font-bold uppercase mt-1">Total Events</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Chart Section */}
      <ScrollReveal delay={100}>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={18} className="text-orange-500" /> Event Activity Trend
            </h3>
            <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setRange('7d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${range === '7d' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                7 Days
              </button>
              <button 
                onClick={() => setRange('30d')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${range === '30d' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              >
                30 Days
              </button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorAtc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorPur" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/><stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 600, color: '#374151' }} />
                <Area name="Page View" type="monotone" dataKey="PageView" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                <Area name="Add To Cart" type="monotone" dataKey="AddToCart" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorAtc)" />
                <Area name="Purchase" type="monotone" dataKey="Purchase" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorPur)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ScrollReveal>

      {/* Logs Table */}
      <ScrollReveal delay={150}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
            <div>
              <h3 className="font-bold text-gray-850">Recent Event Logs</h3>
              <p className="text-xs text-gray-400">Inspected real-time metadata of triggered events.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search event, email, or guest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-xs"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <Facebook size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No events matching your search criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-[10px] font-bold tracking-wider uppercase border-b border-gray-100">
                    <th className="p-4 pl-6">Event</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Path URL</th>
                    <th className="p-4">IP Address</th>
                    <th className="p-4">Time</th>
                    <th className="p-4 pr-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {filteredEvents.map(event => {
                    const isExpanded = expandedEventId === event.id;
                    const eventDataObj = event.eventData ? JSON.parse(event.eventData) : null;
                    return (
                      <React.Fragment key={event.id}>
                        <tr className="hover:bg-orange-50/10 transition-colors group">
                          <td className="p-4 pl-6">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${getEventBadge(event.eventName)}`}>
                              {getEventIcon(event.eventName)}
                              {event.eventName}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-gray-700">{event.userEmail || 'Guest'}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 font-medium truncate max-w-[140px]" title={event.visitorId}>
                              {event.visitorId}
                            </p>
                          </td>
                          <td className="p-4 max-w-[180px] truncate" title={event.url}>
                            <span className="text-gray-600 font-medium">
                              {getPathname(event.url)}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-gray-500">{event.ip}</td>
                          <td className="p-4 text-gray-400 font-medium">
                            {new Date(event.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            {eventDataObj ? (
                              <button 
                                onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                                className="text-orange-500 font-bold hover:underline inline-flex items-center gap-1"
                              >
                                {isExpanded ? 'Hide' : 'Inspect'} <ArrowRight size={12} className={isExpanded ? 'rotate-90 transition-transform' : ''} />
                              </button>
                            ) : (
                              <span className="text-gray-300 font-medium">None</span>
                            )}
                          </td>
                        </tr>
                        {isExpanded && eventDataObj && (
                          <tr className="bg-gray-50/50">
                            <td colSpan={6} className="p-4 pl-6 pr-6">
                              <div className="bg-white p-4 rounded-xl border border-gray-150 shadow-inner font-mono text-[10px] text-gray-700 max-h-48 overflow-y-auto">
                                <pre>{JSON.stringify(eventDataObj, null, 2)}</pre>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
