import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router'; // React Router
import axios from 'axios';
import { FiArrowLeft, FiShield, FiMapPin, FiCalendar, FiRotateCcw, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PlayerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/players`)
            .then(res => {
                const found = res.data.find(p => p._id === id);
                setPlayer(found);
            });
    }, [id]);

    if (!player) return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
            <p className="text-emerald-500 font-black tracking-widest animate-pulse">SCANNING BIOMETRICS...</p>
        </div>
    );

    return (
        <div className="min-h-screen py-12 md:py-20">
            {/* Wrapper: max-w-6xl with requested padding logic */}
            <div className="max-w-6xl mx-auto px-6 lg:px-0">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-12 flex items-center gap-2 text-slate-400 hover:text-emerald-500 font-black uppercase text-[10px] tracking-[0.2em] transition-all group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
                    Back to Squad
                </button>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    
                    {/* Image Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 relative"
                    >
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-slate-50 dark:border-green-900 shadow-2xl relative z-10">
                            <img 
                                src={player.image} 
                                alt={player.name} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        {/* Aesthetic Glow */}
                        <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full z-0" />
                    </motion.div>

                    {/* Info Section */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 space-y-10"
                    >
                        {/* Name & Title */}
                        <div>
                            <span className="text-emerald-500 font-black uppercase tracking-[0.5em] text-[10px] mb-3 block">
                                Official Profile
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-[0.9] mb-2">
                                {player.name}
                            </h1>
                            <div className="h-1.5 w-20 bg-emerald-500 rounded-full" />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
                            <StatBox icon={<FiShield />} label="Current Club" value={player.club} />
                            <StatBox icon={<FiMapPin />} label="Nationality" value={player.nationality} />
                            <StatBox icon={<FiCalendar />} label="Age" value={`${player.age} Yrs`} />
                            <StatBox icon={<FiActivity />} label="Position" value={player.position} />
                            <StatBox icon={<FiRotateCcw />} label="Previous" value={player.previousClub || 'Homegrown'} />
                        </div>

                        {/* Performance Scoreboard */}
                        <div className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-white/5 grid grid-cols-2 gap-10 shadow-xl relative overflow-hidden">
                            {/* Decorative Watermark */}
                            <div className="absolute right-0 bottom-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                                <FiActivity size={180} />
                            </div>
                            
                            <div className="text-center relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Goals</p>
                                <h3 className="text-6xl font-black text-emerald-500 italic tracking-tighter">{player.goals}</h3>
                            </div>
                            <div className="text-center border-l border-slate-200 dark:border-zinc-800 relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assists</p>
                                <h3 className="text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter">{player.assists}</h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Component
const StatBox = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 group">
        <div className="mt-1 text-emerald-500 bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            {React.cloneElement(icon, { size: 16 })}
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase">{value}</p>
        </div>
    </div>
);

export default PlayerDetails;