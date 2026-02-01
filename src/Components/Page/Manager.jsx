import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { FiArrowRight, FiUser, FiShield, FiPlus, FiSearch, FiInbox } from 'react-icons/fi';

const Manager = () => {
    const [managers, setManagers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        axios.get('http://localhost:5000/manager')
            .then(res => setManagers(res.data))
            .catch(err => console.log(err));
    }, []);

    const filteredManagers = managers.filter(manager => {
        const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || manager.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
            
            {/* Header Section */}
            <div className="mb-16">
                <div className="relative mb-8">
                    <motion.span 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-emerald-500 font-black uppercase text-[14px] tracking-[0.6em] block mb-4"
                    >
                        Tactical Mastermind
                    </motion.span>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-8">
                    <div className="relative w-full md:w-1/2 group">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by manager name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-emerald-500/50 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none transition-all text-black dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {['All', 'Active', 'Inactive'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === status 
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                                    : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 hover:text-emerald-500'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Managers Grid & No Result State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 min-h-[400px]">
                <AnimatePresence mode='popLayout'>
                    {filteredManagers.length > 0 ? (
                        filteredManagers.map((manager) => (
                            <motion.div
                                layout
                                key={manager._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="group relative"
                            >
                                <Link to={`/manager/${manager._id}`}>
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 transition-all duration-500 group-hover:border-emerald-500/50">
                                        
                                        {/* Image */}
                                        {manager.image ? (
                                            <img 
                                                src={manager.image} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                alt={manager.name} 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <FiUser size={60} />
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                                        
                                        {/* Info */}
                                        <div className="absolute bottom-0 left-0 w-full p-8">
                                            <p className="text-emerald-400 font-black text-[9px] uppercase tracking-widest mb-1 flex items-center gap-2">
                                                <FiShield size={10} /> {manager.currentClub}
                                            </p>
                                            <h4 className="text-2xl font-black text-white uppercase italic leading-tight">
                                                {manager.name.split(' ')[0]} <span className="text-emerald-500">{manager.name.split(' ').slice(1).join(' ')}</span>
                                            </h4>
                                        </div>

                                        {/* Floating Plus Icon */}
                                        <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 border border-white/20">
                                            <FiPlus size={18} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    ) : (
                        /* Empty State Message */
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-[3rem]"
                        >
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <FiInbox className="text-zinc-400" size={24} />
                            </div>
                            <h3 className="text-xl font-black text-black dark:text-white uppercase italic tracking-tighter mb-2">
                                No Commanders Found
                            </h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] text-center max-w-[300px] leading-relaxed">
                                We couldn't find any tactical profiles matching "{searchTerm}" in the {statusFilter} category.
                            </p>
                            <button 
                                onClick={() => {setSearchTerm(''); setStatusFilter('All');}}
                                className="mt-8 text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline"
                            >
                                Clear All Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Manager;