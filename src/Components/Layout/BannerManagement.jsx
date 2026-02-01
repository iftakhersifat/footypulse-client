import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FiPlus, FiTrash2, FiEdit3, FiImage, 
    FiLoader, FiUploadCloud, FiXCircle 
} from 'react-icons/fi';
import Swal from 'sweetalert2';

const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ image: '', title: '', description: '' });

    // --- Replace with your real ImgBB API Key ---
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

    // ImgBB Gallery Upload Logic
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
                title: 'Image uploaded successfully!',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            Swal.fire('Error', 'Image upload fail hoyeche!', 'error');
        } finally {
            setUploading(false);
        }
    };

    // Create or Update Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.image) return Swal.fire('Wait!', 'Age image select korun.', 'warning');
        
        setLoading(true);
        try {
            if (editingId) {
                await axios.patch(`http://localhost:5000/banners/${editingId}`, formData);
                Swal.fire('Updated!', 'Banner update hoyeche.', 'success');
            } else {
                await axios.post('http://localhost:5000/banners', formData);
                Swal.fire('Success!', 'Notun banner add hoyeche.', 'success');
            }
            resetForm();
            fetchBanners();
        } catch (err) {
            Swal.fire('Error!', 'Operation fail hoyeche.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete korben?',
            text: "Eita permanent-ly muche jabe!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Hya, delete korun'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:5000/banners/${id}`);
                fetchBanners();
                Swal.fire('Deleted!', 'Banner delete kora hoyeche.', 'success');
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
        <div className="min-h-screen p-6 md:p-12 bg-white dark:bg-[#050505]">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">
                            Banner Control Center
                        </h1>
                        <p className="text-emerald-500 font-bold tracking-widest uppercase text-xs mt-2">Manage Home Slider</p>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="bg-zinc-50 dark:bg-zinc-900/40 p-8 md:p-12 rounded-[3rem] border border-zinc-200 dark:border-white/5 mb-16 shadow-2xl relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        
                        {/* Left: Image Upload Zone */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Banner Artwork</label>
                            <div className="relative aspect-video w-full rounded-[2rem] border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-emerald-500 group">
                                {formData.image ? (
                                    <>
                                        <img src={formData.image} className="w-full h-full object-cover" alt="preview" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                            <FiUploadCloud className="text-white mb-2" size={30} />
                                            <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        {uploading ? <FiLoader className="animate-spin text-emerald-500 mx-auto" size={32} /> : <FiImage className="text-zinc-400 mx-auto group-hover:text-emerald-500 transition-colors" size={32} />}
                                        <p className="text-[10px] text-zinc-500 mt-4 font-bold uppercase tracking-widest">Gallery theke upload korun</p>
                                    </div>
                                )}
                                <input 
                                    type="file" accept="image/*" onChange={handleImageUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Right: Text Inputs */}
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Headline</label>
                                <input 
                                    type="text" placeholder="Title for the banner..." 
                                    className="w-full p-5 bg-white dark:bg-zinc-800 rounded-2xl border dark:border-white/5 dark:text-white outline-none focus:border-emerald-500 transition-all font-bold"
                                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Description</label>
                                <textarea 
                                    placeholder="Enter short details..." 
                                    className="w-full p-5 bg-white dark:bg-zinc-800 rounded-2xl border dark:border-white/5 dark:text-white outline-none focus:border-emerald-500 transition-all h-28 font-medium"
                                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                        <button 
                            type="submit" disabled={loading || uploading}
                            className="flex-1 px-10 py-5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 uppercase italic tracking-widest flex items-center justify-center gap-3"
                        >
                            {uploading ? <><FiLoader className="animate-spin" /> Uploading...</> : editingId ? <><FiEdit3 /> Update Banner</> : <><FiPlus /> Publish Banner</>}
                        </button>
                        {editingId && (
                            <button 
                                type="button" onClick={resetForm}
                                className="px-8 py-5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-white font-black rounded-2xl uppercase tracking-widest"
                            >
                                <FiXCircle size={20} />
                            </button>
                        )}
                    </div>
                </form>

                {/* Banner List Grid */}
                <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-emerald-500"></span> Current Active Banners
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banners.map(banner => (
                        <div key={banner._id} className="group bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-white/5 transition-all hover:shadow-2xl">
                            <div className="h-52 relative">
                                <img src={banner.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="banner" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                    <button onClick={() => startEdit(banner)} className="p-4 bg-white rounded-full text-zinc-900 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"><FiEdit3 size={20} /></button>
                                    <button onClick={() => handleDelete(banner._id)} className="p-4 bg-white rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"><FiTrash2 size={20} /></button>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="font-black text-lg dark:text-white uppercase italic truncate tracking-tight">{banner.title}</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{banner.description}</p>
                            </div>
                        </div>
                    ))}
                    {banners.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem]">
                            <p className="text-zinc-400 font-bold uppercase tracking-widest">No Banners Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BannerManagement;