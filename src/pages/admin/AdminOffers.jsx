import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, Tag, Flame, Loader2, ToggleLeft, ToggleRight, Edit3, X, Check } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import Toast from '../../components/Toast';

const GRADIENT_OPTIONS = [
  { label: 'Gold (Brand)', value: 'from-[#d07e20] to-[#a65d14]' },
  { label: 'Ocean Blue', value: 'from-[#007CF0] to-[#0F9B8E]' },
  { label: 'Purple Magic', value: 'from-[#6C3FC8] to-[#E040FB]' },
  { label: 'Rose Pink', value: 'from-[#E91E63] to-[#9C27B0]' },
  { label: 'Forest Green', value: 'from-[#4CAF50] to-[#1B5E20]' },
  { label: 'Crimson Red', value: 'from-[#F44336] to-[#B71C1C]' },
  { label: 'Sky Blue', value: 'from-[#2196F3] to-[#0D47A1]' },
  { label: 'Teal', value: 'from-[#0F9B8E] to-[#007CF0]' },
];

const DEAL_CATEGORIES = [
  { id: 1, label: 'DOG FOOD', off: '30% OFF', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=260&fit=crop', grad: 'from-[#d07e20] to-[#a65d14]', bg: '#FFF4ED', border: '#e6c8a8', flash: true },
  { id: 2, label: 'CAT FOOD', off: '25% OFF', img: 'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=400&h=260&fit=crop', grad: 'from-[#9C27B0] to-[#6A1B9A]', bg: '#F9F0FF', border: '#DDB6FF', flash: false },
  { id: 3, label: 'GROOMING', off: '35% OFF', img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&h=260&fit=crop', grad: 'from-[#0F9B8E] to-[#007CF0]', bg: '#E0F7FA', border: '#80DEEA', flash: true },
  { id: 4, label: 'DOG TREATS', off: '25% OFF', img: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=260&fit=crop', grad: 'from-[#2196F3] to-[#0D47A1]', bg: '#EFF6FF', border: '#BFDBFE', flash: false },
  { id: 5, label: 'CAT TREATS', off: '20% OFF', img: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=260&fit=crop', grad: 'from-[#4CAF50] to-[#1B5E20]', bg: '#F0FDF4', border: '#BBF7D0', flash: false },
  { id: 6, label: 'ACCESSORIES', off: '40% OFF', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=260&fit=crop', grad: 'from-[#F44336] to-[#B71C1C]', bg: '#FFF1F2', border: '#FECACA', flash: true },
];

const BLANK_COUPON = {
  title: '',
  sub: '',
  code: '',
  expiry: 'Ongoing',
  emoji: '🐾',
  grad: 'from-[#d07e20] to-[#a65d14]',
  isActive: true,
};

function CouponPreview({ coupon }) {
  return (
    <div className={`bg-gradient-to-r ${coupon.grad || 'from-[#d07e20] to-[#a65d14]'} rounded-2xl p-4 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-4 translate-x-4" />
      <div className="text-2xl mb-1">{coupon.emoji || '🐾'}</div>
      <p className="font-black text-base leading-tight">{coupon.title || 'TITLE'}</p>
      <p className="text-white/80 text-xs mt-0.5">{coupon.sub || 'Subtitle'}</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 bg-white/20 border border-white/30 border-dashed rounded-lg px-3 py-1.5">
          <span className="font-black text-xs tracking-widest">{coupon.code || 'CODE'}</span>
        </div>
      </div>
      <p className="text-white/60 text-[10px] mt-2">⏰ {coupon.expiry || 'Ongoing'}</p>
    </div>
  );
}

function CouponForm({ coupon, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(coupon);
  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preview */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Live Preview</p>
          <CouponPreview coupon={form} />
        </div>
        {/* Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Emoji</label>
              <input value={form.emoji} onChange={e => change('emoji', e.target.value)} className="w-full text-2xl text-center border border-gray-200 rounded-xl px-3 py-2 bg-white" placeholder="🐾" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
              <button
                onClick={() => change('isActive', !form.isActive)}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm transition-all ${form.isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
              >
                {form.isActive ? <><ToggleRight size={18} /> Active</> : <><ToggleLeft size={18} /> Inactive</>}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
            <input value={form.title} onChange={e => change('title', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold bg-white" placeholder="e.g. PAWDAY SALE" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Subtitle</label>
            <input value={form.sub} onChange={e => change('sub', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white" placeholder="e.g. Up to 60% Off Sitewide" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Coupon Code</label>
              <input value={form.code} onChange={e => change('code', e.target.value.toUpperCase())} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-black tracking-widest bg-white" placeholder="SAVE20" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Expiry Text</label>
              <input value={form.expiry} onChange={e => change('expiry', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white" placeholder="3 Days Left / Ongoing" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Color Gradient</label>
            <select value={form.grad} onChange={e => change('grad', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
              {GRADIENT_OPTIONS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"><X size={16} /> Cancel</button>
        <button onClick={() => onSave(form)} disabled={isSaving} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-[#d07e20] text-white hover:bg-[#E06900] disabled:opacity-60 transition-all">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Coupon
        </button>
      </div>
    </div>
  );
}

export default function AdminOffers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('coupons');

  const toast = (msg) => window.dispatchEvent(new CustomEvent('toast', { detail: { message: msg } }));

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('/api/offers');
      setCoupons(res.data);
    } catch (e) {
      toast('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleAdd = async (form) => {
    setIsSaving(true);
    try {
      await axios.post('/api/offers', form);
      toast('Coupon created!');
      setIsAdding(false);
      fetchCoupons();
    } catch (e) { toast('Failed to create coupon'); }
    finally { setIsSaving(false); }
  };

  const handleUpdate = async (form) => {
    setIsSaving(true);
    try {
      await axios.put(`/api/offers/${form.id}`, form);
      toast('Coupon updated!');
      setEditingId(null);
      fetchCoupons();
    } catch (e) { toast('Failed to update coupon'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await axios.delete(`/api/offers/${id}`);
      toast('Coupon deleted');
      fetchCoupons();
    } catch (e) { toast('Failed to delete'); }
  };

  const handleToggle = async (coupon) => {
    try {
      await axios.put(`/api/offers/${coupon.id}`, { ...coupon, isActive: !coupon.isActive });
      fetchCoupons();
    } catch (e) { toast('Failed to update'); }
  };

  return (
    <div className="max-w-5xl animate-fade-in">
      <Toast />
      <ScrollReveal>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-1">Offer Zone Manager</h1>
            <p className="text-gray-500 font-medium">Manage coupons and deal categories shown on the Offers page.</p>
          </div>
        </div>
      </ScrollReveal>

      {/* Tabs */}
      <ScrollReveal delay={50}>
        <div className="flex gap-2 mb-6">
          {[
            { id: 'coupons', label: '🏷️ Coupons', icon: Tag },
            { id: 'categories', label: '🔥 Deal Categories', icon: Flame },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#d07e20] text-white shadow-md shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-200 hover:text-[#d07e20]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* ── COUPONS TAB ── */}
      {activeTab === 'coupons' && (
        <ScrollReveal delay={100}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Tag size={20} className="text-[#d07e20]" />
                <h2 className="text-xl font-bold text-gray-800">Active Coupons</h2>
                <span className="bg-orange-100 text-[#d07e20] text-xs font-bold px-2 py-0.5 rounded-full">{coupons.length}</span>
              </div>
              {!isAdding && (
                <button
                  onClick={() => { setIsAdding(true); setEditingId(null); }}
                  className="flex items-center gap-2 bg-[#d07e20] hover:bg-[#E06900] text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  <Plus size={16} /> Add Coupon
                </button>
              )}
            </div>

            {/* Add form */}
            {isAdding && (
              <div className="mb-5">
                <CouponForm
                  coupon={BLANK_COUPON}
                  onSave={handleAdd}
                  onCancel={() => setIsAdding(false)}
                  isSaving={isSaving}
                />
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-[#d07e20]" size={32} />
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🏷️</div>
                <p className="text-gray-500 font-medium">No coupons yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {coupons.map(coupon => (
                  <div key={coupon.id}>
                    {editingId === coupon.id ? (
                      <CouponForm
                        coupon={coupon}
                        onSave={handleUpdate}
                        onCancel={() => setEditingId(null)}
                        isSaving={isSaving}
                      />
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-100 transition-all group">
                        {/* Mini preview */}
                        <div className={`bg-gradient-to-r ${coupon.grad} rounded-xl p-3 text-white min-w-[180px] relative overflow-hidden shrink-0`}>
                          <div className="text-xl mb-0.5">{coupon.emoji}</div>
                          <p className="font-black text-sm leading-tight">{coupon.title}</p>
                          <p className="text-white/80 text-[10px]">{coupon.sub}</p>
                          <p className="text-white/70 text-[10px] mt-1 font-black tracking-widest">{coupon.code}</p>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {coupon.isActive ? '✓ Active' : '✗ Inactive'}
                            </span>
                            <span className="text-xs text-gray-400">⏰ {coupon.expiry}</span>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggle(coupon)}
                            title={coupon.isActive ? 'Deactivate' : 'Activate'}
                            className={`p-2 rounded-xl transition-all ${coupon.isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                          >
                            {coupon.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                          <button
                            onClick={() => { setEditingId(coupon.id); setIsAdding(false); }}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      )}

      {/* ── DEAL CATEGORIES TAB ── */}
      {activeTab === 'categories' && (
        <ScrollReveal delay={100}>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} className="text-[#d07e20]" />
              <h2 className="text-xl font-bold text-gray-800">Deal Categories</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              These deal category cards are shown on the Offers page. Editing is coming soon — for now, they are auto-linked to product categories in the shop. To change discount % or images, update your products directly.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DEAL_CATEGORIES.map(d => (
                <div key={d.id} className="rounded-2xl overflow-hidden border" style={{ backgroundColor: d.bg, borderColor: d.border }}>
                  <img src={d.img} alt={d.label} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <p className={`font-black text-sm bg-clip-text text-transparent bg-gradient-to-r ${d.grad}`}>{d.off}</p>
                    <p className="text-gray-700 font-bold text-xs">{d.label}</p>
                    {d.flash && (
                      <span className="inline-block mt-1 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">⚡ FLASH</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-orange-700">🚧 Full deal category editor coming soon</p>
              <p className="text-xs text-orange-600 mt-1">You'll be able to set category images, discount percentages, and flash labels from here.</p>
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
