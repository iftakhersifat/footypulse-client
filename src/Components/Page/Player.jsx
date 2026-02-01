import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { FiArrowRight, FiUser, FiSearch, FiFilter, FiInbox } from 'react-icons/fi';

const Player = () => {
    const [players, setPlayers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Default');

    useEffect(() => {
        axios.get('http://localhost:5000/players')
            .then(res => setPlayers(res.data))
            .catch(err => console.log(err));
    }, []);

    // সব পজিশন লিস্ট
    const positionList = ['All', 'GK', 'CB', 'LB', 'RB', 'DMF', 'CMF', 'AMF', 'LMF', 'RMF', 'LWF', 'RWF', 'CF'];

    // ফিল্টারিং এবং সর্টিং লজিক
    const filteredPlayers = players
        .filter(player => {
            const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            // পজিশন চেক: কমা সেপারেটেড পজিশন হ্যান্ডেল করার জন্য
            const matchesPosition = positionFilter === 'All' || 
                (player.position && player.position.split(',').map(p => p.trim().toUpperCase()).includes(positionFilter.toUpperCase()));
            
            return matchesSearch && matchesPosition;
        })
        .sort((a, b) => {
            if (sortBy === 'Goals') return (b.goals || 0) - (a.goals || 0);
            if (sortBy === 'Assists') return (b.assists || 0) - (a.assists || 0);
            return 0;
        });

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
            
            {/* Header Section */}
            <div className="mb-16">
                <div className="relative mb-8">
                    <motion.span 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.6em] block mb-4"
                    >
                        Squad Season 2025/26
                    </motion.span>
                    <h2 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none">
                        Team <span className="text-transparent [webkit-text-stroke:1px_#10b981] dark:[webkit-text-stroke:1px_#10b981]">Stars</span>
                    </h2>
                </div>

                {/* Search & Filter Bar */}
                <div className="space-y-6 bg-zinc-100/50 dark:bg-white/5 p-6 rounded-[2rem] border border-zinc-200 dark:border-white/5">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        {/* Search Input */}
                        <div className="relative w-full lg:w-1/3 group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search player name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 focus:border-emerald-500/50 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none transition-all text-black dark:text-white"
                            />
                        </div>

                        {/* Sorting Buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                            <span className="text-[10px] font-black uppercase text-zinc-400 mr-2 flex items-center gap-1"><FiFilter /> Sort:</span>
                            {['Default', 'Goals', 'Assists'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSortBy(type)}
                                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                        sortBy === type ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'hover:text-emerald-500 text-zinc-500'
                                    }`}
                                >
                                    Most {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Position Chips (সহ LMF, RMF) */}
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-200 dark:border-white/10">
                        <span className="text-[10px] font-black uppercase text-zinc-400 mr-2">Position:</span>
                        {positionList.map((pos) => (
                            <button
                                key={pos}
                                onClick={() => setPositionFilter(pos)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${
                                    positionFilter === pos 
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-md' 
                                    : 'bg-zinc-200 dark:bg-white/5 text-zinc-500 hover:bg-emerald-500/10 hover:text-emerald-500'
                                }`}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 min-h-[400px]">
                <AnimatePresence mode='popLayout'>
                    {filteredPlayers.length > 0 ? (
                        filteredPlayers.map((player) => (
                            <motion.div
                                layout
                                key={player._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.1 }}
                                className="group relative"
                            >
                                <Link to={`/player/${player._id}`}>
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)]">
                                        
                                        {player.image ? (
                                            <img src={player.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={player.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700"><FiUser size={80} /></div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                        
                                        <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest mb-1">{player.position}</p>
                                            <h4 className="text-2xl font-black text-white uppercase italic leading-tight mb-3">
                                                {player.name.split(' ').map((word, i) => i === 0 ? word : <span key={i} className="block text-emerald-500">{word}</span>)}
                                            </h4>
                                            
                                            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                <div className="text-white/60 text-[9px] font-bold uppercase tracking-tighter">Goals: <span className="text-white">{player.goals || 0}</span></div>
                                                <div className="text-white/60 text-[9px] font-bold uppercase tracking-tighter">Assists: <span className="text-white">{player.assists || 0}</span></div>
                                            </div>
                                        </div>

                                        <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center -rotate-45 opacity-0 group-hover:opacity-100 group-hover:rotate-0 transition-all duration-500">
                                            <FiArrowRight size={20} strokeWidth={3} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        /* Empty State */
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                            <FiInbox size={32} className="text-zinc-400 mb-4" />
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">No Players Found</h3>
                            <button onClick={() => {setSearchTerm(''); setPositionFilter('All'); setSortBy('Default');}} className="mt-6 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em] hover:underline">Reset Filters</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Player;