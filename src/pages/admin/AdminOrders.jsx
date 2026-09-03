import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  Package, ChevronDown, ChevronUp, Trash2, MessageCircle,
  ShoppingBag, Clock, CheckCircle, TrendingUp, RefreshCw,
  IndianRupee, Phone, User, Hash, Filter, Loader2, Download
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ScrollReveal from '../../components/ScrollReveal';

/* ─── Constants ─────────────────────────────────────────────────────────── */

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const FILTER_TABS    = ['All', ...ORDER_STATUSES];

const ORDER_STATUS_STYLES = {
  PENDING:   'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100   text-blue-700',
  SHIPPED:   'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100  text-green-700',
  CANCELLED: 'bg-red-100    text-red-700',
};

const PAYMENT_STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID:    'bg-green-100  text-green-700',
  FAILED:  'bg-red-100    text-red-700',
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function parseItems(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  try { return JSON.parse(items); } catch { return []; }
}

function buildWhatsAppUrl(order) {
  const phone = String(order.phone || '').replace(/\D/g, '');
  const cc    = phone.startsWith('91') ? phone : `91${phone}`;
  const items = parseItems(order.items);
  const itemList = items.map(i => `• ${i.name || i.productName || 'Item'} x${i.qty || i.quantity || 1}`).join('\n');
  const text = encodeURIComponent(
    `Hello ${order.customerName || order.name || 'Customer'}! 🐾\n\n` +
    `Your Prime Pets order *#${String(order.id).slice(-6).toUpperCase()}* update:\n\n` +
    `${itemList || '(see order details)'}\n\n` +
    `Total: ₹${order.total || order.totalAmount || 0}\n` +
    `Status: ${order.status}\n\n` +
    `Thank you for shopping with us! 🐶🐱`
  );
  return `https://wa.me/${cc}?text=${text}`;
}

