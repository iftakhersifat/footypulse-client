import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router';

import axios from 'axios';

import { motion } from 'framer-motion';

import {

    FiShield, FiBriefcase, FiCalendar, FiAward,

    FiArrowLeft, FiFlag, FiActivity, FiUsers, FiClock

} from 'react-icons/fi';



const ManagerDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [manager, setManager] = useState(null);

    const [loading, setLoading] = useState(true);



    useEffect(() => {

        axios.get(`http://localhost:5000/manager`)

            .then(res => {

                const found = res.data.find(m => m._id === id);

                setManager(found);

                setLoading(false);

            })

            .catch(err => {

                console.error(err);

                setLoading(false);

            });

    }, [id]);



    if (loading) return (

        <div className="h-screen flex items-center justify-center">

            <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>

        </div>

    );



    if (!manager) return <div className="text-center py-20 text-white font-black uppercase tracking-widest">Profile Not Found</div>;



    return (

        <div className="min-h-screen  text-white selection:bg-emerald-500 selection:text-black">

            {/* Top Navigation */}

            <div className="max-w-7xl mx-auto px-6 pt-10">

                <button

                    onClick={() => navigate(-1)}

                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 hover:text-white transition-all"

                >

                    <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Exit to Squad

                </button>

            </div>



            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">

                   

                    {/* Visual Section (Left) - Kept original as requested */}

                    <motion.div

                        initial={{ opacity: 0, y: 30 }}

                        animate={{ opacity: 1, y: 0 }}

                        className="lg:col-span-5 relative"

                    >

                        <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl h-full">

                            <img

                                src={manager.image}

                                className="w-full h-full object-cover transition-all duration-700"

                                alt={manager.name}

                            />

                            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent">

                                <div className="flex justify-between items-end border-t border-white/10 pt-6">

                                    <div className="text-center">

                                        <p className="text-2xl font-black italic leading-none">{manager.totalTrophies}</p>

                                        <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 mt-1">Honors</p>

                                    </div>

                                    <div className="h-8 w-[1px] bg-white/10"></div>

                                    <div className="text-center">

                                        <p className="text-2xl font-black italic leading-none">{manager.successRatio}%</p>

                                        <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 mt-1">Win Rate</p>

                                    </div>

                                    <div className="h-8 w-[1px] bg-white/10"></div>

                                    <div className="text-center">

                                        <p className="text-2xl font-black italic leading-none">{manager.formation}</p>

                                        <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 mt-1">Tactics</p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </motion.div>



                    {/* Data Section (Right) - Professional Redesign */}

                    <motion.div

                        initial={{ opacity: 0, x: 20 }}

                        animate={{ opacity: 1, x: 0 }}

                        className="lg:col-span-7 flex flex-col justify-center"

                    >

                        {/* Header Part */}

                        <div className="mb-10">

                            <div className="flex items-center gap-3 mb-4">

                                <span className={`h-2 w-2 rounded-full ${manager.status === 'Inactive' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>

                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Professional Profile // {manager.status || 'Active'}</span>

                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-none mb-4">

                                {manager.name}

                            </h1>

                            <p className="text-emerald-500 text-sm font-black uppercase tracking-widest flex items-center gap-2">

                                <FiShield /> Current Club: {manager.currentClub}

                            </p>

                        </div>



                        {/* Professional Data Grid */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden mb-10">

                            <ProfileStat icon={<FiFlag />} label="National Identity" value={manager.nationality} />

                            <ProfileStat icon={<FiCalendar />} label="Age" value={`${manager.age} Years`} />

                            <ProfileStat icon={<FiBriefcase />} label="Previous Club" value={manager.previousClub} />

                            <ProfileStat icon={<FiActivity />} label="Preferred System" value={manager.formation} />

                        </div>



                        {/* Extra Technical Details */}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-white/5">

                            <div className="space-y-1">

                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">

                                    <FiClock className="text-emerald-500" /> Joined Date

                                </p>

                                <p className="text-lg text-black dark:text-white font-black italic uppercase">{manager.joinedDate}</p>

                            </div>

                            <div className="space-y-1">

                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">

                                    <FiAward className="text-emerald-500" /> Career Honors

                                </p>

                                <p className="text-lg font-black italic uppercase text-black dark:text-white">{manager.totalTrophies} Major Titles</p>

                            </div>

                            <div className="col-span-2 md:col-span-1 space-y-1">

                                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">

                                    <FiUsers className="text-emerald-500" /> Professional Status

                                </p>

                                <p className={`text-lg font-black italic uppercase ${manager.status === 'Inactive' ? 'text-red-500' : 'text-emerald-500'}`}>

                                    {manager.status === 'Inactive' ? 'Off-Duty' : 'In-Service'}

                                </p>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </div>

        </div>

    );

};



// Reusable Stat Component for the Grid

const ProfileStat = ({ icon, label, value }) => (

    <div className="bg-[#0a0a0a] p-8 hover:bg-[#0f0f0f] transition-all group">

        <div className="flex items-center gap-3 mb-3 text-zinc-600 group-hover:text-emerald-500 transition-colors">

            {icon}

            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>

        </div>

        <p className="text-xl font-black italic uppercase tracking-tight text-zinc-200 group-hover:text-white transition-colors">

            {value}

        </p>

    </div>

);



export default ManagerDetails;