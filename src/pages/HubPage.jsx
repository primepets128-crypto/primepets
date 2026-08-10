import React, { useState } from 'react';
import { BookOpen, Play, Clock, ChevronRight, Search, Bookmark, Star, MessageCircle, ThumbsUp, TrendingUp, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import ScrollReveal from '../components/ScrollReveal';

const ARTICLES = [
  { id: 1, title: '10 Signs Your Dog Needs More Exercise', category: 'Dogs', time: '5 min', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=320&fit=crop', author: 'Dr. Priya Sharma', authorImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face', tag: 'Health', likes: 243, comments: 18, featured: true },
  { id: 2, title: 'Best Nutrition Tips for Indoor Cats', category: 'Cats', time: '4 min', img: 'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?w=500&h=320&fit=crop', author: 'Dr. Rohan Mehta', authorImg: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face', tag: 'Nutrition', likes: 187, comments: 24, featured: false },
  { id: 3, title: 'Monsoon Pet Care: What You Need to Know', category: 'All Pets', time: '6 min', img: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=320&fit=crop', author: 'Anita Kapoor', authorImg: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=50&h=50&fit=crop&crop=face', tag: 'Seasonal', likes: 312, comments: 45, featured: false },
  { id: 4, title: 'Grooming Your Dog at Home: Step by Step', category: 'Dogs', time: '7 min', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=320&fit=crop', author: 'Meera Singh', authorImg: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=50&h=50&fit=crop&crop=face', tag: 'Grooming', likes: 156, comments: 12, featured: false },
  { id: 5, title: 'Understanding Your Cat\'s Body Language', category: 'Cats', time: '5 min', img: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=500&h=320&fit=crop', author: 'Dr. Priya Sharma', authorImg: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop&crop=face', tag: 'Behavior', likes: 278, comments: 33, featured: false },
  { id: 6, title: 'First-Time Pet Parent Guide: Puppy Edition', category: 'Dogs', time: '8 min', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=320&fit=crop', author: 'Dr. Rohan Mehta', authorImg: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop&crop=face', tag: 'Training', likes: 421, comments: 56, featured: false },
];

const VIDEOS = [
  { id: 1, title: 'How to Train Your Puppy', duration: '12:45', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=350&h=200&fit=crop', views: '24K' },
  { id: 2, title: 'Cat Feeding Schedule Guide', duration: '8:30', img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=350&h=200&fit=crop', views: '18K' },
  { id: 3, title: 'First Vet Visit Tips', duration: '10:15', img: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=350&h=200&fit=crop', views: '31K' },
  { id: 4, title: 'Grooming at Home Tutorial', duration: '15:22', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=350&h=200&fit=crop', views: '42K' },
];

const EXPERTS = [
  { name: 'Dr. Priya Sharma', role: 'Veterinarian', specialty: 'Dogs & Cats', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face', rating: 4.9, exp: '12 yrs' },
  { name: 'Dr. Rohan Mehta', role: 'Pet Nutritionist', specialty: 'Nutrition & Diet', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face', rating: 4.8, exp: '9 yrs' },
  { name: 'Anita Kapoor', role: 'Dog Trainer', specialty: 'Training & Behavior', img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop&crop=face', rating: 4.7, exp: '7 yrs' },
  { name: 'Meera Singh', role: 'Grooming Expert', specialty: 'Grooming & Styling', img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop&crop=face', rating: 4.8, exp: '6 yrs' },
];

const TOPICS = ['All', 'Health', 'Nutrition', 'Training', 'Grooming', 'Seasonal', 'Puppies', 'Kittens', 'Behavior'];

export default function HubPage() {
  const [activeTopic, setActiveTopic] = useState('All');
  const [saved, setSaved] = useState([]);
  const toggleSave = id => setSaved(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);
  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-24 md:pb-8">

        {/* Hero */}
        <ScrollReveal>
        <div className="bg-gradient-to-br from-[#5c3110] via-[#1E3A8A] to-[#8b4513] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-20 translate-x-20 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={18} className="text-yellow-300" />
                  <span className="text-yellow-300 text-xs md:text-sm font-bold uppercase tracking-widest">Knowledge Centre</span>
                </div>
                <h1 className="text-white font-black text-3xl md:text-5xl leading-tight">Prime Pets Hub 📚</h1>
                <p className="text-orange-200 text-sm md:text-base mt-2">Expert tips, guides & videos for happy, healthy pets</p>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 gap-3 max-w-md w-full">
                <Search size={16} className="text-white/60 flex-shrink-0" />
                <input placeholder="Search articles, guides, topics..." className="flex-1 bg-transparent text-white text-sm placeholder-white/40 outline-none" />
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="bg-[#d07e20] text-white text-xs font-bold px-3 py-1.5 rounded-xl">Search</button>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-8">

          {/* Topic filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6 md:mb-8">
            {TOPICS.map((t, idx) => (
              <ScrollReveal key={t} delay={idx * 50} className="flex-shrink-0">
              <button onClick={() => setActiveTopic(t)}
                className={`w-full text-xs font-bold px-4 py-2 rounded-full border transition-all ${activeTopic === t ? 'bg-[#5c3110] text-white border-[#5c3110]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5c3110] hover:text-[#5c3110]'}`}>
                {t}
              </button>
              </ScrollReveal>
            ))}
          </div>

          {/* Desktop: 2-col layout | Mobile: stacked */}
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">

            {/* Main content */}
            <div className="flex-1 min-w-0">

              {/* Featured article */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6 md:mb-8 product-card">
                <div className="relative" style={{ height: 200 }}>
                  <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-[#d07e20] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">✨ Featured</span>
                    <span className="bg-white/90 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-full">{featured.tag}</span>
                  </div>
                  <button onClick={() => toggleSave(featured.id)} className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5">
                    <Bookmark size={14} className={saved.includes(featured.id) ? 'fill-[#d07e20] text-[#d07e20]' : 'text-gray-500'} />
                  </button>
                </div>
                <div className="p-4 md:p-6">
                  <h2 className="text-gray-900 font-black text-lg md:text-xl leading-tight">{featured.title}</h2>
                  <div className="flex items-center gap-3 mt-3">
                    <img src={featured.authorImg} alt={featured.author} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-gray-700 text-xs font-bold">{featured.author}</p>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                        <Clock size={9} /> {featured.time} read
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1"><ThumbsUp size={13} /><span className="text-xs">{featured.likes}</span></div>
                      <div className="flex items-center gap-1"><MessageCircle size={13} /><span className="text-xs">{featured.comments}</span></div>
                    </div>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="mt-4 w-full md:w-auto bg-[#5c3110] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#8b4513] transition-colors">
                    Read Full Article →
                  </button>
                </div>
              </div>

              {/* Videos */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Play size={16} className="text-[#d07e20]" />
                    <h2 className="text-gray-800 font-bold text-lg">🎬 Video Guides</h2>
                  </div>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="text-[#d07e20] text-sm font-bold flex items-center gap-1 hover:underline">See All <ArrowRight size={14} /></button>
                </div>
                <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide md:overflow-visible md:grid md:grid-cols-2 pb-2 md:pb-0">
                  {VIDEOS.map((v, idx) => (
                    <ScrollReveal key={v.id} delay={(idx % 2) * 100} className="flex-shrink-0 md:flex-shrink min-w-[200px]">
                    <div className="rounded-2xl overflow-hidden cursor-pointer product-card bg-white border border-gray-100">
                      <div className="relative" style={{ height: 130 }}>
                        <img src={v.img} alt={v.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                            <Play size={20} className="text-[#d07e20] ml-1" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{v.duration}</span>
                        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">👁 {v.views}</span>
                      </div>
                      <div className="p-3">
                        <p className="text-gray-800 text-xs font-bold leading-tight line-clamp-2">{v.title}</p>
                      </div>
                    </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Article grid — 1 col mobile, 2 col md, 3 col lg */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-800 font-bold text-lg">📝 Latest Articles</h2>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="text-[#d07e20] text-sm font-bold flex items-center gap-1 hover:underline">See All <ArrowRight size={14} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {rest.map((a, idx) => (
                    <ScrollReveal key={a.id} delay={(idx % 3) * 100} className="h-full">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm product-card cursor-pointer h-full flex flex-col">
                      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 140 }}>
                        <img src={a.img} alt={a.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        <div className="absolute top-2 left-2 flex gap-1.5">
                          <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{a.tag}</span>
                          <span className="bg-white/90 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-full">{a.category}</span>
                        </div>
                        <button onClick={() => toggleSave(a.id)} className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5">
                          <Bookmark size={12} className={saved.includes(a.id) ? 'fill-[#d07e20] text-[#d07e20]' : 'text-gray-400'} />
                        </button>
                      </div>
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-gray-800 text-xs md:text-sm font-bold leading-snug line-clamp-2">{a.title}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <img src={a.authorImg} alt={a.author} className="w-5 h-5 rounded-full object-cover" />
                          <span className="text-gray-500 text-[10px] font-medium flex-1 line-clamp-1">{a.author}</span>
                          <Clock size={9} className="text-gray-400" />
                          <span className="text-gray-400 text-[10px]">{a.time}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-50 text-gray-400">
                          <div className="flex items-center gap-1"><ThumbsUp size={11} /><span className="text-[10px]">{a.likes}</span></div>
                          <div className="flex items-center gap-1"><MessageCircle size={11} /><span className="text-[10px]">{a.comments}</span></div>
                          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="ml-auto text-[#d07e20] text-[10px] font-bold">Read →</button>
                        </div>
                      </div>
                    </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDEBAR: Experts + Trending */}
            <aside className="lg:w-72 flex-shrink-0">
              {/* Trending topics */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={15} className="text-[#d07e20]" />
                  <p className="text-gray-800 font-bold text-sm">Trending Topics</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['#MonsoonCare', '#PuppyGuide', '#CatNutrition', '#GroomingTips', '#HealthCheck', '#Training101'].map((t, idx) => (
                    <ScrollReveal key={t} delay={idx * 50}>
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="bg-orange-50 text-[#d07e20] text-[10px] font-bold px-3 py-1 rounded-full border border-orange-200 hover:bg-[#d07e20] hover:text-white transition-all">
                      {t}
                    </button>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Experts */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-gray-800 font-bold text-sm mb-3">🩺 Our Experts</p>
                <div className="flex flex-col gap-3">
                  {EXPERTS.map((e, idx) => (
                    <ScrollReveal key={e.name} delay={idx * 100}>
                    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                      <img src={e.img} alt={e.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#5c3110] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-bold text-xs leading-tight group-hover:text-[#5c3110] transition-colors">{e.name}</p>
                        <p className="text-[#d07e20] text-[10px] font-semibold">{e.role}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex items-center gap-0.5">
                            <Star size={8} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-gray-600 text-[9px] font-bold">{e.rating}</span>
                          </div>
                          <span className="text-gray-300 text-[9px]">•</span>
                          <span className="text-gray-400 text-[9px]">{e.exp} exp</span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.alert("Feature coming soon!"); }} className="bg-[#5c3110] text-white text-[9px] font-bold px-2 py-1.5 rounded-lg hover:bg-[#8b4513] transition-colors flex-shrink-0">
                        Consult
                      </button>
                    </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
        </ScrollReveal>
      </main>

      <div className="h-20 md:hidden" />
    </div>
  );
}
