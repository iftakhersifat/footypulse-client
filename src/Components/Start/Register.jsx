import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../Firebase/AuthProvider';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SocialRegister from './SocialRegister';
import axios from 'axios';
import { User, Mail, Lock, Upload, ShoppingBag, Loader2 } from 'lucide-react';

const IMGBB_API_KEY = import.meta.env.VITE_IMAGE_HOSTING_KEY;

const Register = () => {
    const { createUser, UpdateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state || "/";

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;


        setPhotoPreview(URL.createObjectURL(file));
        setUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData);
            if (res.data.success) {
                setPhotoUrl(res.data.data.display_url);
                toast.success("Image uploaded successfully!");
            }
        } catch (err) {
            toast.error("Image upload failed. Try again.");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handelRegister = e => {
        e.preventDefault();
        setError('');
        
        const name = e.target.name.value;
        const email = e.target.email.value;
        const pass = e.target.password.value;

        if (!photoUrl) {
            toast.error("Please upload a profile photo first.");
            return;
        }

        if (!passwordRegex.test(pass)) {
            setError("Password must be 8+ characters with uppercase & lowercase.");
            return;
        }

        createUser(email, pass).then(result => {
            const newUser = { name, email, photo: photoUrl, role: 'user' };
            
            axios.post('https://smart-ecommerce-server.vercel.app/users', newUser)
                .then(res => console.log('User saved to MongoDB:', res.data))
                .catch(err => console.error('Error saving user:', err));

            UpdateUser({ displayName: name, photoURL: photoUrl })
                .then(() => {
                    toast.success("Welcome to SmartStore!", { duration: 3000 });
                    navigate(from);
                })
                .catch(err => console.error("Profile update failed:", err));
        }).catch(error => {
            toast.error(error.message || "Failed to Register");
        });
    }

    return (
        <div className="min-h-screen -mt-24 pt-46 -mb-24 pb-66 w-full flex items-center justify-center bg-[#f8fafc] dark:bg-zinc-950 px-4 py-20 relative overflow-hidden">
            <div className="absolute top-[-5%] right-[-5%] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="max-w-xl w-full z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none mb-4">
                        <ShoppingBag className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create Your Account</h1>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                    <form onSubmit={handelRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* name input */}
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" name="name" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-800 dark:text-white text-sm" placeholder="Your Name" required />
                            </div>
                        </div>

                        {/* email input */}
                        <div className="space-y-2 md:col-span-1">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="email" name='email' className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-800 dark:text-white text-sm" placeholder="email@example.com" required />
                            </div>
                        </div>

                        {/* ImgBB upload section */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Profile Photo</label>
                            <div className="relative">
                                <label className="flex items-center justify-between w-full px-4 py-4 bg-slate-50 dark:bg-zinc-800 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-2xl cursor-pointer hover:border-indigo-500 transition-all">
                                    <div className="flex items-center gap-3">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="preview" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" />
                                        ) : (
                                            <div className="p-2 bg-white dark:bg-zinc-700 rounded-full">
                                                <Upload size={18} className="text-slate-400" />
                                            </div>
                                        )}
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {uploading ? "Uploading..." : "Click to upload image"}
                                        </span>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    {uploading && <Loader2 className="animate-spin text-indigo-600" size={20} />}
                                </label>
                            </div>
                        </div>

                        {/* password input */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type={showPassword ? 'text' : 'password'} name='password' className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-800 dark:text-white text-sm" placeholder="••••••••" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            {error && <p className="text-rose-500 text-[11px] font-bold mt-1 ml-1">{error}</p>}
                        </div>

                        <div className="md:col-span-2 mt-2">
                            <button 
                                disabled={uploading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                                {uploading ? "Uploading Image..." : "Create Account"}
                            </button>
                        </div>

                        <div className="md:col-span-2 text-center">
                            <div className="relative flex items-center gap-4 my-4">
                                <div className="h-[1px] w-full bg-slate-100 dark:bg-zinc-800"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Or join with</span>
                                <div className="h-[1px] w-full bg-slate-100 dark:border-zinc-800"></div>
                            </div>
                            <SocialRegister from={from} />
                            <p className="text-sm font-medium text-slate-500 mt-6">
                                Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Login here</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;