import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, Tag, Flame, Loader2, ToggleLeft, ToggleRight, Edit3, X, Check, Image as ImageIcon } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import Toast from '../../components/Toast';
import { handleImageUpload } from '../../utils/imageUpload';
import { useData } from '../../context/DataContext';

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

const BLANK_DEAL_CATEGORY = {
  label: '',
  off: '',
  img: '',
  grad: 'from-[#d07e20] to-[#a65d14]',
  bg: '#FFF4ED',
  border: '#e6c8a8',
  flash: false,
};

function DealCategoryPreview({ item }) {
  return (
    <div className="rounded-2xl overflow-hidden border w-full max-w-[200px]" style={{ backgroundColor: item.bg || '#FFF4ED', borderColor: item.border || '#e6c8a8' }}>
      <div className="relative overflow-hidden shrink-0" style={{ height: 110 }}>
        {item.img ? (
          <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${item.grad || 'from-[#d07e20] to-[#a65d14]'} opacity-40`} />
        {item.flash && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 rounded-full px-2 py-0.5">
            <span className="text-white text-[8px] font-bold">⚡ FLASH</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className={`font-black text-sm bg-clip-text text-transparent bg-gradient-to-r ${item.grad || 'from-[#d07e20] to-[#a65d14]'}`}>{item.off || '30% OFF'}</p>
        <p className="text-gray-700 font-bold text-xs">{item.label || 'CATEGORY LABEL'}</p>
      </div>
    </div>
  );
}

function DealCategoryForm({ category, onSave, onCancel, isSaving }) {
  const [form, setForm] = useState(category);
  const [isUploading, setIsUploading] = useState(false);
  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Preview */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Live Preview</p>
          <div className="rounded-2xl overflow-hidden border w-full max-w-[200px]" style={{ backgroundColor: form.bg, borderColor: form.border }}>
            <div className="relative overflow-hidden shrink-0" style={{ height: 110 }}>
              {form.img ? (
                <img src={form.img} alt={form.label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>
              )}
              <div className={`absolute inset-0 bg-gradient-to-t ${form.grad} opacity-40`} />
              {form.flash && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 rounded-full px-2 py-0.5">
                  <span className="text-white text-[8px] font-bold">⚡ FLASH</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className={`font-black text-sm bg-clip-text text-transparent bg-gradient-to-r ${form.grad}`}>{form.off || '30% OFF'}</p>
              <p className="text-gray-700 font-bold text-xs">{form.label || 'CATEGORY LABEL'}</p>
            </div>
          </div>
        </div>
        {/* Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Flash Label</label>
              <button
                type="button"
                onClick={() => change('flash', !form.flash)}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-sm transition-all ${form.flash ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
              >
                {form.flash ? '⚡ Flash Active' : 'No Flash'}
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Discount Text</label>
              <input value={form.off} onChange={e => change('off', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white" placeholder="e.g. 30% OFF" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Label</label>
            <input value={form.label} onChange={e => change('label', e.target.value.toUpperCase())} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold bg-white" placeholder="e.g. DOG FOOD" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Image</label>
            <div className="flex gap-2">
              <input value={form.img} onChange={e => change('img', e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white" placeholder="Paste image URL..." />
              <label className={`cursor-pointer shrink-0 ${isUploading ? 'bg-gray-200 opacity-70' : 'bg-gray-100 hover:bg-gray-200'} px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1.5 text-xs font-semibold transition-colors text-gray-700`}>
                {isUploading ? <Loader2 className="animate-spin" size={14} /> : 'Upload'}
                <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    setIsUploading(true);
                    try {
                      const base64 = await handleImageUpload(e.target.files[0]);
                      change('img', base64);
                    } catch(err) {
                      console.error("Upload failed", err);
                      alert("Image upload failed");
                    } finally {
                      setIsUploading(false);
                    }
                  }
                }} />
              </label>
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Background Color</label>
              <div className="flex gap-1.5">
                <input type="color" value={form.bg && form.bg.startsWith('#') ? form.bg : '#FFF4ED'} onChange={e => change('bg', e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 cursor-pointer p-0 shrink-0" />
                <input value={form.bg} onChange={e => change('bg', e.target.value)} className="w-full border border-gray-200 rounded-xl px-2 py-1 text-xs bg-white" placeholder="#FFF4ED" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Border Color</label>
              <div className="flex gap-1.5">
                <input type="color" value={form.border && form.border.startsWith('#') ? form.border : '#e6c8a8'} onChange={e => change('border', e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 cursor-pointer p-0 shrink-0" />
                <input value={form.border} onChange={e => change('border', e.target.value)} className="w-full border border-gray-200 rounded-xl px-2 py-1 text-xs bg-white" placeholder="#e6c8a8" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 justify-end">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"><X size={16} /> Cancel</button>
        <button type="button" onClick={() => onSave(form)} disabled={isSaving} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold bg-[#d07e20] text-white hover:bg-[#E06900] disabled:opacity-60 transition-all">
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Category
        </button>
      </div>
    </div>
  );
}

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
  const { refreshData, products } = useData();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('coupons');

  // Deal Categories state
  const [dealCategories, setDealCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Flash Sale state
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingProductId, setUpdatingProductId] = useState(null);

  const handleToggleFlashSale = async (product, checked) => {
    setUpdatingProductId(product.id);
    try {
      await axios.put(`/api/products/${product.id}`, {
        isFlashSale: checked,
        flashSaleLeft: product.flashSaleLeft || 10
      });
      toast(`Updated ${product.name} Flash Sale status.`);
      refreshData();
    } catch (err) {
      toast('Failed to update product');
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleUpdateFlashStock = async (product, val) => {
    const stock = parseInt(val, 10);
    if (isNaN(stock) || stock < 0) return;
    setUpdatingProductId(product.id);
    try {
      await axios.put(`/api/products/${product.id}`, {
        isFlashSale: product.isFlashSale,
        flashSaleLeft: stock
      });
      toast(`Updated stock for ${product.name}.`);
      refreshData();
    } catch (err) {
      toast('Failed to update stock');
    } finally {
      setUpdatingProductId(null);
    }
  };

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

  const fetchDealCategories = async () => {
    try {
      const res = await axios.get('/api/deal-categories');
      setDealCategories(res.data);
    } catch (e) {
      toast('Failed to load deal categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchDealCategories();
  }, []);

  const handleAddCategory = async (form) => {
    setIsSaving(true);
    try {
      await axios.post('/api/deal-categories', form);
      toast('Deal Category created!');
      setIsAddingCategory(false);
      fetchDealCategories();
      refreshData();
    } catch (e) { toast('Failed to create category'); }
    finally { setIsSaving(false); }
  };

  const handleUpdateCategory = async (form) => {
    setIsSaving(true);
    try {
      await axios.put(`/api/deal-categories/${form.id}`, form);
      toast('Deal Category updated!');
      setEditingCategoryId(null);
      fetchDealCategories();
      refreshData();
    } catch (e) { toast('Failed to update category'); }
    finally { setIsSaving(false); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this deal category?')) return;
    try {
      await axios.delete(`/api/deal-categories/${id}`);
      toast('Deal Category deleted');
      fetchDealCategories();
      refreshData();
    } catch (e) { toast('Failed to delete category'); }
  };

  const handleToggleCategoryFlash = async (category) => {
    try {
      await axios.put(`/api/deal-categories/${category.id}`, { ...category, flash: !category.flash });
      fetchDealCategories();
      refreshData();
    } catch (e) { toast('Failed to update category'); }
  };

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
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide shrink-0 pb-1">
          {[
            { id: 'coupons', label: '🏷️ Coupons', icon: Tag },
            { id: 'categories', label: '🔥 Deal Categories', icon: Flame },
            { id: 'flash', label: '⚡ Flash Sale Products', icon: Flame },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
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
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-100 transition-all group">
                        {/* Mini preview */}
                        <div className={`bg-gradient-to-r ${coupon.grad} rounded-xl p-3 text-white sm:min-w-[180px] w-full sm:w-auto relative overflow-hidden shrink-0`}>
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
                        <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-150 sm:border-transparent">
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
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-[#d07e20]" />
                <h2 className="text-xl font-bold text-gray-800">Deal Categories</h2>
                <span className="bg-orange-100 text-[#d07e20] text-xs font-bold px-2 py-0.5 rounded-full">{dealCategories.length}</span>
              </div>
              {!isAddingCategory && (
                <button
                  onClick={() => { setIsAddingCategory(true); setEditingCategoryId(null); }}
                  className="flex items-center gap-2 bg-[#d07e20] hover:bg-[#E06900] text-white px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm"
                >
                  <Plus size={16} /> Add Category
                </button>
              )}
            </div>

            {/* Add form */}
            {isAddingCategory && (
              <div className="mb-5">
                <DealCategoryForm
                  category={BLANK_DEAL_CATEGORY}
                  onSave={handleAddCategory}
                  onCancel={() => setIsAddingCategory(false)}
                  isSaving={isSaving}
                />
              </div>
            )}

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-[#d07e20]" size={32} />
              </div>
            ) : dealCategories.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🔥</div>
                <p className="text-gray-500 font-medium">No deal categories yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dealCategories.map(category => (
                  <div key={category.id}>
                    {editingCategoryId === category.id ? (
                      <DealCategoryForm
                        category={category}
                        onSave={handleUpdateCategory}
                        onCancel={() => setEditingCategoryId(null)}
                        isSaving={isSaving}
                      />
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-100 transition-all group">
                        {/* Mini preview */}
                        <div className="rounded-xl overflow-hidden border shrink-0 w-full sm:w-[140px]" style={{ backgroundColor: category.bg, borderColor: category.border }}>
                          <div className="relative overflow-hidden shrink-0" style={{ height: 80 }}>
                            {category.img ? (
                              <img src={category.img} alt={category.label} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                            )}
                            <div className={`absolute inset-0 bg-gradient-to-t ${category.grad} opacity-40`} />
                            {category.flash && (
                              <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-red-500 rounded-full px-1.5 py-0.5">
                                <span className="text-white text-[7px] font-bold">⚡ FLASH</span>
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className={`font-black text-xs bg-clip-text text-transparent bg-gradient-to-r ${category.grad}`}>{category.off}</p>
                            <p className="text-gray-700 font-bold text-[10px] truncate">{category.label}</p>
                          </div>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${category.flash ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                              {category.flash ? '⚡ Flash Sale Category' : 'Standard Category'}
                            </span>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-150 sm:border-transparent">
                          <button
                            onClick={() => handleToggleCategoryFlash(category)}
                            title={category.flash ? 'Disable Flash' : 'Enable Flash'}
                            className={`p-2 rounded-xl transition-all ${category.flash ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                          >
                            {category.flash ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          </button>
                          <button
                            onClick={() => { setEditingCategoryId(category.id); setIsAddingCategory(false); }}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
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

      {/* ── FLASH SALE TAB ── */}
      {activeTab === 'flash' && (() => {
        const filteredProductsList = (products || []).filter(product => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return product.name.toLowerCase().includes(q) || 
                 (product.brand && product.brand.toLowerCase().includes(q)) ||
                 (product.category && product.category.toLowerCase().includes(q));
        });

        return (
          <ScrollReveal delay={100}>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Flame size={20} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                  <h2 className="text-xl font-bold text-gray-800">Flash Sale Products</h2>
                  <span className="bg-orange-100 text-[#d07e20] text-xs font-bold px-2 py-0.5 rounded-full">
                    {(products || []).filter(p => p.isFlashSale).length} Active
                  </span>
                </div>
              </div>

              {/* Search filter */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products to add to Flash Sale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#d07e20] focus:ring-2 focus:ring-orange-100 transition-all font-medium"
                />
              </div>

              {/* Product list */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {filteredProductsList.map((product) => {
                  const isFlash = product.isFlashSale;
                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={product.img} alt={product.name} className="w-12 h-12 object-cover rounded-xl border border-gray-200 bg-white" />
                        <div>
                          <p className="font-bold text-gray-800 text-sm leading-snug">{product.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{product.brand} • ₹{product.price} <span className="line-through">₹{product.mrp}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Stock edit field */}
                        {isFlash && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">Stock Left:</span>
                            <input
                              type="number"
                              min="0"
                              defaultValue={product.flashSaleLeft ?? 10}
                              onBlur={(e) => handleUpdateFlashStock(product, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateFlashStock(product, e.target.value);
                                  e.target.blur();
                                }
                              }}
                              className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-center font-bold text-xs focus:outline-none focus:border-[#d07e20]"
                            />
                          </div>
                        )}

                        {/* Toggle Switch */}
                        <button
                          onClick={() => handleToggleFlashSale(product, !isFlash)}
                          disabled={updatingProductId === product.id}
                          className={`flex items-center justify-center p-1 rounded-full transition-colors ${
                            isFlash ? 'text-green-500' : 'text-gray-300'
                          }`}
                        >
                          {updatingProductId === product.id ? (
                            <Loader2 size={24} className="animate-spin text-orange-500" />
                          ) : isFlash ? (
                            <ToggleRight size={32} className="text-green-500 fill-green-50" />
                          ) : (
                            <ToggleLeft size={32} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredProductsList.length === 0 && (
                  <p className="text-center text-gray-500 font-semibold py-8">No products found matching your search</p>
                )}
              </div>
            </div>
          </ScrollReveal>
        );
      })()}
    </div>
  );
}
