import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Mail, Users, FileUp, Loader, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function AdminCampaigns() {
  const { showToast } = useCart();
  const [emails, setEmails] = useState([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  
  const [targetType, setTargetType] = useState('ALL'); // 'ALL' or 'SPECIFIC'
  const [targetEmail, setTargetEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachment, setAttachment] = useState(null);
  
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await axios.get('/api/campaigns/emails', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmails(res.data.emails || []);
    } catch (err) {
      console.error('Failed to fetch emails', err);
      showToast('Could not load email list');
    } finally {
      setLoadingEmails(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      showToast("File is too large! Maximum 10MB allowed.");
      e.target.value = '';
      setAttachment(null);
      return;
    }
    setAttachment(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      showToast('Subject and message body are required.');
      return;
    }
    if (targetType === 'SPECIFIC' && !targetEmail.trim()) {
      showToast('Please specify a target email address.');
      return;
    }

    if (targetType === 'ALL' && emails.length === 0) {
      showToast('No customers found to send emails to.');
      return;
    }

    setSending(true);

    try {
      const formData = new FormData();
      formData.append('targetType', targetType);
      formData.append('subject', subject);
      formData.append('body', body);
      
      if (targetType === 'SPECIFIC') {
        formData.append('targetEmail', targetEmail);
      }
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const res = await axios.post('/api/campaigns/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      showToast(res.data.message || 'Campaign sent successfully!');
      
      // Reset form on success
      setSubject('');
      setBody('');
      setAttachment(null);
      document.getElementById('file-upload').value = '';
      if (targetType === 'SPECIFIC') setTargetEmail('');

    } catch (err) {
      console.error('Failed to send campaign', err);
      showToast(err.response?.data?.error || 'Failed to send campaign');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3 tracking-tight">
          <Mail className="text-[#d07e20]" />
          Email Campaigns
        </h1>
        <p className="text-gray-500 font-medium mt-2">Send promotional emails and announcements to your customers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-3xl p-6">
          <div className="flex items-center gap-3 text-[#d07e20] mb-2">
            <Users size={20} />
            <h3 className="font-bold text-gray-800">Audience Size</h3>
          </div>
          {loadingEmails ? (
            <p className="text-gray-400 text-sm flex items-center gap-2"><Loader size={14} className="animate-spin" /> Counting...</p>
          ) : (
            <div>
              <p className="text-3xl font-black text-gray-800">{emails.length}</p>
              <p className="text-gray-500 font-medium text-xs mt-1">Unique customer emails collected</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Compose Campaign</h2>

        <div className="space-y-6">
          {/* Target Audience */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="targetType" 
                  value="ALL"
                  checked={targetType === 'ALL'}
                  onChange={() => setTargetType('ALL')}
                  className="accent-[#d07e20]"
                />
                <span className="text-gray-800 text-sm font-medium">All Collected Customers ({emails.length})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="targetType" 
                  value="SPECIFIC"
                  checked={targetType === 'SPECIFIC'}
                  onChange={() => setTargetType('SPECIFIC')}
                  className="accent-[#d07e20]"
                />
                <span className="text-gray-800 text-sm font-medium">Specific Email</span>
              </label>
            </div>
          </div>

          {targetType === 'SPECIFIC' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Recipient Email Address</label>
              <input
                type="email"
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#d07e20] focus:ring-1 focus:ring-[#d07e20] transition-all"
                required={targetType === 'SPECIFIC'}
              />
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Huge Festive Sale! 50% Off Dog Food 🐶"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#d07e20] focus:ring-1 focus:ring-[#d07e20] transition-all font-semibold"
              required
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">Message Body</label>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">HTML Supported</span>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Hi there! We are excited to announce..."
              rows={8}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#d07e20] focus:ring-1 focus:ring-[#d07e20] transition-all resize-y"
              required
            />
            <div className="mt-2 flex items-start gap-2 bg-[#d07e20]/10 border border-[#d07e20]/20 rounded-lg p-3">
              <AlertCircle size={16} className="text-[#d07e20] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-800 leading-relaxed font-medium">
                You can type normal text, or paste HTML (like <code>&lt;b&gt;bold&lt;/b&gt;</code> or <code>&lt;a href="..."&gt;links&lt;/a&gt;</code>) for advanced formatting. Line breaks are automatically converted.
              </p>
            </div>
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Attachment (Optional)</label>
            <div className="relative">
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label 
                htmlFor="file-upload" 
                className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 hover:border-[#d07e20] rounded-xl px-4 py-8 cursor-pointer transition-colors group bg-gray-50"
              >
                {attachment ? (
                  <div className="text-center">
                    <p className="text-gray-800 font-bold group-hover:text-[#d07e20] transition-colors">{attachment.name}</p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-[#d07e20]/20 group-hover:text-[#d07e20] transition-colors text-gray-500">
                      <FileUp size={20} />
                    </div>
                    <p className="text-gray-500 text-sm font-bold group-hover:text-gray-800 transition-colors">Click to upload a file (Max 10MB)</p>
                    <p className="text-xs text-gray-400 font-medium">Images, PDFs, Documents</p>
                  </div>
                )}
              </label>
              {attachment && (
                <button
                  type="button"
                  onClick={() => { setAttachment(null); document.getElementById('file-upload').value = ''; }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1 bg-red-50 rounded-lg border border-red-100"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 bg-[#d07e20] text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#d07e20] shadow-sm"
          >
            {sending ? (
              <>
                <Loader size={18} className="animate-spin" />
                Sending Campaign...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Campaign
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
