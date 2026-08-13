import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, User as UserIcon, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ChatBot() {
  const { user, login, register, checkUserExists, isAuthenticated } = useAuth();
  const { frontendSettings } = useData();
  const settings = frontendSettings || {};
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState('INITIAL');
  
  // Lead info
  const [capturedName, setCapturedName] = useState('');
  const [capturedContact, setCapturedContact] = useState('');
  const [authMode, setAuthMode] = useState(''); // 'login' or 'register'
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Auto-trigger rich interactive lead catcher after 13s
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen((prev) => {
        if (!prev) return true;
        return prev;
      });
    }, 13000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize chat flow when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      if (isAuthenticated) {
        setStep('MAIN_MENU');
        setMessages([
          { sender: 'bot', text: `Hi ${user?.name?.split(' ')[0]}! How can I assist you today?`, isMenu: true }
        ]);
      } else {
        setStep('ASK_NAME');
        setMessages([
          { sender: 'bot', text: `Hi there! I'm your ${settings.storeName || 'Prime Pets'} assistant. To get started, could you please tell me your name?` }
        ]);
      }
    }
  }, [isOpen, isAuthenticated, user, messages.length]);

  const addMessage = (text, sender, isMenu = false) => {
    setMessages(prev => [...prev, { text, sender, isMenu }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const input = inputValue.trim();
    setInputValue('');

    // If it's a password step, don't show the password in chat explicitly, or show as asterisks
    if (step === 'VERIFY_AUTH') {
      addMessage('••••••••', 'user');
    } else {
      addMessage(input, 'user');
    }

    if (step === 'ASK_NAME') {
      setCapturedName(input);
      setStep('ASK_CONTACT');
      setTimeout(() => {
        addMessage(`Nice to meet you, ${input}! Could you please provide your email or phone number?`, 'bot');
      }, 500);
      return;
    }

    if (step === 'ASK_CONTACT') {
      setCapturedContact(input);
      setLoading(true);
      
      try {
        const exists = await checkUserExists(input);
        if (exists) {
          setAuthMode('login');
          setStep('VERIFY_AUTH');
          addMessage('Welcome back! Please enter your password to log in.', 'bot');
        } else {
          setAuthMode('register');
          setStep('VERIFY_AUTH');
          addMessage("Looks like you're new here. Please create a password to set up your account.", 'bot');
        }
      } catch (err) {
        console.error(err);
        addMessage("Sorry, something went wrong. Please try again.", 'bot');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 'VERIFY_AUTH') {
      setLoading(true);
      try {
        if (authMode === 'login') {
          await login(capturedContact, input);
        } else {
          await register(capturedName, capturedContact, input);
        }
        setStep('MAIN_MENU');
        addMessage("You're all set and logged in! How can I help you today?", 'bot', true);
      } catch (err) {
        addMessage(err.message + ". Please try again.", 'bot');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const handleMenuAction = (action) => {
    if (action === 'shop') {
      navigate('/category');
      setIsOpen(false);
    } else if (action === 'support') {
      addMessage("I'll connect you to a support agent. Please hold on.", 'bot');
    } else if (action === 'offers') {
      navigate('/offers');
      setIsOpen(false);
    } else if (action === 'track') {
      addMessage("To track your order, please visit the Account section.", 'bot');
      setTimeout(() => {
        navigate('/account');
        setIsOpen(false);
      }, 1500);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 md:bottom-6 right-6 z-[110]">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
              style={{ height: '500px', maxHeight: '80vh' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#d07e20] to-[#8a4e10] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={settings.logoBase64 || "/MA_logo.png"} alt="Logo" className="w-full h-full object-contain rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold leading-tight">{settings.storeName || 'Prime Pets'} Assistant</h3>
                    <p className="text-orange-100 text-[10px] uppercase font-semibold tracking-wider">Online</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-1 bg-black/10 rounded-full hover:bg-black/20">
                  <X size={18} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 flex flex-col gap-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'user' ? 'bg-[#d07e20] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'}`}>
                      {msg.text}
                      {msg.isMenu && (
                        <div className="mt-3 flex flex-col gap-2">
                          <button onClick={() => handleMenuAction('shop')} className="w-full bg-orange-50 hover:bg-orange-100 text-[#d07e20] border border-orange-100 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left">
                            🛍️ Shop Products
                          </button>
                          <button onClick={() => handleMenuAction('support')} className="w-full bg-orange-50 hover:bg-orange-100 text-[#d07e20] border border-orange-100 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left">
                            🎧 Customer Support
                          </button>
                          <button onClick={() => handleMenuAction('offers')} className="w-full bg-orange-50 hover:bg-orange-100 text-[#d07e20] border border-orange-100 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left">
                            🎁 Latest Offers
                          </button>
                          <button onClick={() => handleMenuAction('track')} className="w-full bg-orange-50 hover:bg-orange-100 text-[#d07e20] border border-orange-100 py-2 px-3 rounded-xl text-xs font-bold transition-colors text-left">
                            📦 Track Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#d07e20] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#d07e20] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-[#d07e20] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {step !== 'MAIN_MENU' && (
                <div className="p-4 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2 relative">
                    <input
                      type={step === 'VERIFY_AUTH' ? 'password' : 'text'}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      disabled={loading}
                      placeholder={step === 'VERIFY_AUTH' ? "Enter password..." : "Type your message..."}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#d07e20] focus:ring-1 focus:ring-[#d07e20] transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || loading}
                      className="bg-[#d07e20] hover:bg-[#8a4e10] text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Button */}
        {!isOpen && (
          <a
            href="https://wa.me/919763405605?text=Hi%2C%20I%20visited%20your%20site%20Primepets"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[72px] right-1 w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_15px_rgba(37,211,102,0.4)] transition-all transform hover:scale-105 active:scale-95"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12.031 0C5.38 0 0 5.383 0 12.037c0 2.128.552 4.195 1.6 6.02L.15 23.4l5.485-1.439a11.967 11.967 0 006.396 1.836h.005c6.648 0 12.032-5.385 12.032-12.04C24 5.378 18.681 0 12.031 0zm0 21.8c-1.8 0-3.565-.483-5.11-1.397l-.367-.217-3.8.995 1.016-3.7-.238-.38A9.97 9.97 0 012.035 12.04c0-5.508 4.484-9.995 9.996-9.995 5.512 0 9.994 4.487 9.994 9.995 0 5.51-4.482 9.995-9.994 9.995v.001l-.001-.236zm5.486-7.502c-.302-.151-1.785-.882-2.062-.982-.278-.1-.48-.152-.682.15-.202.302-.783.982-.96 1.182-.176.202-.353.228-.655.076-1.503-.761-2.614-1.424-3.626-2.923-.255-.378-.026-.583.125-.733.136-.135.302-.352.453-.527.151-.177.202-.303.303-.504.1-.202.05-.378-.025-.528-.076-.151-.682-1.641-.934-2.247-.246-.593-.497-.512-.682-.522-.176-.008-.378-.008-.58-.008s-.53.076-.807.378c-.278.303-1.06 1.034-1.06 2.52s1.085 2.923 1.236 3.125c.15.202 2.13 3.25 5.158 4.557 2.052.887 2.872 1.004 3.93 1.004.832 0 2.552-.983 2.898-1.921.346-.94.346-1.745.245-1.921-.1-.176-.378-.278-.68-.428z" />
            </svg>
          </a>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
          className="w-14 h-14 bg-[#d07e20] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_20px_rgba(208,126,32,0.4)] transition-all transform hover:scale-105 active:scale-95 relative z-10"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </>
  );
}