function downloadInvoice(order) {
  const itemList = parseItems(order.items);
  const subtotal = itemList.reduce((sum, item) => sum + (Number(item.price || item.sellingPrice || 0) * (item.qty || item.quantity || 1)), 0);
  const gst = Math.round(subtotal * 0.18);
  const totalRaw = Number(order.total || order.totalAmount || 0);
  const delivery = Math.max(0, totalRaw - subtotal - gst);
  const total = totalRaw.toLocaleString('en-IN');
  
  const html = `
    <html>
      <head>
        <title>Invoice - ${order.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            padding: 40px;
            color: #374151;
            margin: 0;
            line-height: 1.5;
            background: #f3f4f6;
          }
          .invoice-container {
            max-width: 800px;
            margin: auto;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #5c3110 0%, #d07e20 100%);
            color: white;
            padding: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .header-logo h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -1px;
          }
          .header-logo p {
            margin: 5px 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .header-info {
            text-align: right;
          }
          .header-info h2 {
            margin: 0 0 5px;
            font-size: 24px;
            letter-spacing: 2px;
            opacity: 0.9;
          }
          .header-info p {
            margin: 2px 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .content {
            padding: 40px;
          }
          .details-grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }
          .details-section h3 {
            color: #d07e20;
            margin: 0 0 10px;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .details-section p {
            margin: 4px 0;
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            background-color: #fff7ed;
            color: #d07e20;
            font-weight: 600;
            text-align: left;
            padding: 12px 15px;
            border-bottom: 2px solid #fdba74;
          }
          td {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .summary-box {
            width: 300px;
            float: right;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .summary-row.grand-total {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            font-size: 18px;
            font-weight: 800;
            color: #5c3110;
          }
          .clear { clear: both; }
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #e5e7eb;
          }
          .footer-thanks {
            color: #d07e20;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
          }
          .socials {
            margin-bottom: 20px;
          }
          .socials span {
            display: inline-block;
            margin: 0 10px;
            font-size: 13px;
            color: #6b7280;
          }
          .contact-info {
            font-size: 12px;
            color: #9ca3af;
          }
          @media print {
            body { background: white; padding: 0; }
            .invoice-container { box-shadow: none; border: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="header-logo" style="display: flex; align-items: center; gap: 15px;">
              <img src="${window.location.origin}/logo.png" alt="Prime Pets Logo" style="height: 60px; max-width: 150px; object-fit: contain; background: white; border-radius: 8px; padding: 5px;" />
              <div>
                <h1>Prime Pets</h1>
                <p>Premium Pet Supplies & Care</p>
              </div>
            </div>
            <div class="header-info">
              <h2>INVOICE</h2>
              <p><strong>Order #</strong> ${String(order.id).slice(-6).toUpperCase()}</p>
              <p><strong>Date:</strong> ${formatDate(order.createdAt || order.date)}</p>
            </div>
          </div>
          
          <div class="content">
            <div class="details-grid">
              <div class="details-section">
                <h3>Billed To</h3>
                <p><strong>${order.customerName || order.name || 'Customer'}</strong></p>
                <p>📞 ${order.phone || order.customerPhone || '—'}</p>
                <p style="max-width: 250px;">📍 ${order.address || order.deliveryAddress || '—'}</p>
              </div>
              <div class="details-section text-right">
                <h3>Payment Info</h3>
                <p><strong>Method:</strong> ${order.paymentMethod || order.payment || '—'}</p>
                <p><strong>Status:</strong> <span style="color: ${order.paymentStatus === 'PAID' ? '#059669' : '#d97706'}">${order.paymentStatus || 'PENDING'}</span></p>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th class="text-center">Qty</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
                ${itemList.map(item => {
                  const qty = item.qty || item.quantity || 1;
                  const price = Number(item.price || item.sellingPrice || 0);
                  return `
                    <tr>
                      <td>
                        <strong>${item.name || item.productName || 'Item'}</strong>
                        ${item.brand ? `<br><span style="color: #6b7280; font-size: 12px;">Brand: ${item.brand}</span>` : ''}
                      </td>
                      <td class="text-center">${qty}</td>
                      <td class="text-right">Rs. ${price.toLocaleString('en-IN')}</td>
                      <td class="text-right"><strong>Rs. ${(price * qty).toLocaleString('en-IN')}</strong></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div class="summary-box">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>Rs. ${subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="summary-row">
                <span>GST (18%)</span>
                <span>Rs. ${gst.toLocaleString('en-IN')}</span>
              </div>
              <div class="summary-row">
                <span>Delivery</span>
                <span>Rs. ${delivery.toLocaleString('en-IN')}</span>
              </div>
              <div class="summary-row grand-total">
                <span>Grand Total</span>
                <span>Rs. ${total}</span>
              </div>
            </div>
            <div class="clear"></div>
            
            <div class="footer">
              <div class="footer-thanks">Thank you for choosing Prime Pets! 🐶🐱</div>
              <div class="socials" style="display: flex; justify-content: center; align-items: center; gap: 24px; flex-wrap: wrap;">
                <span style="display: flex; align-items: center; gap: 6px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  @primepets_in
                </span>
                <span style="display: flex; align-items: center; gap: 6px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  /primepetsindia
                </span>
                <span style="display: flex; align-items: center; gap: 6px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  +91 98765 43210
                </span>
                <span style="display: flex; align-items: center; gap: 6px;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  1800-123-PRIME
                </span>
              </div>
              <div class="contact-info">
                Prime Pets HQ, 123 Pet Street, Mumbai, 400001<br>
                www.primepets.in | help@primepets.in
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StatusBadge({ status }) {
  const cls = ORDER_STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {status || '—'}
    </span>
  );
}

function PaymentBadge({ status }) {
  const cls = PAYMENT_STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {status || '—'}
    </span>
  );
}

