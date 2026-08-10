import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ChevronLeft, ArrowRight, Lock, Mail, User } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d07e20]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5c3110]/20 rounded-full blur-[120px] pointer-events-none" />
      
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-orange-200 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <ScrollReveal>
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-white/20 p-2 shadow-lg">
              <img src={settings.logoBase64 || "/MA_logo.png"} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-[#d07e20]">
              {isLogin ? 'Welcome Back!' : 'Join the Pack'}
            </h1>
            <p className="text-orange-200/50 text-sm mt-2">
              {isLogin ? 'Sign in to manage your pets and orders.' : 'Create an account for exclusive rewards.'}
            </p>
          </div>

          <div className="bg-[#1a0f08] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
            
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="text-xs font-bold text-orange-200/70 uppercase tracking-wider mb-2 block">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="text" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 focus:border-[#d07e20] rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-orange-200/70 uppercase tracking-wider mb-2 block">Username / Email / Phone</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input 
                    type="text" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#d07e20] rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 outline-none transition-all"
                    placeholder="Enter your identifier"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-orange-200/70 uppercase tracking-wider block">Password</label>
                  {isLogin && <button type="button" className="text-[10px] text-[#d07e20] hover:text-white transition-colors">Forgot?</button>}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#d07e20] rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#d07e20] to-[#a65d14] text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(208,126,32,0.4)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-orange-200/50">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                  className="text-[#d07e20] font-bold ml-2 hover:text-white transition-colors"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
