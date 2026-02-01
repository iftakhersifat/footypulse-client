import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import { AuthContext } from '../Firebase/AuthProvider';
import { 
    FiHome, FiUsers, FiPlusCircle, FiSettings, 
    FiLogOut, FiGrid, FiImage, FiZap, FiUserPlus, 
    FiShield, FiLayout, FiActivity, FiSun, FiMoon, FiChevronRight 
} from 'react-icons/fi';
import { FaFutbol } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user, logOut } = useContext(AuthContext);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute("data-theme", theme);
        theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

    const handleLogOut = () => {
        logOut().then(() => {}).catch(err => console.log(err));
    };

    const activeClass = "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 font-bold translate-x-1";
    const inactiveClass = "text-slate-600 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-zinc-900 hover:text-emerald-600 dark:hover:text-emerald-400 translate-x-0";

    const sidebarLinks = (
        <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 mt-6 mb-2">Overview</p>
            <li>
                <NavLink to="/admin" end className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiGrid size={18} /> Dashboard Home
                </NavLink>
            </li>

            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 mt-6 mb-2">Content Control</p>
            <li>
                <NavLink to="/admin/banner" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiImage size={18} /> Manage Banner
                </NavLink>
            </li>
            <li>
                <NavLink to="/admin/add-news" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiZap size={18} /> Breaking News
                </NavLink>
            </li>

            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 mt-6 mb-2">Entities</p>
            <li>
                <NavLink to="/admin/add-player" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiUserPlus size={18} /> Add Player
                </NavLink>
            </li>
            <li>
                <NavLink to="/admin/add-manager" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiShield size={18} /> Add Manager
                </NavLink>
            </li>
            <li>
                <NavLink to="/admin/add-club" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiLayout size={18} /> Add Club
                </NavLink>
            </li>

            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 mt-6 mb-2">Tournament</p>
            <li>
                <NavLink to="/admin/match-manage" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiActivity size={18} /> Match Updates
                </NavLink>
            </li>
            <li>
                <NavLink to="/admin/team-set" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiSettings size={18} /> Team Settings
                </NavLink>
            </li>

            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em] px-4 mt-6 mb-2">Access</p>
            <li>
                <NavLink to="/admin/manage-users" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeClass : inactiveClass}`}>
                    <FiUsers size={18} /> Manage Users
                </NavLink>
            </li>
        </div>
    );

    return (
        <div className="drawer lg:drawer-open font-sans">
            <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col transition-colors duration-300 min-h-screen">
                
                {/* --- NEW PROFESSIONAL HEADER --- */}
                <header className="sticky top-0 z-[40] flex h-20 w-full justify-between items-center bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl px-4 lg:px-10 border-b border-slate-200 dark:border-zinc-900 transition-all">
                    
                    {/* Mobile Branding */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <label htmlFor="admin-drawer" className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400">
                            <FiGrid size={22} />
                        </label>
                        <span className="text-xl font-black italic tracking-tighter uppercase dark:text-white">Goal<span className="text-emerald-600">Pro</span></span>
                    </div>

                    {/* Professional Breadcrumb/Status Section */}
                    <div className="hidden lg:flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500">
                            <span>GoalPro Admin</span>
                            <FiChevronRight className="text-emerald-600" />
                            <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">Live Control</span>
                        </div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            Management <span className="text-emerald-600 underline decoration-emerald-500/30 underline-offset-4">Dashboard</span>
                        </h1>
                    </div>

                    {/* Right Side: Theme & User */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleTheme} 
                            className="p-3 rounded-2xl border bg-white dark:bg-zinc-900 text-slate-600 dark:text-yellow-400 border-slate-200 dark:border-zinc-800 shadow-sm transition-all hover:scale-105 active:scale-95"
                        >
                            {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
                        </button>

                        <div className="h-10 w-[1px] bg-slate-200 dark:bg-zinc-800 mx-1 hidden sm:block"></div>

                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="hidden sm:block text-right leading-none">
                                <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{user?.displayName}</p>
                                <p className="text-[9px] uppercase font-bold text-slate-400 mt-1.5 tracking-widest bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                    {user?.role || "Admin"}
                                </p>
                            </div>
                            <div className="relative">
                                <img 
                                    className="w-11 h-11 rounded-2xl ring-2 ring-emerald-500/10 group-hover:ring-emerald-500 transition-all object-cover" 
                                    src={user?.photoURL} 
                                    alt="admin" 
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto dark:text-zinc-100">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Sidebar Section */}
            <div className="drawer-side z-[50]">
                <label htmlFor="admin-drawer" className="drawer-overlay"></label>
                <div className="flex flex-col w-72 min-h-full bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-900 transition-colors">
                    
                    <div className="p-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-500/40 group-hover:rotate-12 transition-transform">
                                <FaFutbol size={20} />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter uppercase dark:text-white transition-colors">Goal<span className="text-emerald-600">Pro</span></span>
                        </Link>
                    </div>

                    <ul className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
                        {sidebarLinks}
                    </ul>

                    <div className="p-6 border-t border-slate-50 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/30">
                        <Link to="/" className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-slate-600 dark:text-zinc-400 font-bold hover:bg-white dark:hover:bg-zinc-900 shadow-sm transition-all text-sm mb-2 group">
                            <FiHome size={18} className="group-hover:text-emerald-600 transition-colors" /> Back to Website
                        </Link>
                        <button 
                            onClick={handleLogOut} 
                            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                        >
                            <FiLogOut size={16} /> Terminate Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;