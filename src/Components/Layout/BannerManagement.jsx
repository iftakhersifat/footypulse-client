import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FiPlus, FiTrash2, FiEdit3, FiImage, 
    FiLoader, FiUploadCloud, FiXCircle, FiGrid
} from 'react-icons/fi';
import Swal from 'sweetalert2';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ image: '', title: '', description: '' });

    const IMGBB_API_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY; 

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await axios.get('http://localhost:5000/banners');
            setBanners(res.data);
        } catch (err) {
            console.error("Error fetching banners:", err);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const imgFormData = new FormData();
        imgFormData.append('image', file);

        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, 
                imgFormData
            );
            setFormData({ ...formData, image: res.data.data.display_url });
            
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Artwork Processed!',
                showConfirmButton: false,
                timer: 2000,
                background: '#18181b',
                color: '#fff'
            });
        } catch (err) {
            Swal.fire('Upload Failed', 'Check your API key or connection.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) return Swal.fire('Warning', 'Banner image is mandatory.', 'warning');
        
        setLoading(true);
        try {
            if (editingId) {
                await axios.patch(`http://localhost:5000/banners/${editingId}`, formData);
                Swal.fire('Updated', 'Global banner synchronized.', 'success');
            } else {
                await axios.post('http://localhost:5000/banners', formData);
                Swal.fire('Deployed', 'New banner is now live.', 'success');
            }
            resetForm();
            fetchBanners();
        } catch (err) {
            Swal.fire('System Error', 'Database connection refused.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Decommission Banner?',
            text: "This action cannot be undone from the cloud.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, Delete',
            background: '#18181b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/banners/${id}`);
                fetchBanners();
                Swal.fire('Removed', 'Data cleared from cluster.', 'success');
            }
        });
    };

    const resetForm = () => {
        setFormData({ image: '', title: '', description: '' });
        setEditingId(null);
    };

    const startEdit = (banner) => {
        setFormData(banner);
        setEditingId(banner._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen p-4 md:p-10 bg-white dark:bg-transparent transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                
                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <FiGrid className="text-emerald-500 text-2xl animate-pulse" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Banners</p>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none">
                            Manage <span className="text-emerald-500">Banner</span>
                        </h1>
                    </div>
                    <div className="bg-zinc-100 dark:bg-zinc-900 px-6 py-4 rounded-3xl border border-zinc-200 dark:border-white/5">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Slots</p>
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{banners.length} <span className="text-sm text-zinc-500 font-medium">/ ∞</span></p>
                    </div>
                </div>

                {/* --- Creative Studio (Form) --- */}
                <form onSubmit={handleSubmit} className="relative group mb-20">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[3.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    
                    <div className="relative bg-white dark:bg-zinc-900/90 backdrop-blur-xl p-8 md:p-14 rounded-[3.2rem] border border-zinc-200 dark:border-white/5 shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                            
                            {/* Left: Interactive Dropzone */}
                            <div className="space-y-6">
                                <label className="flex justify-between items-center px-2">
                                    <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Master Artwork</span>
                                    {formData.image && <span className="text-[10px] font-black text-emerald-500 uppercase">Live Preview Active</span>}
                                </label>
                                
                                <div className="relative aspect-[16/8] w-full rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 hover:border-emerald-500/50 group/upload shadow-inner">
                                    {formData.image ? (
                                        <div className="relative w-full h-full animate-in fade-in zoom-in duration-700">
                                            <img src={formData.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover/upload:scale-105" alt="preview" />
                                            <div className="absolute inset-0 bg-zinc-900/60 opacity-0 group-hover/upload:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm">
                                                <div className="p-4 bg-white/10 rounded-full border border-white/20 mb-3">
                                                    <FiUploadCloud className="text-white" size={24} />
                                                </div>
                                                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Replace Source File</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center p-10">
                                            <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform group-hover/upload:scale-110 duration-500">
                                                {uploading ? <FiLoader className="animate-spin text-emerald-500" size={30} /> : <FiImage className="text-zinc-400 group-hover/upload:text-emerald-500 transition-colors" size={30} />}
                                            </div>
                                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest leading-relaxed">Drag assets here or<br/><span className="text-emerald-500">browse local files</span></p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" accept="image/*" onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                            </div>

                            {/* Right: Meta Content */}
                            <div className="flex flex-col justify-center gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] ml-2">Broadcast Headline</label>
                                    <input 
                                        type="text" placeholder="e.g. GRAND CHAMPIONSHIP 2024" 
                                        className="w-full p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border-2 border-transparent focus:border-emerald-500/30 dark:text-white outline-none transition-all font-black text-xl italic uppercase placeholder:text-zinc-300 dark:placeholder:text-zinc-600 shadow-inner"
                                        value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] ml-2">Contextual Data</label>
                                    <textarea 
                                        placeholder="Describe the campaign narrative..." 
                                        className="w-full p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border-2 border-transparent focus:border-emerald-500/30 dark:text-white outline-none transition-all h-32 font-medium resize-none shadow-inner"
                                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="submit" disabled={loading || uploading}
                                        className="flex-1 h-16 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase italic tracking-widest flex items-center justify-center gap-3 group/btn overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-16 group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                                        {uploading ? <><FiLoader className="animate-spin" /> Processing...</> : editingId ? <><FiEdit3 className="relative z-10" /> Sync Updates</> : <><FiPlus className="relative z-10" /> Add Banner</>}
                                    </button>
                                    {editingId && (
                                        <button 
                                            type="button" onClick={resetForm}
                                            className="w-16 h-16 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-rose-500 hover:text-white transition-all rounded-2xl shadow-lg shadow-black/5"
                                        >
                                            <FiXCircle size={24} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* --- Dashboard Grid --- */}
                <div className="flex items-center gap-4 mb-10">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">Live Inventory</h2>
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {banners.map((banner, index) => (
                        <div key={banner._id} className="group bg-white dark:bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-white/5 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-emerald-500/10">
                            <div className="h-60 relative overflow-hidden">
                                <img src={banner.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="banner" />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                                
                                {/* Overlay Controls */}
                                <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                    <button onClick={() => startEdit(banner)} className="w-14 h-14 bg-white rounded-2xl text-zinc-900 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-2xl flex items-center justify-center -translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 delay-75"><FiEdit3 size={22} /></button>
                                    <button onClick={() => handleDelete(banner._id)} className="w-14 h-14 bg-white rounded-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-2xl flex items-center justify-center translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 delay-100"><FiTrash2 size={22} /></button>
                                </div>

                                <div className="absolute bottom-6 left-8">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-lg w-fit">Slot #0{index + 1}</p>
                                </div>
                            </div>
                            
                            <div className="p-10">
                                <h3 className="font-black text-xl dark:text-white uppercase italic truncate tracking-tight mb-3">{banner.title}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium">{banner.description}</p>
                            </div>
                        </div>
                    ))}
                    
                    {banners.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[4rem]">
                            <FiImage className="text-zinc-300 mb-4 animate-bounce" size={48} />
                            <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-sm italic">Cloud Storage Empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BannerManagement;