function ExpandedItems({ items }) {
  const parsed = parseItems(items);
  if (!parsed.length) {
    return <p className="text-gray-400 text-sm italic">No item details available.</p>;
  }
  return (
    <div className="space-y-2">
      {parsed.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            {item.img || item.image ? (
              <img
                src={item.img || item.image}
                alt={item.name || item.productName}
                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                onError={e => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                <Package size={16} className="text-orange-400" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800 text-sm">{item.name || item.productName || `Item #${idx + 1}`}</p>
              {item.brand && <p className="text-xs text-gray-400">{item.brand}</p>}
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500">Qty: <span className="font-bold text-gray-700">{item.qty || item.quantity || 1}</span></span>
            <span className="text-orange-600 font-bold">₹{item.price || item.sellingPrice || '—'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────────────── */

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-3xl font-black text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 font-semibold">{label}</p>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function AdminOrders() {
  const { showToast } = useCart();

  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedRow, setExpandedRow]   = useState(null);
  const [updatingId, setUpdatingId]     = useState(null);
  const [deletingId, setDeletingId]     = useState(null);

  /* ── Fetch ── */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(Array.isArray(data) ? data : (data.orders || []));
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      showToast('❌ Failed to load orders.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /* ── Status update ── */
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      showToast(`✅ Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('❌ Failed to update order status.');
      fetchOrders(); // revert
    } finally {
      setUpdatingId(null);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) return;
    setDeletingId(orderId);
    try {
      await axios.delete(`/api/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total     = orders.length;
    const pending   = orders.filter(o => o.status === 'PENDING').length;
    const confirmed = orders.filter(o => o.status === 'CONFIRMED').length;
    const revenue   = orders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.total || o.totalAmount || 0), 0);
    return [
      { label: 'Total Orders',   value: total,     icon: ShoppingBag,  color: 'text-blue-500',   bg: 'bg-blue-50' },
      { label: 'Pending',        value: pending,   icon: Clock,        color: 'text-yellow-500', bg: 'bg-yellow-50' },
      { label: 'Confirmed',      value: confirmed, icon: CheckCircle,  color: 'text-green-500',  bg: 'bg-green-50' },
      { label: 'Total Revenue',  value: `₹${revenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];
  }, [orders]);

  /* ── Filtered orders ── */
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'All') return orders;
    return orders.filter(o => o.status === activeFilter);
  }, [orders, activeFilter]);

  /* ── Toggle expand ── */
  const toggleExpand = (id) => setExpandedRow(prev => (prev === id ? null : id));

  /* ─────────────────────────────────────────────────────────────────────── */

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Page Header */}
      <ScrollReveal>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-1">Orders</h1>
            <p className="text-gray-500 font-medium">Manage and track customer orders.</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all shadow-sm text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <ScrollReveal delay={100}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </ScrollReveal>

      {/* Table Card */}
      <ScrollReveal delay={200}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card Header + Filters */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Order List</h2>
              <p className="text-sm text-gray-500">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} shown
              </p>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter size={14} className="text-gray-400 mr-1" />
              {FILTER_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeFilter === tab
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-gray-400">
              <RefreshCw size={36} className="animate-spin text-orange-400" />
              <p className="font-medium">Loading orders…</p>
            </div>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-2 py-3 font-semibold pl-4 w-8"></th>
                    <th className="px-2 py-3 font-semibold">
                      <div className="flex items-center gap-1"><Hash size={12} /> ID</div>
                    </th>
                    <th className="px-2 py-3 font-semibold">Date</th>
                    <th className="px-2 py-3 font-semibold">
                      <div className="flex items-center gap-1"><User size={12} /> Customer</div>
                    </th>
                    <th className="px-2 py-3 font-semibold">
                      <div className="flex items-center gap-1"><Phone size={12} /> Phone</div>
                    </th>
                    <th className="px-2 py-3 font-semibold text-center">Items</th>
                    <th className="px-2 py-3 font-semibold">
                      <div className="flex items-center gap-1"><IndianRupee size={12} /> Total</div>
                    </th>
                    <th className="px-2 py-3 font-semibold">Pay</th>
                    <th className="px-2 py-3 font-semibold">Status</th>
                    <th className="px-2 py-3 font-semibold">Order</th>
                    <th className="px-2 py-3 font-semibold text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center">
                        <div className="inline-flex flex-col items-center gap-3 text-gray-400">
                          <Package size={52} className="text-gray-200" />
                          <p className="text-lg font-bold text-gray-500">No orders found</p>
                          <p className="text-sm">
                            {activeFilter !== 'All'
                              ? `No ${activeFilter.toLowerCase()} orders yet.`
                              : 'Orders placed by customers will appear here.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const isExpanded   = expandedRow === order.id;
                      const itemList     = parseItems(order.items);
                      const itemCount    = itemList.length || order.itemCount || '—';
                      const orderTotal   = order.total || order.totalAmount || 0;
                      const customerName = order.customerName || order.name || '—';
                      const phone        = order.phone || order.customerPhone || '—';
                      const payMethod    = order.paymentMethod || order.payment || '—';
                      const payStatus    = order.paymentStatus || 'PENDING';
                      const ordStatus    = order.status || 'PENDING';
                      const shortId      = String(order.id).slice(-6).toUpperCase();

                      return (
                        <React.Fragment key={order.id}>
                          {/* Main row */}
                          <tr className={`hover:bg-orange-50/20 transition-colors group ${isExpanded ? 'bg-orange-50/10' : ''}`}>

                            {/* Expand toggle */}
                            <td className="px-2 py-3 pl-4">
                              <button
                                onClick={() => toggleExpand(order.id)}
                                title={isExpanded ? 'Collapse' : 'Show items'}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-orange-100 text-gray-500 hover:text-orange-600 flex items-center justify-center transition-colors"
                              >
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </td>

                            {/* Order ID */}
                            <td className="px-2 py-3">
                              <span className="font-mono font-bold text-gray-700 text-xs">#{shortId}</span>
                            </td>

                            {/* Date */}
                            <td className="px-2 py-3 text-gray-500 text-xs">
                              {formatDate(order.createdAt || order.date)}
                            </td>

                            {/* Customer */}
                            <td className="px-2 py-3">
                              <span className="font-semibold text-gray-800 text-xs">{customerName}</span>
                            </td>

                            {/* Phone */}
                            <td className="px-2 py-3 text-gray-600 text-xs font-medium">
                              {phone}
                            </td>

                            {/* Items count */}
                            <td className="px-2 py-3 text-center">
                              <span className="bg-orange-50 text-orange-600 font-bold text-xs px-2 py-1 rounded-full border border-orange-100">
                                {itemCount}
                              </span>
                            </td>

                            {/* Total */}
                            <td className="px-2 py-3 font-bold text-gray-800 text-xs">
                              ₹{Number(orderTotal).toLocaleString('en-IN')}
                            </td>

                            {/* Payment Method */}
                            <td className="px-2 py-3">
                              {payMethod === 'COD' ? (
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">COD</span>
                              ) : (
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-bold">{payMethod}</span>
                              )}
                            </td>

                            {/* Payment Status */}
                            <td className="px-2 py-3">
                              <PaymentBadge status={payStatus} />
                            </td>

                            {/* Order Status dropdown */}
                            <td className="px-2 py-3">
                              <div className="relative inline-block">
                                <select
                                  value={ordStatus}
                                  disabled={updatingId === order.id}
                                  onChange={e => handleStatusChange(order.id, e.target.value)}
                                  className={`appearance-none pl-2 pr-6 py-1 rounded-lg border text-xs font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all disabled:opacity-60 disabled:cursor-wait border-transparent ${ORDER_STATUSES.includes(ordStatus) ? ORDER_STATUS_STYLES[ordStatus] : 'bg-gray-100 text-gray-600'}`}
                                >
                                  {ORDER_STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                                <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-2 py-3 pr-4">
                              <div className="flex items-center justify-end gap-1">
                                {/* WhatsApp */}
                                <a
                                  href={buildWhatsAppUrl({ ...order, customerName, phone, status: ordStatus })}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Send WhatsApp message"
                                  className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <MessageCircle size={16} />
                                </a>
                                {/* Download Invoice */}
                                <button
                                  title="Download Invoice PDF"
                                  onClick={() => downloadInvoice(order)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                                  <Download size={16} />
                                </button>
                                {/* Delete */}
                                <button
                                  title="Delete order"
                                  onClick={() => handleDelete(order.id)}
                                  disabled={deletingId === order.id}
                                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingId === order.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expandable items row */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={11} className="px-8 py-5 bg-gradient-to-r from-orange-50/60 to-amber-50/30 border-b border-orange-100/50">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <Package size={12} className="text-orange-400" />
                                  Order Items — #{shortId}
                                </p>
                                <ExpandedItems items={order.items} />
                                {(order.address || order.deliveryAddress) && (
                                  <div className="mt-3 pt-3 border-t border-orange-100 text-sm text-gray-500">
                                    <span className="font-semibold text-gray-600">Delivery address: </span>
                                    {order.address || order.deliveryAddress}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
