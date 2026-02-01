import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const HeroBanner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get('http://localhost:5000/banners');
                setBanners(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Banner load error:", err);
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, [banners.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    };

    useEffect(() => {
        if (banners.length === 0) return;
        const interval = setInterval(handleNext, 6000);
        return () => clearInterval(interval);
    }, [handleNext, banners]);

    if (loading) return <div className="w-full h-screen bg-zinc-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <span className="text-emerald-500 font-bold tracking-widest text-xs uppercase">Loading...</span>
            </div>
        </div>;
    if (banners.length === 0) return null;

    return (
        <section className="relative group w-full h-[85vh] md:h-[90vh] lg:h-screen overflow-hidden bg-black">
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative w-full h-full"
                >
                    <img
                        src={banners[currentIndex].image}
                        alt={banners[currentIndex].title}
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent hidden lg:block" />

                    {/* Content Section */}
                    <div className="absolute inset-0 flex items-end pb-20 md:pb-28 lg:pb-36">
                        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="max-w-4xl"
                            >

                                {/* Fixed Text Size: Title scaling improved */}
                                <h2 className="text-4xl sm:text-6xl md:text-3xl lg:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-6 drop-shadow-2xl">
                                    {banners[currentIndex].title}
                                </h2>
                                
                                {/* Fixed Description Size */}
                                <p className="text-zinc-300 text-xs sm:text-base md:text-xl font-medium max-w-xl md:max-w-2xl line-clamp-2 border-l-2 md:border-l-4 border-emerald-500 pl-4 md:pl-6">
                                    {banners[currentIndex].description}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* --- Navigation Controls: Hidden on Mobile (hidden), Visible from Medium (md:flex) --- */}
            <div className="absolute inset-y-0 left-0 right-0 hidden md:flex items-center justify-between px-6 lg:px-12 z-20 pointer-events-none">
                <button 
                    onClick={handlePrev} 
                    className="pointer-events-auto p-4 bg-black/20 hover:bg-emerald-600 backdrop-blur-md text-white rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                >
                    <FiChevronLeft size={24} />
                </button>
                <button 
                    onClick={handleNext} 
                    className="pointer-events-auto p-4 bg-black/20 hover:bg-emerald-600 backdrop-blur-md text-white rounded-full transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                >
                    <FiChevronRight size={24} />
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-500 h-1 rounded-full ${
                            currentIndex === index ? 'w-12 md:w-16 bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'w-4 md:w-6 bg-white/30 hover:bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroBanner;