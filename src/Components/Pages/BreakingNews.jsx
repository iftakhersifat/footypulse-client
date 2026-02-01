import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, useAnimationControls } from 'framer-motion';

const BreakingNews = () => {
    const [news, setNews] = useState([]);
    const controls = useAnimationControls();

    useEffect(() => {
        axios.get('http://localhost:5000/news')
            .then(res => setNews(res.data))
            .catch(err => console.log(err));
    }, []);

    if (news.length === 0) return null;

    // Logo Divider Component
    const LogoDivider = () => (
        <span className="inline-flex items-center gap-1 px-4 h-full align-middle">
            <span className="text-[11px] font-black italic tracking-tighter text-white uppercase">
                GOAL<span className="text-emerald-500">PRO</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse"></span>
        </span>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 md:px-6 lg:px-0 my-6">
            <div className="relative flex items-center bg-zinc-950 rounded-xl overflow-hidden border border-white/10] h-12">
                
                {/* 1. Breaking Label */}
                <div className="relative z-40 bg-rose-600 px-8 h-full flex items-center shrink-0">
                    <div className="absolute top-0 -right-4 h-full w-8 bg-rose-600 skew-x-[-20deg] origin-top shadow-[10px_0_20px_rgba(0,0,0,0.3)]"></div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <p className="text-white text-[11px] font-black uppercase tracking-[0.2em] italic whitespace-nowrap">
                            Live Update
                        </p>
                    </div>
                </div>

                {/* 2. Scrolling Area (Seamless Loop) */}
                <div className="flex-1 overflow-hidden h-full">
                    <motion.div
                        className="flex items-center h-full whitespace-nowrap w-max cursor-pointer"
                        // 0% theke -50% mane content-er ekta pura set par holei loop reset hobe
                        animate={{ x: ["0%", "-50%"] }} 
                        transition={{
                            duration: 20, // Content length onujayi speed adjust koro
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        onMouseEnter={() => controls.stop()}
                        onMouseLeave={() => controls.start({ x: "-50%", transition: { duration: 20, ease: "linear", repeat: Infinity } })}
                    >
                        {/* 2 ta set rakha hoyeche jate ekta sesh hotei porer-ta seamlessly chole ashe */}
                        {[1, 2].map((loop) => (
                            <div key={loop} className="flex items-center">
                                {news.map((item, index) => (
                                    <div key={index} className="flex items-center">
                                        <span className="text-zinc-200 font-bold text-[14px] tracking-wide leading-none">
                                            {item.title}
                                        </span>
                                        <LogoDivider />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* 3. Gradient Overlay */}
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-zinc-950 via-zinc-950/90 to-transparent z-20 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default BreakingNews;