import React from 'react';
import { FiActivity, FiUsers, FiTarget, FiTrendingUp } from 'react-icons/fi';

const DashboardHome = () => {
    const stats = [
        {
            label: "Total Matches",
            value: "24",
            icon: <FiActivity size={24} />,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: "+2 since yesterday"
        },
        {
            label: "Live Teams",
            value: "16",
            icon: <FiUsers size={24} />,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: "All squads active"
        },
        {
            label: "Total Goals",
            value: "58",
            icon: <FiTarget size={24} />,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            trend: "2.4 goals per match"
        }
    ];

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-600 p-8 md:p-12 text-white shadow-2xl shadow-emerald-500/20">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase">
                        Welcome back, <span className="underline decoration-white/30 underline-offset-8">Captain!</span>
                    </h2>
                    <p className="mt-4 text-emerald-50 text-sm md:text-base font-medium leading-relaxed opacity-90">
                        The tournament is in full swing. You have <span className="font-bold">3 pending match approvals</span> and the live standings were updated 5 minutes ago.
                    </p>
                    <button className="mt-8 bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-50 transition-all active:scale-95">
                        View Live Stats
                    </button>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 right-10 opacity-10 rotate-12">
                    <FiTrendingUp size={200} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-7 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg uppercase tracking-tighter">
                                Live data
                            </span>
                        </div>
                        
                        <div className="mt-6">
                            <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                {stat.label}
                            </p>
                            <h3 className="text-4xl font-black mt-2 text-slate-900 dark:text-white tracking-tighter">
                                {stat.value}
                            </h3>
                            <p className="mt-4 text-xs font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1.5 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                {stat.trend}
                            </p>
                        </div>

                        {/* Hover Decorative Element */}
                        <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-slate-50 dark:bg-zinc-800/50 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 -z-0 opacity-50" />
                    </div>
                ))}
            </div>

            {/* Placeholder for Recent Activity / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-[2.5rem]">
                    <h4 className="font-black text-lg text-slate-900 dark:text-white mb-6 uppercase italic tracking-tighter">Tournament Health</h4>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-4 bg-slate-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full w-[75%]" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900 dark:bg-emerald-600 p-8 rounded-[2.5rem] flex flex-col justify-center text-white">
                    <h4 className="font-black text-lg mb-2 uppercase italic tracking-tighter">Need Help?</h4>
                    <p className="text-sm opacity-70 mb-6 font-medium">Access the documentation or contact system support for tournament issues.</p>
                    <button className="w-fit px-6 py-3 border-2 border-white/20 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                        Support Center
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;