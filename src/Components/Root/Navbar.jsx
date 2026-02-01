import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router'; 
import { AuthContext } from '../Firebase/AuthProvider';
import toast from 'react-hot-toast';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { Trophy, Home, Calendar, Users, User, LayoutDashboard, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [scrolled, setScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));

  const handleLogOut = () => {
    logOut().then(() => {
      toast.success('Successfully Signed Out');
      setIsDrawerOpen(false);
    }).catch((err) => toast.error(err.message));
  };

  const navLinkStyle = ({ isActive }) => {
    const base = "relative flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 text-sm font-bold tracking-wide ";
    const active = "bg-emerald-600 text-white shadow-lg shadow-emerald-500/40";
    const inactive = (!isHomePage || scrolled)
      ? "text-slate-700 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-zinc-900" 
      : "text-white hover:text-emerald-400 hover:bg-white/10";

    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] transition-all duration-500 pt-3 md:pt-5 px-3 md:px-8 pointer-events-none">
        
        {/* Container: Mobile-e padding komano hoyeche (px-4) */}
        <div className={`max-w-7xl mx-auto transition-all duration-500 pointer-events-auto ${
          scrolled 
            ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-slate-200/50 dark:border-zinc-800/50 py-2 px-4 md:px-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl" 
            : isHomePage 
              ? "bg-transparent py-2" 
              : "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl border border-slate-200/50 dark:border-zinc-800/50 py-2 px-4 md:px-6 rounded-[1.5rem] md:rounded-[2rem]" 
        }`}>
          
          <div className="flex items-center justify-between">
            
            {/* Left: Logo Section - Mobile responsive text size */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className={`lg:hidden p-2 md:p-2.5 rounded-xl md:rounded-2xl border transition-all ${
                  (!isHomePage || scrolled) 
                    ? "bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-100" 
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                <FiMenu size={18} className="md:hidden" />
                <FiMenu size={22} className="hidden md:block" />
              </button>

              <Link to="/" className="flex items-center gap-2 md:gap-3 group">
                <div className="bg-emerald-600 p-2 md:p-2.5 rounded-xl md:rounded-2xl text-white shadow-xl shadow-emerald-500/30 group-hover:rotate-[360deg] transition-all duration-1000">
                   <Trophy size={18} className="md:w-6 md:h-6" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col leading-none">
                  <div className="flex items-center">
                    <span className={`text-lg md:text-2xl font-black tracking-tighter uppercase italic transition-colors ${
                      (!isHomePage || scrolled) ? "text-slate-900 dark:text-white" : "text-white"
                    }`}>
                      GOAL
                    </span>
                    <span className="text-lg md:text-2xl font-black tracking-tighter text-emerald-600 uppercase italic ml-0.5">
                      PRO
                    </span>
                  </div>
                  <span className={`text-[6px] md:text-[8px] font-black tracking-[0.3em] md:tracking-[0.5em] uppercase transition-colors ${
                    (!isHomePage || scrolled) ? "text-slate-500 dark:text-zinc-500" : "text-white/70"
                  }`}>
                    Tournament 2026
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Menu (Hidden on Mobile) */}
            <div className={`hidden lg:flex items-center gap-2 p-1.5 rounded-[1.5rem] border transition-all ${
              (!isHomePage || scrolled)
                ? "bg-slate-100/50 dark:bg-zinc-900/50 border-slate-200/30 dark:border-white/5 backdrop-blur-md"
                : "bg-white/5 border-white/10 backdrop-blur-md"
            }`}>
              <NavLink to="/" className={navLinkStyle}><Home size={16}/> Home</NavLink>
              <NavLink to="/fixtures" className={navLinkStyle}><Calendar size={16}/> Fixtures</NavLink>
              <NavLink to="/players" className={navLinkStyle}><Trophy size={16}/> Players</NavLink>
              <NavLink to="/managers" className={navLinkStyle}><Users size={16}/> Managers</NavLink>
            </div>

            {/* Right: Actions - Smaller icons for mobile */}
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={toggleTheme} 
                className={`p-2 md:p-3 rounded-xl md:rounded-2xl border transition-all ${
                  (!isHomePage || scrolled)
                    ? "bg-white dark:bg-zinc-900 text-slate-600 dark:text-yellow-400 border-slate-200 dark:border-zinc-800 shadow-sm"
                    : "bg-white/10 border-white/20 text-white"
                }`}
              >
                {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
              </button>

              {user ? (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="group p-0.5">
                    <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden ring-2 ring-emerald-500/20 group-hover:ring-emerald-500 transition-all shadow-lg border-2 border-transparent">
                      <img className="w-full h-full object-cover" src={user?.photoURL} alt="User" />
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-5 z-[1] p-2 md:p-3 shadow-2xl menu dropdown-content bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[2.5rem] w-72 md:w-80 overflow-hidden">
                    <div className="px-4 py-5 md:px-5 md:py-6 bg-emerald-600 rounded-[1.2rem] md:rounded-[2rem] mb-3 text-white">
                      <div className="flex items-center gap-3 md:gap-4">
                        <img className="w-10 h-10 md:w-14 md:h-14 rounded-xl object-cover border-2 border-white/20" src={user?.photoURL} alt="" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-sm md:text-base">{user?.displayName}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-white/20 uppercase tracking-widest mt-1">
                             {user?.role || 'Tournament Captain'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <li><Link to="/profile" className="py-3 md:py-4 font-bold text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-2xl text-slate-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-900"><User size={16}/> My Profile</Link></li>
                    {user?.role === 'admin' && (
                      <li><Link to="/admin" className="py-3 font-bold text-[10px] md:text-xs uppercase tracking-widest text-emerald-600 rounded-xl"><LayoutDashboard size={16}/> Admin Panel</Link></li>
                    )}
                    {user?.role === 'employee' && (
                      <li><Link to="/moderator" className="py-3 font-bold text-[10px] md:text-xs uppercase tracking-widest text-emerald-600 rounded-xl"><LayoutDashboard size={16}/> Moderator Panel</Link></li>
                    )}
                    <button onClick={handleLogOut} className="m-1 py-3 md:py-4 bg-rose-500 text-white rounded-[1rem] md:rounded-[1.5rem] font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                      <LogOut size={16}/> Log Out
                    </button>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="bg-emerald-600 text-white px-4 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest shadow-lg">Login</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar (Keep original as it was already good) */}
      {/* Mobile Sidebar */}
{/* Mobile Sidebar */}
<div className={`fixed inset-0 z-[110] ${isDrawerOpen ? "visible" : "invisible"} transition-all duration-300`}>
  
  {/* Backdrop: Smoother blur for cinematic feel */}
  <div 
    className={`absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-opacity duration-700 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`} 
    onClick={() => setIsDrawerOpen(false)}
  ></div>

  {/* Drawer Container: Sleeker width and border logic */}
  <div className={`absolute left-0 top-0 h-full w-[290px] md:w-[340px] bg-white dark:bg-zinc-950 shadow-[20px_0_50px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] border-r border-slate-100 dark:border-zinc-800/50 ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
    
    <div className="flex flex-col h-full relative overflow-hidden">
      
      {/* Background Decorative Element (Optional: Adds a subtle glow) */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header: Iconic & Clean */}
      <div className="p-7 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
              <Trophy size={20} strokeWidth={2.5}/>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="italic font-black text-xl tracking-tighter dark:text-white text-slate-900 leading-none">
              GOAL<span className="text-emerald-600">PRO</span>
            </h1>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-emerald-600/70">Elite Arena</span>
          </div>
        </div>
        
        <button 
          onClick={() => setIsDrawerOpen(false)} 
          className="group p-2 rounded-full bg-slate-50 dark:bg-zinc-900 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300"
        >
          <FiX size={22} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* 2. Menu Links: Premium Spacing & Hover States */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto relative custom-scrollbar">
          {/* <p className="px-5 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-zinc-600">Navigation</p> */}
          
          {[
            { to: "/", icon: <Home size={20}/>, label: "Home" },
            { to: "/fixtures", icon: <Calendar size={20}/>, label: "Fixtures" },
            { to: "/players", icon: <Trophy size={20}/>, label: "Players" },
            { to: "/managers", icon: <Users size={20}/>, label: "Managers" },
          ].map((link) => (
            <NavLink 
              key={link.to}
              onClick={() => setIsDrawerOpen(false)} 
              to={link.to} 
              className={({ isActive }) => `
                group flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-300
                ${isActive 
                  ? "bg-emerald-600 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]" 
                  : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:translate-x-1"}
              `}
            >
              <div className="flex items-center gap-4">
                <span className={`transition-transform duration-300 group-hover:scale-110`}>
                  {link.icon}
                </span>
                <span className="tracking-wide">{link.label}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-0 group-hover:opacity-20" />
            </NavLink>
          ))}

          {/* Admin Divider & Panel */}
          {user?.role === 'admin' && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-900/50">
              <p className="px-5 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Admin Control</p>
              <NavLink 
                onClick={() => setIsDrawerOpen(false)} 
                to="/admin" 
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all
                  ${isActive 
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black" 
                    : "text-zinc-900 dark:text-zinc-100 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10"}
                `}
              >
                <LayoutDashboard size={20}/> Admin Dashboard
              </NavLink>
            </div>
          )}
          {/* Moderator Divider & Panel */}
          {user?.role === 'employee' && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-zinc-900/50">
              <p className="px-5 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Admin Control</p>
              <NavLink 
                onClick={() => setIsDrawerOpen(false)} 
                to="/moderator" 
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all
                  ${isActive 
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-black" 
                    : "text-zinc-900 dark:text-zinc-100 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10"}
                `}
              >
                <LayoutDashboard size={20}/> Moderator Dashboard
              </NavLink>
            </div>
          )}
      </div>

      {/* 3. User Profile & Footer: Elegant Card Look */}
      <div className="p-6 relative">
        {user ? (
          <div className="relative group">
            {/* Background glass effect */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-zinc-900/50 rounded-[2rem] border border-slate-100 dark:border-zinc-800/50 -z-10 group-hover:bg-emerald-500/5 transition-colors duration-500" />
            
            <div className="p-4 space-y-4">
               
               <button 
                 onClick={handleLogOut} 
                 className="w-full py-4 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 flex items-center justify-center gap-2"
               >
                 <LogOut size={14}/> Sign Out
               </button>
            </div>
          </div>
        ) : (
          <Link 
            to="/login" 
            onClick={() => setIsDrawerOpen(false)}
            className="group relative w-full h-14 flex items-center justify-center bg-zinc-900 dark:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-95"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative">Join Now</span>
          </Link>
        )}
      </div>
    </div>
  </div>
</div>
    </>
  );
};

export default Navbar;