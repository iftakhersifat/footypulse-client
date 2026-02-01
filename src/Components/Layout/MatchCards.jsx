import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiActivity, FiChevronRight, FiMapPin, FiAward, FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router';

const MatchCards = () => {
    const [matches, setMatches] = useState([]);

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

    return (
        <div className="min-h-screen py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 relative">

                 <div className="flex items-center justify-between mb-12 pb-8 relative group/header">
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/50 via-white/5 to-transparent" />
                <div className="flex items-center gap-5 relative">
                    <motion.div 
                        initial={{ height: 0 }}
                        whileInView={{ height: 32 }}
                        className="w-1.5 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" /> 
                    
                    <div className="relative">
                        <div className="absolute -inset-2 bg-emerald-500/10 blur-xl rounded-full opacity-0 group-hover/header:opacity-100 transition-opacity duration-500" />
                        
                        <motion.h2 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter relative z-10">
                            MatchDay
                        </motion.h2>
                        
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-[2px] bg-emerald-500" />
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em]">Match Fixtures</span>
                        </div>
                    </div>
                </div>
            
                <Link to="/fixtures">
                    <motion.div
                        whileHover={{ y: -2 }}
                        className="relative">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative z-10 flex items-center gap-3 bg-zinc-900/80 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.15em] transition-all group overflow-hidden shadow-xl"
                        >
                            {/* Button Inner Glow on Hover */}
                            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <span className="relative z-10 group-hover:text-black transition-colors duration-300">All Fixtures</span>
                            <FiArrowUpRight className="relative z-10 text-lg group-hover:rotate-45 transition-transform text-emerald-500 group-hover:text-black duration-300" />
                        </motion.button>
            
                        {/* Outer Neon Shadow for Button */}
                        <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                </Link>
            </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence>
                        {matches.map((match, index) => (
                            <motion.div
                                key={match._id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group relative"
                            >
                                {/* Glowing Background Effect for Live Matches */}
                                {match.isLive && (
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                )}

                                <div className="relative h-full bg-gradient-to-b from-slate-800 to-slate-950 border border-white/5 p-2 rounded-[3rem] overflow-hidden transition-all duration-500 group-hover:border-emerald-500/30 group-hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)]">
                                    
                                    {/* 1. Header: League & Status */}
                                    <div className="flex justify-between items-center px-8 pt-8 mb-10">
                                        <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-2xl border border-white/5">
                                            <FiAward size={14} className="text-emerald-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{match.leagueName}</span>
                                        </div>
                                        
                                        {match.isLive ? (
                                            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-xl">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                                </span>
                                                <span className="text-[10px] font-black uppercase text-rose-500 tracking-tighter">Live {match.currentMinute}'</span>
                                            </div>
                                        ) : (
                                            <div className="bg-zinc-900/50 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                                Upcoming
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Main Body: Teams & Score */}
                                    <div className="px-6 pb-8">
                                        <div className="flex justify-between items-center gap-4 mb-12 relative">
                                            
                                            {/* Team 1 */}
                                            <div className="flex-1 flex flex-col items-center gap-5 group/team">
                                                <div className="relative w-24 h-24 flex items-center justify-center bg-zinc-900/50 rounded-[2.5rem] border border-white/5 group-hover/team:border-emerald-500/50 transition-all duration-500">
                                                    <img src={match.team1Logo} className="w-16 h-16 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] group-hover/team:scale-110 transition-transform" alt={match.team1Name} />
                                                </div>
                                                <h4 className="text-[12px] font-black uppercase tracking-widest text-white/90 text-center h-8 flex items-center">{match.team1Name}</h4>
                                            </div>

                                            {/* Center Section: Score or VS */}
                                            <div className="flex flex-col items-center justify-center min-w-[100px]">
                                                {match.isLive ? (
                                                    <div className="flex flex-col items-center">
                                                        <div className="text-6xl font-black italic tracking-tighter text-white flex gap-1">
                                                            <span>{match.team1Score}</span>
                                                            <span className="text-emerald-500 animate-pulse">:</span>
                                                            <span>{match.team2Score}</span>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-emerald-500/50 uppercase mt-2 tracking-[0.3em]">Score</span>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <div className="w-16 h-16 rounded-3xl border border-white/10 flex items-center justify-center bg-[#0f0f0f] shadow-2xl transition-all duration-700 group-hover:rotate-[360deg]">
                                                            <span className="text-xs font-black italic text-zinc-500">VS</span>
                                                        </div>
                                                        <div className="absolute -inset-3 border border-dashed border-zinc-800/50 rounded-full animate-[spin_15s_linear_infinite] -z-10"></div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Team 2 */}
                                            <div className="flex-1 flex flex-col items-center gap-5 group/team">
                                                <div className="relative w-24 h-24 flex items-center justify-center bg-zinc-900/50 rounded-[2.5rem] border border-white/5 group-hover/team:border-emerald-500/50 transition-all duration-500">
                                                    <img src={match.team2Logo} className="w-16 h-16 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] group-hover/team:scale-110 transition-transform" alt={match.team2Name} />
                                                </div>
                                                <h4 className="text-[12px] font-black uppercase tracking-widest text-white/90 text-center h-8 flex items-center">{match.team2Name}</h4>
                                            </div>
                                        </div>

                                        {/* 3. Info Grid: Venue & Time */}
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-zinc-900/30 p-5 rounded-3xl border border-white/5 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-emerald-500">
                                                    <FiMapPin size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Stadium</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-zinc-400 truncate">{match.venue}</span>
                                            </div>
                                            <div className="bg-zinc-900/30 p-5 rounded-3xl border border-white/5 flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-emerald-500">
                                                    <FiClock size={12} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Start Time</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-white uppercase italic">
                                                    {new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 4. Action Button */}
                                        <Link 
                                            to={`/match/${match._id}`}
                                            className={`w-full group/btn relative py-5 rounded-[1.8rem] flex items-center justify-center gap-3 transition-all duration-500 font-black uppercase text-[11px] tracking-[0.3em] overflow-hidden shadow-lg ${
                                                match.isLive 
                                                ? 'bg-emerald-500 text-black hover:bg-white' 
                                                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10 hover:bg-zinc-800'
                                            }`}
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {match.isLive ? <FiActivity className="animate-pulse" /> : <FiChevronRight />}
                                                {match.isLive ? 'Enter Match Center' : 'View Preview'}
                                            </span>
                                            
                                            {/* Button Shine Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                        </Link>
                                    </div>

                                    {/* Live Match Progress Bar at Bottom */}
                                    {match.isLive && (
                                        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-zinc-900">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((match.currentMinute / 90) * 100, 100)}%` }}
                                                className="h-full bg-emerald-500 shadow-[0_0_15px_#10b981]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MatchCards;