import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { FiTrash2, FiEdit3, FiPlus, FiCheck } from 'react-icons/fi';

const ManageNews = () => {
    const [news, setNews] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editValue, setEditValue] = useState("");
    const [newHeadline, setNewHeadline] = useState("");

    const fetchNews = () => {
        axios.get('http://localhost:5000/news')
            .then(res => setNews(res.data));
    };

    useEffect(() => { fetchNews(); }, []);

    // 1. Add News logic (Same as before)
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newHeadline) return;
        const res = await axios.post('http://localhost:5000/news', { title: newHeadline, date: new Date() });
        if (res.data.insertedId) {
            toast.success("News Added!");
            setNewHeadline("");
            fetchNews();
        }
    };

    // 2. 🔥 Delete News with SweetAlert2 Animation
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This headline will be removed from the live ticker!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48', // rose-600
            cancelButtonColor: '#475569', // slate-600
            confirmButtonText: 'Yes, delete it!',
            background: '#fff',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl font-black uppercase text-xs tracking-widest px-6 py-3',
                cancelButton: 'rounded-xl font-black uppercase text-xs tracking-widest px-6 py-3'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`http://localhost:5000/news/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'News has been removed.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false,
                            customClass: {
                                popup: 'rounded-[2rem]'
                            }
                        });
                        fetchNews();
                    }
                } catch (error) {
                    toast.error("Failed to delete");
                }
            }
        });
    };

    // 3. Update News (Same as before)
    const handleUpdate = async (id) => {
        const res = await axios.patch(`http://localhost:5000/news/${id}`, { title: editValue });
        if (res.data.modifiedCount > 0) {
            toast.success("News Updated");
            setIsEditing(null);
            fetchNews();
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-black italic uppercase mb-8">Manage <span className="text-rose-600">News Feed</span></h2>

            {/* Quick Add Section */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-10 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <input 
                    type="text" 
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    placeholder="Type new headline here..." 
                    className="flex-1 px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 ring-emerald-500 font-bold"
                />
                <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 hover:bg-emerald-700 transition-all">
                    <FiPlus /> Add News
                </button>
            </form>

            {/* News List Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                        <tr>
                            <th className="p-6">Headline</th>
                            <th className="p-6">Published At</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {news.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-6">
                                    {isEditing === item._id ? (
                                        <input 
                                            autoFocus
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-full bg-white border border-emerald-500 px-3 py-2 rounded-lg font-bold outline-none"
                                        />
                                    ) : (
                                        <span className="font-bold text-slate-700 leading-snug block max-w-md">
                                            {item.title}
                                        </span>
                                    )}
                                </td>
                                <td className="p-6 text-xs text-slate-400 font-medium whitespace-nowrap">
                                    {new Date(item.date).toLocaleDateString()}
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        {isEditing === item._id ? (
                                            <button onClick={() => handleUpdate(item._id)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-all">
                                                <FiCheck size={18} />
                                            </button>
                                        ) : (
                                            <button onClick={() => { setIsEditing(item._id); setEditValue(item.title); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
                                                <FiEdit3 size={18} />
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-all">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {news.length === 0 && (
                    <div className="p-10 text-center text-slate-400 font-bold italic">
                        No breaking news active right now.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageNews;