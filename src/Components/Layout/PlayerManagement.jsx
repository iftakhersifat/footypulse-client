import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSave, FiTrello, FiSettings, FiUsers, FiShield, FiX, FiPlus } from 'react-icons/fi';
import Swal from 'sweetalert2';

// --- Custom Search Component with Global Lock Filter ---
const PlayerSelectBox = ({ id, label, color, initialValue, entities, onUpdate, usedIds }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setSearchTerm(initialValue?.name || initialValue || '');
    }, [initialValue]);

    // RULE: Filter out if name matches OR if ID is already used in ANY match
    const filtered = (entities || []).filter(item => 
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !usedIds.includes(item._id) 
    ).slice(0, 5);

    return (
        <div className="flex flex-col items-center relative z-30">
            <span className={`text-[9px] font-black ${color} mb-1 uppercase tracking-tighter`}>{label}</span>
            <div className="relative">
                <input 
                    type="text"
                    className="w-24 md:w-32 bg-black/90 border border-white/10 rounded-xl text-[10px] p-2.5 text-center text-white focus:border-emerald-500 outline-none transition-all shadow-xl"
                    value={searchTerm}
                    onChange={(e) => { 
                        setSearchTerm(e.target.value); 
                        onUpdate(id, e.target.value); 
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
                    placeholder="Search..."
                />
                
                {showDropdown && searchTerm.length > 0 && filtered.length > 0 && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52 bg-zinc-900 border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-2 text-[7px] font-black text-emerald-500 bg-emerald-500/10 uppercase border-b border-white/5 tracking-widest text-center">Available in Database</div>
                        {filtered.map(item => (
                            <div 
                                key={item._id}
                                onClick={() => {
                                    setSearchTerm(item.name);
                                    onUpdate(id, item);
                                    setShowDropdown(false);
                                }}
                                className="p-2.5 flex items-center gap-3 hover:bg-emerald-600 cursor-pointer border-b border-white/5"
                            >
                                <img src={item.image} className="w-7 h-7 rounded-full object-cover border border-white/20" alt="" />
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] font-black text-white truncate">{item.name}</p>
                                    <p className="text-[8px] text-zinc-400 uppercase leading-none">{item.position || 'Staff'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="mt-2 h-10">
                {initialValue?.image ? (
                    <div className="w-9 h-9 rounded-full border-2 border-emerald-500/30 overflow-hidden shadow-lg shadow-emerald-500/20">
                        <img src={initialValue.image} className="w-full h-full object-cover" alt="" />
                    </div>
                ) : searchTerm.length > 0 ? (
                    <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-black text-zinc-500">M</div>
                ) : (
                    <div className="w-9 h-9 rounded-full bg-zinc-900/50 border border-dashed border-white/10" />
                )}
            </div>
        </div>
    );
};

const PlayerManagement = () => {
    const [matches, setMatches] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [allManagers, setAllManagers] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [selectedTeamKey, setSelectedTeamKey] = useState('team1');
    const [formationString, setFormationString] = useState("4-3-3");
    const [lineup, setLineup] = useState({});
    const [extraInfo, setExtraInfo] = useState({ manager: null, substitutes: [] });
    const [subInput, setSubInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        const loadData = async () => {
            try {
                const [mRes, pRes, mgrRes] = await Promise.all([
                    axios.get('http://localhost:5000/matches'),
                    axios.get('http://localhost:5000/players'),
                    axios.get('http://localhost:5000/manager')
                ]);
                setMatches(mRes.data);
                setAllPlayers(pRes.data);
                setAllManagers(mgrRes.data);
            } catch (err) { console.error("Error loading data", err); }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (selectedMatch) {
            const data = selectedMatch.lineups?.[selectedTeamKey] || {};
            setLineup(data.players || {});
            setFormationString(data.formation || "4-3-3");
            setExtraInfo({
                manager: data.manager || null,
                substitutes: Array.isArray(data.substitutes) ? data.substitutes : []
            });
        }
    }, [selectedTeamKey, selectedMatch]);

    // --- NEW: Global Lock Logic (Scan ALL matches for used IDs) ---
    const getUsedIds = () => {
        const ids = [];
        
        matches.forEach(m => {
            const teams = ['team1', 'team2'];
            teams.forEach(tKey => {
                // Determine data: use live state if it's the current being edited team, else use DB data
                let data;
                if (selectedMatch && m._id === selectedMatch._id && tKey === selectedTeamKey) {
                    data = { players: lineup, substitutes: extraInfo.substitutes, manager: extraInfo.manager };
                } else {
                    data = m.lineups?.[tKey] || {};
                }

                // Add Managers to lock list
                if (data.manager?._id) ids.push(data.manager._id);

                // Add Players to lock list
                if (data.players) {
                    Object.values(data.players).forEach(p => { if (p?._id) ids.push(p._id); });
                }

                // Add Substitutes to lock list
                if (Array.isArray(data.substitutes)) {
                    data.substitutes.forEach(s => { if (s?._id) ids.push(s._id); });
                }
            });
        });
        return ids;
    };

    const handleSave = async () => {
        if (!selectedMatch) return;
        setLoading(true);
        try {
            const updatedLineups = {
                ...(selectedMatch.lineups || {}),
                [selectedTeamKey]: { 
                    formation: formationString, 
                    players: lineup,
                    manager: extraInfo.manager,
                    substitutes: extraInfo.substitutes
                }
            };
            await axios.patch(`http://localhost:5000/matches/${selectedMatch._id}`, { lineups: updatedLineups });
            
            // Critical: Update local matches state so Global Lock reflects immediately without refresh
            const newMatches = matches.map(m => m._id === selectedMatch._id ? { ...m, lineups: updatedLineups } : m);
            setMatches(newMatches);
            setSelectedMatch({...selectedMatch, lineups: updatedLineups});
            
            Swal.fire({ title: 'Squad Globally Locked!', icon: 'success', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        } catch (e) { Swal.fire('Error', 'Save failed', 'error'); }
        setLoading(false);
    };

    const formationRows = formationString.split('-').filter(n => n !== "").map(Number);

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 p-4 md:p-8 font-sans">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. SIDEBAR */}
                <div className="lg:col-span-3">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 flex items-center gap-2">
                        <FiTrello /> Tactical Fixtures
                    </h2>
                    <div className="space-y-3">
                        {matches.map(m => (
                            <button 
                                key={m._id} 
                                onClick={() => { setSelectedMatch(m); setSelectedTeamKey('team1'); }}
                                className={`w-full p-5 rounded-[2rem] text-left border-2 transition-all ${selectedMatch?._id === m._id ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-zinc-900 border-white/5 hover:border-emerald-500/30 text-zinc-500'}`}
                            >
                                <p className="text-[8px] font-black opacity-60 uppercase">{m.leagueName}</p>
                                <p className="text-sm font-black italic">{m.team1Name} vs {m.team2Name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. MAIN CONSOLE */}
                <div className="lg:col-span-9">
                    {selectedMatch ? (
                        <div className="space-y-6">
                            <div className="bg-zinc-900/40 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 flex flex-wrap items-center justify-between gap-6">
                                <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/5">
                                    {['team1', 'team2'].map(key => (
                                        <button key={key} onClick={() => setSelectedTeamKey(key)} className={`px-8 py-3 rounded-xl text-[10px] font-black transition-all ${selectedTeamKey === key ? 'bg-emerald-500 text-white shadow-xl' : 'text-zinc-500 hover:text-white'}`}>
                                            {selectedMatch[`${key}Name`].toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-4">
                                    <input className="w-20 bg-black/40 border border-white/10 rounded-xl p-2.5 text-emerald-500 font-black text-center outline-none" value={formationString} onChange={(e) => setFormationString(e.target.value)} />
                                    <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-black text-xs text-white shadow-lg flex items-center gap-2">
                                        <FiSave /> {loading ? 'SAVING...' : 'SAVE SQUAD'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                {/* PITCH */}
                                <div className="xl:col-span-2 relative aspect-[3/4.2] bg-[#07130a] rounded-[4rem] border-[12px] border-zinc-900 p-12 flex flex-col-reverse justify-between overflow-hidden shadow-2xl">
                                    <div className="flex justify-center z-10">
                                        <PlayerSelectBox id="gk" label="Goalkeeper" color="text-emerald-400" entities={allPlayers} usedIds={getUsedIds()} initialValue={lineup['gk']} onUpdate={(id, p) => setLineup(prev => ({...prev, [id]: p}))} />
                                    </div>
                                    {formationRows.map((count, rowIndex) => (
                                        <div key={rowIndex} className="flex justify-around items-center z-10">
                                            {[...Array(count)].map((_, i) => (
                                                <PlayerSelectBox 
                                                    key={`${rowIndex}-${i}`} id={`row-${rowIndex}-p-${i}`} 
                                                    label={rowIndex === 0 ? "DEF" : rowIndex === formationRows.length - 1 ? "ATT" : "MID"}
                                                    color={rowIndex === 0 ? "text-sky-400" : rowIndex === formationRows.length - 1 ? "text-rose-500" : "text-amber-400"}
                                                    entities={allPlayers} usedIds={getUsedIds()} 
                                                    initialValue={lineup[`row-${rowIndex}-p-${i}`]}
                                                    onUpdate={(id, p) => setLineup(prev => ({...prev, [id]: p}))}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    {/* MANAGER BOX - Global UsedIds Applied */}
                                    <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                                        <h3 className="text-[10px] font-black uppercase text-emerald-500 mb-6 flex items-center gap-2 italic tracking-widest"><FiShield/> Head Coach</h3>
                                        <PlayerSelectBox 
                                            id="manager" label="Search Staff" color="text-white" 
                                            entities={allManagers} usedIds={getUsedIds()} 
                                            initialValue={extraInfo.manager} 
                                            onUpdate={(id, p) => setExtraInfo({...extraInfo, manager: p})} 
                                        />
                                    </div>

                                    {/* BENCH BOX - Global UsedIds Applied */}
                                    <div className="bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                                        <h3 className="text-[10px] font-black uppercase text-zinc-500 mb-6 flex items-center gap-2 italic tracking-widest"><FiUsers/> Bench</h3>
                                        <div className="flex gap-2 mb-6">
                                            <div className="flex-1">
                                                <PlayerSelectBox 
                                                    id="sub-input" label="Find Substitutes" color="text-zinc-600" 
                                                    entities={allPlayers} usedIds={getUsedIds()}
                                                    initialValue={subInput} onUpdate={(id, p) => setSubInput(p)} 
                                                />
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if(!subInput) return;
                                                    const newSub = typeof subInput === 'object' ? subInput : { name: subInput, _id: Date.now().toString() };
                                                    setExtraInfo(prev => ({...prev, substitutes: [...prev.substitutes, newSub]}));
                                                    setSubInput('');
                                                }}
                                                className="mt-4 p-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl shadow-lg transition-all self-start"
                                            >
                                                <FiPlus size={18} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                            {extraInfo.substitutes.map((sub, idx) => (
                                                <div key={idx} className="bg-black/60 p-3 rounded-2xl border border-white/5 flex flex-col items-center gap-2 relative group hover:border-emerald-500/40 transition-all">
                                                    {sub.image ? <img src={sub.image} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" /> : <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">M</div>}
                                                    <span className="text-[9px] font-black text-white text-center truncate w-full px-1">{sub.name || sub}</span>
                                                    <button onClick={() => setExtraInfo({...extraInfo, substitutes: extraInfo.substitutes.filter((_, i) => i !== idx)})} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                                        <FiX size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[80vh] flex flex-col items-center justify-center bg-zinc-900/20 rounded-[4rem] border-2 border-dashed border-white/5 text-zinc-700">
                            <FiSettings size={50} className="mb-6 opacity-10" />
                            <p className="uppercase font-black text-[12px] tracking-[0.5em] opacity-40">Select fixture to begin</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlayerManagement;