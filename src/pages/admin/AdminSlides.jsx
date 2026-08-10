import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { handleImageUpload } from '../../utils/imageUpload';
import MediaDisplay from '../../components/MediaDisplay';
import { useData } from '../../context/DataContext';
import { useCart } from '../../context/CartContext';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, LayoutTemplate } from 'lucide-react';

export default function AdminSlides() {
  const { slides, banners, refreshData } = useData();
  const { showToast } = useCart();
  const [editingSlide, setEditingSlide] = useState(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultSlide = {
    heroImage: ''
  };


  const handleSaveSlide = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide.id) {
        await axios.put(`/api/slides/${editingSlide.id}`, editingSlide);
        showToast('Slide updated successfully!');
      } else {
        await axios.post('/api/slides', editingSlide);
        showToast('New slide added!');
      }
      await refreshData();
      setIsSlideModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Error saving slide.');
    }
  };

  const handleDeleteSlide = async (id) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      try {
        await axios.delete(`/api/slides/${id}`);
        showToast('Slide deleted.');
        await refreshData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting slide.');
      }
    }
  };
  const filteredSlides = slides.filter(s => 
    s.id.toString().includes(searchQuery)
  );


  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
        {/* Header & Search */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hero Banners</h2>
          <p className="text-sm text-gray-500">Manage homepage visuals</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button onClick={() => { setEditingSlide(defaultSlide); setIsSlideModalOpen(true); }} className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap">
            <Plus size={18} /> Add Banner
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-semibold pl-6">ID</th>
              <th className="p-4 font-semibold">Media</th>
              <th className="p-4 font-semibold text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredSlides.map(s => (
              <tr key={s.id} className="hover:bg-orange-50/30 transition-colors group">
                <td className="p-4 pl-6">
                  <p className="font-bold text-gray-800 text-xs text-gray-500">#{s.id}</p>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {s.heroImage ? (
                      <div className={`w-24 h-12 rounded-xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center`}>
                        <MediaDisplay src={s.heroImage} alt="hero bg" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300"><ImageIcon size={16}/></div>
                    )}
                  </div>
                </td>
                <td className="p-4 pr-6">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Edit Banner" onClick={() => { setEditingSlide(s); setIsSlideModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button title="Delete Banner" onClick={() => handleDeleteSlide(s.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSlides.length === 0 && (
              <tr>
                <td colSpan="3" className="p-12 text-center">
                  <div className="inline-flex flex-col items-center justify-center text-gray-400">
                    <LayoutTemplate size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-500">No banners found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {isSlideModalOpen && createPortal(
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleSaveSlide} className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editingSlide.id ? 'Edit Slide' : 'Add New Slide'}</h3>
              <button type="button" onClick={() => setIsSlideModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white border rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-8">
                
                {/* Visual Preview */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><ImageIcon size={16}/> Live Preview Layout</h4>
                  <div className="w-full h-32 rounded-xl shadow-inner flex overflow-hidden relative bg-gray-900">
                    {editingSlide.heroImage ? (
                      <MediaDisplay src={editingSlide.heroImage} className="absolute inset-0 w-full h-full object-cover" alt="hero bg" />
                    ) : (
                      <div className="flex w-full items-center justify-center text-gray-500 text-sm">Upload an image to see preview</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 border-b pb-2">🖼️ Media</h4>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Banner Media (Image or Video) <span className="text-red-500">*</span>
                      <span className="block text-xs text-gray-400 font-normal mt-0.5">Recommended Size: 1920x640 pixels (3:1 ratio)</span>
                    </label>
                    <div className="flex gap-2 items-center">
                       {editingSlide.heroImage && <MediaDisplay src={editingSlide.heroImage} className="w-16 h-10 rounded bg-gray-100 object-cover shrink-0 border" alt="thumb" />}
                       <div className="flex-1 flex flex-col">
                         <div className="flex gap-2">
                           <input type="url" value={editingSlide.heroImage || ''} onChange={e => setEditingSlide({...editingSlide, heroImage: e.target.value})} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm" placeholder="Paste media URL here..." />
                           <span className="text-sm text-gray-500 flex items-center">OR</span>
                           <label className="cursor-pointer bg-white hover:bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 flex items-center text-sm font-medium transition-colors text-gray-700">
                             Upload
                             <input type="file" accept="image/*,video/*" className="hidden" onChange={async (e) => {
                                 if (e.target.files && e.target.files[0]) {
                                   try {
                                     const base64 = await handleImageUpload(e.target.files[0]);
                                     setEditingSlide({...editingSlide, heroImage: base64});
                                   } catch(err) {
                                     console.error("Upload failed", err);
                                     alert("Image upload failed");
                                   }
                                 }
                             }} />
                           </label>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
              <button type="button" onClick={() => setIsSlideModalOpen(false)} className="px-6 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 font-bold text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">
                {editingSlide.id ? 'Save Changes' : 'Create Slide'}
              </button>
            </div>
          </form>
        </div>
      , document.body)}
    </>
  );
}
