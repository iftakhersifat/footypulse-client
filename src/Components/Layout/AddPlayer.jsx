import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { 
    FiUser, FiAward, FiUploadCloud, FiPlusCircle, FiCheckCircle, 
    FiLoader, FiShield, FiMapPin, FiCalendar, FiRotateCcw, FiEdit3, FiTrash2, FiX 
} from 'react-icons/fi';

const AddPlayer = () => {
    const [players, setPlayers] = useState([]);
    const [formData, setFormData] = useState({
        name: '', position: '', club: '', nationality: '', 
        image: '', goals: 0, assists: 0, age: '', previousClub: ''
    });
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // SweetAlert Toast configuration
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    const fetchPlayers = async () => {
        const res = await axios.get('http://localhost:5000/players');
        setPlayers(res.data);
    };

    useEffect(() => { fetchPlayers(); }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const imgFormData = new FormData();
        imgFormData.append('image', file);
        try {
            const apiKey = import.meta.env.VITE_IMAGE_HOSTING_KEY; 
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, imgFormData);
            setFormData({ ...formData, image: res.data.data.display_url });
            setUploading(false);
            Toast.fire({ icon: 'success', title: 'Image uploaded successfully' });
        } catch (err) {
            setUploading(false);
            Swal.fire('Error!', 'Image upload failed', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.image) return Swal.fire('Wait!', 'Please upload an image first', 'warning');
        
        try {
            if (editingId) {
                await axios.patch(`http://localhost:5000/players/${editingId}`, formData);
                Toast.fire({ icon: 'success', title: 'Player updated successfully!' });
            } else {
                await axios.post('http://localhost:5000/players', formData);
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#ffffff'] });
                Toast.fire({ icon: 'success', title: 'Player added to squad!' });
            }
            resetForm();
            fetchPlayers();
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setFormData({ name: '', position: '', club: '', nationality: '', image: '', goals: 0, assists: 0, age: '', previousClub: '' });
        setEditingId(null);
    };

    const handleEdit = (player) => {
        setEditingId(player._id);
        setFormData(player);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- SweetAlert Delete Logic ---
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it!',
            background: '#fff',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl font-bold px-6 py-3',
                cancelButton: 'rounded-xl font-bold px-6 py-3'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5000/players/${id}`);
                    fetchPlayers();
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Player has been removed.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire('Failed!', 'Something went wrong.', 'error');
                }
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
            {/* ... Form Section (Same as before) ... */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-500/5">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        {editingId ? 'Edit' : 'Register'} <span className="text-emerald-500">Player</span>
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="text-red-500 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                            <FiX /> Cancel Edit
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className={`relative h-48 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${formData.image ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50'}`}>
                        {formData.image ? (
                            <img src={formData.image} className="h-full w-full object-contain p-4" alt="Player" />
                        ) : (
                            <div className="text-center">
                                <FiUploadCloud className="mx-auto text-slate-300 mb-2" size={30} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to Upload Portrait</p>
                            </div>
                        )}
                        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { label: 'Name', name: 'name', icon: <FiUser /> },
                            { label: 'Age', name: 'age', icon: <FiCalendar />, type: 'number' },
                            { label: 'Position', name: 'position', icon: <FiAward /> },
                            { label: 'Current Club', name: 'club', icon: <FiShield /> },
                            { label: 'Previous Club', name: 'previousClub', icon: <FiRotateCcw /> },
                            { label: 'Nationality', name: 'nationality', icon: <FiMapPin /> },
                        ].map((f) => (
                            <div key={f.name}>
                                <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block ml-1">{f.label}</label>
                                <div className="flex items-center bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3">
                                    <span className="text-emerald-500 mr-3">{f.icon}</span>
                                    <input 
                                        type={f.type || 'text'}
                                        value={formData[f.name]}
                                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                                        className="bg-transparent w-full outline-none text-sm font-bold text-slate-800 dark:text-white"
                                        placeholder={f.label}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6 border-t border-slate-100 dark:border-zinc-800 pt-6">
                        {['goals', 'assists'].map(s => (
                            <div key={s}>
                                <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block text-center">{s}</label>
                                <input 
                                    type="number" value={formData[s]}
                                    onChange={(e) => setFormData({...formData, [s]: e.target.value})}
                                    className="w-full bg-slate-50 dark:bg-zinc-900 rounded-xl py-3 text-center font-black text-slate-900 dark:text-white"
                                />
                            </div>
                        ))}
                    </div>

                    <button disabled={uploading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-2">
                        {uploading ? <FiLoader className="animate-spin" /> : <><FiPlusCircle /> {editingId ? 'Update Player' : 'Confirm Registration'}</>}
                    </button>
                </form>
            </div>

            {/* List Table Section */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-zinc-900/50 border-b border-slate-100 dark:border-zinc-800">
                        <tr>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Player</th>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest hidden md:table-cell">Details</th>
                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-zinc-900">
                        {players.map(player => (
                            <tr key={player._id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                                <td className="p-5 flex items-center gap-4">
                                    <img src={player.image} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/10" />
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white uppercase text-sm italic">{player.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{player.position} • {player.club}</p>
                                    </div>
                                </td>
                                <td className="p-5 hidden md:table-cell">
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase">Goals: {player.goals} | Assists: {player.assists}</p>
                                </td>
                                <td className="p-5 text-right space-x-2">
                                    <button onClick={() => handleEdit(player)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"><FiEdit3 size={18} /></button>
                                    <button onClick={() => handleDelete(player._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><FiTrash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AddPlayer;