import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { AuthContext } from '../Firebase/AuthProvider';
import SocialLogin from './SocialLogin';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ShoppingBag, Lock, Mail } from 'lucide-react';

const Login = () => {
  const { userLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);

  const handelLogin = e => {
    e.preventDefault();
    const email = e.target.email.value;
    const pass = e.target.password.value;

    userLogin(email, pass)
      .then(() => {
        toast.success("Welcome back to SmartStore!", { duration: 3000 });
        navigate(from, { replace: true });
      })
      .catch(error => {
        toast.error("Invalid credentials. Please try again.", { duration: 4000 });
        console.error(error);
      });
  };

  return (
    <div className="min-h-screen w-full -mt-24 pt-46 -mb-24 pb-66 flex items-center justify-center bg-[#f8fafc] dark:bg-zinc-950 px-4 py-20 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none mb-4">
            <ShoppingBag className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Log in to access your orders and wishlist.</p>
        </div>

        {/* login section */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm">
          <form onSubmit={handelLogin} className="space-y-5">
            
            {/* email input */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" name="email" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                  placeholder="name@example.com"/>
              </div>
            </div>

            {/* password input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <a className="text-xs font-bold text-indigo-600 hover:text-indigo-500 cursor-pointer">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type={showPassword ? 'text' : 'password'} name="password" required
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-800 dark:text-white placeholder:text-slate-400"
                  placeholder="••••••••"/>

                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {/* sign in button */}
            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] mt-2">
              Sign In
            </button>

            {/* divider */}
            <div className="relative flex items-center gap-4 my-6">
              <div className="h-[1px] w-full bg-slate-100 dark:bg-zinc-800"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Or continue with</span>
              <div className="h-[1px] w-full bg-slate-100 dark:bg-zinc-800"></div>
            </div>

            {/* social login */}
            <SocialLogin from={from} />

            {/* footer section */}
            <div className="text-center mt-8">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">New to SmartStore?{" "}
                <Link to="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4 transition-all">Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;