import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    FiActivity, FiUsers, FiTarget, FiTrendingUp, 
    FiMic, FiMail, FiShield, FiClock, FiChevronRight 
} from 'react-icons/fi';

const DashboardHome = () => {
    const [statsData, setStatsData] = useState({
        totalMatches: 0,
        totalPlayers: 0,
        totalUsers: 0,
        messages: 0
    });
    const [latestNews, setLatestNews] = useState("Initializing System...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [matches, players, users, messages, news] = await Promise.all([
                    axios.get('http://localhost:5000/matches'),
                    axios.get('http://localhost:5000/players'),
                    axios.get('http://localhost:5000/users'),
                    axios.get('http://localhost:5000/messages'),
                    axios.get('http://localhost:5000/news')
                ]);

                setStatsData({
                    totalMatches: matches.data.length,
                    totalPlayers: players.data.length,
                    totalUsers: users.data.length,
                    messages: messages.data.length
                });

                if (news.data.length > 0) setLatestNews(news.data[0].title);
                setLoading(false);
            } catch (err) {
                console.error("Dashboard Sync Error", err);
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const stats = [
        {
            label: "Total Fixtures",
            value: statsData.totalMatches,
            icon: <FiActivity />,
            color: "from-blue-600 to-cyan-500",
            shadow: "shadow-blue-500/20",
            trend: "Live matches tracked"
        },
        {
            label: "Elite Players",
            value: statsData.totalPlayers,
            icon: <FiShield />,
            color: "from-emerald-600 to-teal-400",
            shadow: "shadow-emerald-500/20",
            trend: "Verified squad"
        },
        {
            label: "Pending Inquiry",
            value: statsData.messages,
            icon: <FiMail />,
            color: "from-amber-500 to-orange-400",
            shadow: "shadow-amber-500/20",
            trend: "Awaiting response"
        }
    ];

    if (loading) return (
        <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black italic text-slate-400 tracking-widest animate-pulse">ESTABLISHING SECURE CONNECTION...</p>
        </div>
    );

    return (
        <div className="space-y-12 pb-10">
            {/* --- TOP BAR / GREETING --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                        Command <span className="text-emerald-600">Center</span>
                    </h1>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Operational Intelligence Dashboard</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <FiClock className="animate-spin-slow" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Server Status</p>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Active / Optimized</p>
                    </div>
                </div>
            </div>

            {/* --- HERO BROADCAST SECTION --- */}
            <div className="relative group overflow-hidden rounded-[3rem] bg-slate-900 p-1 md:p-1 shadow-2xl">
                <div className="relative z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.9rem] p-8 md:p-14 overflow-hidden">
                    {/* Animated Background Pulse */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-700" />
                    
                    <div className="relative z-20 max-w-3xl space-y-6">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Breaking Announcement</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-[0.9] group-hover:tracking-normal transition-all duration-500">
                            "{latestNews}"
                        </h2>
                        
                        <p className="text-slate-400 text-sm md:text-lg font-medium leading-relaxed max-w-xl">
                            Welcome back, Administrator. System analytics show <span className="text-white font-bold">{statsData.totalUsers} active users</span> engaging with the platform today.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2">
                                Launch Manager <FiChevronRight />
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                                View Logs
                            </button>
                        </div>
                    </div>

                    {/* Background Icon Decoration */}
                    <FiTarget className="absolute right-10 bottom-[-20px] text-white/[0.03] text-[300px] rotate-12 pointer-events-none" />
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white text-2xl shadow-lg ${stat.shadow} group-hover:rotate-6 transition-transform duration-500`}>
                                {stat.icon}
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Feed</span>
                                <div className="flex items-center gap-1 justify-end text-emerald-500 mt-1">
                                    <FiTrendingUp size={12} />
                                    <span className="text-[10px] font-bold italic">Stable</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-5xl font-black text-slate-900 tracking-tighter mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                                {stat.label}
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <p className="text-[10px] font-bold text-slate-400 italic">{stat.trend}</p>
                            <div className="w-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${stat.color} w-2/3`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- BOTTOM INTELLIGENCE SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Health Monitor */}
                <div className="lg:col-span-3 bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-10">
                            <h4 className="font-black text-xl text-slate-900 uppercase italic tracking-tighter">Infrastructure Health</h4>
                            <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Real-time Node Status</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {[
                                { name: "Database Clusters", sub: "MongoDB Atlas", val: "88%", color: "bg-blue-500" },
                                { name: "Media Assets", sub: "Cloudinary Engine", val: "94%", color: "bg-emerald-500" },
                                { name: "API Latency", sub: "Edge Functions", val: "99%", color: "bg-indigo-500" },
                                { name: "Security Layers", sub: "JWT / SSL", val: "100%", color: "bg-rose-500" }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
                                        </div>
                                        <span className="text-sm font-black text-slate-900 italic">{item.val}</span>
                                    </div>
                                    <div className="h-2.5 bg-slate-50 rounded-full p-0.5">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: item.val }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Action Support */}
                <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3rem] p-10 text-white relative shadow-xl shadow-emerald-900/10 group flex flex-col justify-between">
                    <div className="relative z-10 space-y-4">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                            <FiUsers />
                        </div>
                        <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">System <br/> Support</h4>
                        <p className="text-emerald-50/70 text-sm font-medium leading-relaxed">
                            Encountering issues with data synchronization or player transfers?
                        </p>
                    </div>
                    
                    <button className="relative z-10 mt-8 w-full bg-white text-emerald-700 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-50 transition-all active:scale-95 shadow-emerald-900/20">
                        Open Support Ticket
                    </button>

                    {/* Decoration */}
                    <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;