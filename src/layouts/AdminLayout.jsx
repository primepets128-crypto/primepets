import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Image, Percent,
  Menu, X, Settings, Users, ShoppingBag, CreditCard, Music2, Activity
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/live', label: 'Live Website', icon: Activity },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/categories', label: 'Category Images', icon: Image },
  { path: '/admin/slides', label: 'Slides', icon: Image },
  { path: '/admin/deals', label: 'Deals', icon: Percent },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/payment', label: 'Payment', icon: CreditCard },
  { path: '/admin/music', label: 'Music', icon: Music2 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 z-50 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0">
          <Link to="/admin" className="font-bold text-xl text-orange-500 flex items-center gap-2">
            🐾 Admin Panel
          </Link>
          <button className="md:hidden p-2 text-gray-500" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-orange-50 text-orange-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {item.label === 'Orders' && (
                  <span className="ml-auto text-[10px] bg-orange-100 text-orange-600 font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors px-4 py-2">
            ← View Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b flex items-center px-4 md:px-8 gap-4 sticky top-0 z-30 shadow-sm">
          <button className="md:hidden p-2 -ml-2 text-gray-600" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="font-semibold text-lg text-gray-800">
            {NAV_ITEMS.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">Prime Pets Admin</span>
            <Link to="/" className="text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors">
              View Store
            </Link>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
