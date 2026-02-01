import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiActivity, FiChevronRight, FiMapPin, FiAward, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router';

const Fixtures = () => {
    const [matches, setMatches] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'live', 'upcoming', 'finished'

    useEffect(() => {
        const fetchMatches = () => {
            axios.get('http://localhost:5000/matches')
                .then(res => setMatches(res.data))
                .catch(err => console.log(err));
        };

        fetchMatches();
        const interval = setInterval(fetchMatches, 10000);
        return () => clearInterval(interval);
    }, []);

    // ফিল্টারিং লজিক
    const filteredMatches = matches.filter(match => {
        if (filter === 'all') return match.isLive || !match.isFinished; // Live + Upcoming
        if (filter === 'live') return match.isLive;
        if (filter === 'upcoming') return !match.isLive && !match.isFinished;
        if (filter === 'finished') return match.isFinished;
        return true;
    });

    const filterTabs = [
        { id: 'all', label: 'All Matches', icon: null },
        { id: 'live', label: 'Live Now', icon: <FiActivity className="text-rose-500" /> },
        { id: 'upcoming', label: 'Upcoming', icon: <FiClock className="text-blue-500" /> },
        { id: 'finished', label: 'Finished', icon: <FiCheckCircle className="text-emerald-500" /> },
    ];

    return (
        <div className="min-h-screen text-white py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
                
                {/* Header & Season Calendar Button */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-emerald-500 font-black uppercase text-[12px] tracking-[0.4em]">
                            <span className="w-10 h-[2px] bg-emerald-500"></span>
                            Live Arena
                        </motion.div>
                        <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">
                            Match <span className="text-transparent [webkit-text-stroke:1px_#3f3f46]">Day</span>
                        </h2>
                    </div>
                    
                    <Link to="/fixtures" className="group flex items-center gap-6 bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-10 py-5 rounded-[2rem] hover:border-emerald-500/50 transition-all">
                        <span className="font-black uppercase text-[11px] tracking-widest">Season Calendar</span>
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center group-hover:rotate-45 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                            <FiChevronRight className="text-black" size={20} />
                        </div>
                    </Link>
                </div>

                {/* 🎯 ফিল্টার ট্যাব সেকশন */}
                <div className="flex flex-wrap items-center gap-4 mb-16 bg-zinc-900/40 p-2 rounded-[2.5rem] border border-white/5 w-fit">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setFilter(tab.id)}
                            className={`px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                filter === tab.id 
                                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                                : 'hover:bg-white/5 text-zinc-400'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredMatches.length > 0 ? (
                            filteredMatches.map((match, index) => (
                                <motion.div
                                    key={match._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="group relative"
                                >
                                    {/* কার্ড ডিজাইন (আগের প্রিমিয়াম লুকটাই রাখা হয়েছে) */}
                                    <div className="relative h-full bg-gradient-to-b from-slate-800 to-slate-950 border border-white/5 p-2 rounded-[3rem] overflow-hidden group-hover:border-emerald-500/30 transition-all shadow-2xl">
                                        
                                        {/* Status Tag */}
                                        <div className="flex justify-between items-center px-8 pt-8 mb-10">
                                            <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-2xl">
                                                <FiAward size={14} className="text-emerald-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{match.leagueName}</span>
                                            </div>
                                            
                                            {match.isLive ? (
                                                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
                                                    <span className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase text-rose-500">Live {match.currentMinute}'</span>
                                                </div>
                                            ) : match.isFinished ? (
                                                <div className="bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                    Full Time
                                                </div>
                                            ) : (
                                                <div className="bg-zinc-900/50 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                    Upcoming
                                                </div>
                                            )}
                                        </div>

                                        {/* Teams & Scores */}
                                        <div className="px-6 pb-8">
                                            <div className="flex justify-between items-center gap-4 mb-12">
                                                <div className="flex-1 flex flex-col items-center gap-5">
                                                    <div className="w-20 h-20 flex items-center justify-center bg-zinc-900 rounded-[2rem] border border-white/5">
                                                        <img src={match.team1Logo} className="w-12 h-12 object-contain" alt={match.team1Name} />
                                                    </div>
                                                    <h4 className="text-[11px] font-black uppercase text-white/90 text-center">{match.team1Name}</h4>
                                                </div>

                                                <div className="text-5xl font-black italic text-white">
                                                    {match.isLive || match.isFinished ? `${match.team1Score}:${match.team2Score}` : 'VS'}
                                                </div>

                                                <div className="flex-1 flex flex-col items-center gap-5">
                                                    <div className="w-20 h-20 flex items-center justify-center bg-zinc-900 rounded-[2rem] border border-white/5">
                                                        <img src={match.team2Logo} className="w-12 h-12 object-contain" alt={match.team2Name} />
                                                    </div>
                                                    <h4 className="text-[11px] font-black uppercase text-white/90 text-center">{match.team2Name}</h4>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <Link to={`/match/${match._id}`} className={`w-full py-5 rounded-[1.8rem] flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.3em] transition-all ${
                                                match.isLive ? 'bg-emerald-500 text-black' : 'bg-white/5 text-zinc-400 hover:bg-zinc-800'
                                            }`}>
                                                {match.isLive ? 'Match Center' : 'View Details'}
                                                <FiChevronRight />
                                            </Link>
                                        </div>

                                        {match.isLive && (
                                            <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-900">
                                                <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} className="h-full bg-emerald-500" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-zinc-500 font-black uppercase tracking-[0.5em]">
                                No Matches Found
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Fixtures;