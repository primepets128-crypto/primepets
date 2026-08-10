import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Tag } from 'lucide-react';

export default function AdminCategories() {
  const { categories, refreshData } = useData();
  const { showToast } = useCart();
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultCategory = {
    label: '', emoji: '', img: '', bg: '#FFFFFF'
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing.id) {
        await axios.put(`/api/categories/${editing.id}`, editing);
        showToast('Category updated successfully!');
      } else {
        await axios.post('/api/categories', editing);
        showToast('New category added!');
      }
      await refreshData();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving category.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        showToast('Category deleted.');
        await refreshData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting category.');
      }
    }
  };

  const filteredCategories = categories.filter(c => 
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        {/* Header & Search */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          <p className="text-sm text-gray-500">Manage store categories</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => { setEditing(defaultCategory); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Category</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">Category</th>
              <th className="p-4 font-semibold">Emoji</th>
              <th className="p-4 font-semibold">Background Color</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCategories.map(c => (
              <tr key={c.id || c.label} className="hover:bg-orange-50/30 transition-colors group">
                <td className="p-4 pl-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200/50 shadow-sm" style={{ backgroundColor: c.bg }}>
                    {c.img ? (
                      <img src={c.img} alt={c.label} className="w-full h-full object-cover mix-blend-multiply" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                    )}
                  </div>
                  <span className="font-bold text-gray-800">{c.label}</span>
                </td>
                <td className="p-4 text-2xl">{c.emoji}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border shadow-inner" style={{ backgroundColor: c.bg }}></div>
                    <span className="text-sm font-medium text-gray-600">{c.bg}</span>
                  </div>
                </td>
                <td className="p-4 pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit Category" onClick={() => { setEditing(c); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button title="Delete Category" onClick={() => handleDelete(c.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <Tag size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No categories found</p>
                    <p className="text-sm">Try adjusting your search or add a new category.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form id="categoryForm" onSubmit={handleSave} className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editing.id ? 'Edit Category' : 'Add New Category'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-6">
                
                {/* Image Preview Area */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-full border shadow-sm flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: editing.bg || '#FFF' }}>
                    {editing.img ? (
                      <img src={editing.img} alt="Preview" className="w-full h-full object-cover mix-blend-multiply" />
                    ) : (
                      <span className="text-3xl">{editing.emoji || <ImageIcon size={24} className="text-gray-300"/>}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <input type="url" placeholder="Paste URL here..." value={editing.img || ''} onChange={e => setEditing({...editing, img: e.target.value})} className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" />
                        <span className="text-sm text-gray-500 flex items-center">OR</span>
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl border border-gray-200 flex items-center text-sm font-medium transition-colors text-gray-700">
                          Upload
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                try {
                                  const base64 = await handleImageUpload(e.target.files[0]);
                                  setEditing({...editing, img: base64});
                                } catch(err) {
                                  console.error("Upload failed", err);
                                  alert("Image upload failed");
                                }
                              }
                          }} />
                        </label>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Recommended size: 200x200px (Transparent PNG)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category Label <span className="text-red-500">*</span></label>
                    <input required type="text" placeholder="e.g. Dog Food" value={editing.label || ''} onChange={e => setEditing({...editing, label: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Emoji</label>
                      <input type="text" placeholder="e.g. 🐶" value={editing.emoji || ''} onChange={e => setEditing({...editing, emoji: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Background Color</label>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                        <input type="color" value={editing.bg || '#FFFFFF'} onChange={e => setEditing({...editing, bg: e.target.value})} className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <input required type="text" value={editing.bg || '#FFFFFF'} onChange={e => setEditing({...editing, bg: e.target.value})} className="w-full bg-transparent border-none focus:outline-none text-sm uppercase font-medium text-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">
                {editing.id ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </>
  );
}
