import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUploadCloud, FiUser, FiShield, FiBriefcase, FiCalendar, 
    FiEdit3, FiTrash2, FiX, FiFlag, FiActivity, FiAward, FiCheckCircle, FiSlash 
} from 'react-icons/fi';
import Swal from 'sweetalert2';

const ManagerManagement = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingManager, setEditingManager] = useState(null);
    const [fileName, setFileName] = useState("");
    const [imagePreview, setImagePreview] = useState(null); 
    
    const IMGBB_API_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const API_URL = 'http://localhost:5000/manager';

    const fetchManagers = async () => {
        try {
            const res = await axios.get(API_URL);
            setManagers(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => { fetchManagers(); }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        
        const managerData = { 
            name: form.name.value, 
            age: parseInt(form.age.value), 
            currentClub: form.currentClub.value, 
            previousClub: form.previousClub.value, 
            nationality: form.nationality.value,
            formation: form.formation.value,
            successRatio: parseFloat(form.successRatio.value),
            joinedDate: form.joinedDate.value,
            totalTrophies: parseInt(form.totalTrophies.value),
            status: form.status.value, // New Status Field
            image: editingManager?.image 
        };

        const imageFile = form.image.files[0];

        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const imgRes = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
                managerData.image = imgRes.data.data.display_url;
            }

            if (editingManager) {
                await axios.put(`${API_URL}/${editingManager._id}`, managerData);
                Swal.fire('Updated!', 'Tactical profile refreshed.', 'success');
            } else {
                await axios.post(API_URL, { ...managerData, role: 'manager' });
                Swal.fire('Success!', 'Manager registered to the squad.', 'success');
            }

            setEditingManager(null);
            setFileName("");
            setImagePreview(null);
            form.reset();
            fetchManagers();
        } catch (error) {
            Swal.fire('Error!', 'Check your Connection or API Key.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Terminate Contract?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Terminate!',
            background: '#0a0a0a',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`${API_URL}/${id}`);
                Swal.fire('Deleted!', 'Manager has left the club.', 'success');
                fetchManagers();
            }
        });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] py-20 px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Form Section */}
                <div className="mb-20">
                    <div className="mb-12 flex justify-between items-end">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                                {editingManager ? 'Update' : 'Register'} <span className="text-emerald-500">Manager</span>
                            </h2>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.5em] mt-2 underline decoration-emerald-500 underline-offset-4">Technical Staff Entry</p>
                        </div>
                        {editingManager && (
                            <button onClick={() => {setEditingManager(null); setFileName(""); setImagePreview(null);}} className="flex items-center gap-2 text-red-500 font-black uppercase text-xs hover:tracking-widest transition-all">
                                <FiX /> Abort Update
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-zinc-900/30 p-8 md:p-12 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            <InputGroup icon={<FiUser />} label="Full Name" name="name" defaultValue={editingManager?.name} placeholder="e.g. Pep Guardiola" />
                            <InputGroup icon={<FiFlag />} label="Nationality" name="nationality" defaultValue={editingManager?.nationality} placeholder="e.g. Spanish" />
                            <InputGroup icon={<FiCalendar />} label="Age" name="age" type="number" defaultValue={editingManager?.age} placeholder="53" />

                            <InputGroup icon={<FiShield />} label="Current Club" name="currentClub" defaultValue={editingManager?.currentClub} placeholder="e.g. Man City" />
                            <InputGroup icon={<FiBriefcase />} label="Previous Club" name="previousClub" defaultValue={editingManager?.previousClub} placeholder="e.g. Bayern Munich" />
                            
                            {/* New Status Select Group */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                    <span className="text-emerald-500"><FiActivity /></span> Professional Status
                                </label>
                                <select 
                                    name="status" 
                                    defaultValue={editingManager?.status || "Active"}
                                    className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold text-sm appearance-none cursor-pointer"
                                >
                                    <option value="Active">Currently Managing</option>
                                    <option value="Inactive">On Tactical Break</option>
                                </select>
                            </div>

                            <InputGroup icon={<FiActivity />} label="Formation" name="formation" defaultValue={editingManager?.formation} placeholder="e.g. 4-3-3" />
                            <InputGroup icon={<FiActivity />} label="Success Ratio (%)" name="successRatio" type="number" step="0.1" defaultValue={editingManager?.successRatio} placeholder="72.5" />
                            <InputGroup icon={<FiAward />} label="Total Trophies" name="totalTrophies" type="number" defaultValue={editingManager?.totalTrophies} placeholder="37" />
                            
                            <div className="md:col-span-1">
                                <InputGroup icon={<FiCalendar />} label="Joined Date" name="joinedDate" type="date" defaultValue={editingManager?.joinedDate} />
                            </div>

                            <div className="md:col-span-3">
                                <div className="flex flex-col md:flex-row gap-6 items-center bg-white dark:bg-black/20 p-6 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
                                    {(imagePreview || editingManager?.image) && (
                                        <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-emerald-500 shadow-2xl flex-shrink-0">
                                            <img src={imagePreview || editingManager?.image} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                    )}
                                    <div className="flex-1 w-full">
                                        <input type="file" name="image" className="hidden" id="imageUpload" onChange={handleImageChange} />
                                        <label htmlFor="imageUpload" className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] p-8 hover:border-emerald-500/50 transition-all">
                                            <FiUploadCloud className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" size={28} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                {fileName ? `File: ${fileName}` : 'Update Profile Image'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button disabled={loading} className="w-full mt-10 py-6 rounded-3xl bg-emerald-500 text-black font-black uppercase italic tracking-[0.3em] hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                            {loading ? 'Processing...' : editingManager ? 'Apply Strategic Changes' : 'Confirm Registration'}
                        </button>
                    </form>
                </div>

                {/* Managers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {managers.map((m) => (
                            <motion.div 
                                key={m._id} layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-white/5 p-6 group"
                            >
                                {/* Status Indicator */}
                                <div className="absolute top-6 right-6 z-20">
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${m.status === 'Inactive' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        <span className={`w-1 h-1 rounded-full ${m.status === 'Inactive' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
                                        {m.status || 'Active'}
                                    </div>
                                </div>

                                <div className="flex items-center gap-5 mb-6">
                                    <div className="relative">
                                        <img src={m.image} className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={m.name} />
                                        <div className="absolute -top-2 -left-2 bg-black text-[8px] font-black px-2 py-1 rounded-md text-emerald-500 border border-emerald-500/20 uppercase">Head</div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase italic leading-tight">{m.name}</h4>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1 tracking-tighter flex items-center gap-1">
                                            <FiShield size={10}/> {m.currentClub}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <StatBox label="Win Rate" value={`${m.successRatio}%`} />
                                    <StatBox label="Status" value={m.status === 'Inactive' ? 'On Break' : 'Managing'} />
                                </div>
                                
                                <div className="flex gap-3">
                                    <button onClick={() => {setEditingManager(m); window.scrollTo({ top: 0, behavior: 'smooth' });}} className="flex-1 py-3 rounded-xl bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center gap-2 font-black text-[9px] tracking-widest border border-slate-100 dark:border-transparent">
                                        <FiEdit3 size={14} /> EDIT
                                    </button>
                                    <button onClick={() => handleDelete(m._id)} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value }) => (
    <div className="bg-white dark:bg-zinc-800/40 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-slate-900 dark:text-white italic">{value}</p>
    </div>
);

const InputGroup = ({ icon, label, name, type = "text", defaultValue = "", step, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
            <span className="text-emerald-500">{icon}</span> {label}
        </label>
        <input 
            type={type} name={name} required step={step} placeholder={placeholder}
            key={defaultValue} defaultValue={defaultValue} 
            className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/5 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:text-white font-bold placeholder:text-slate-300 dark:placeholder:text-zinc-700 text-sm" 
        />
    </div>
);

export default ManagerManagement;