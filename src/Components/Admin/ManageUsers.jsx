import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaUserShield, FaUserTie, FaSearch, FaFilter, FaSync, FaTrashAlt, FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../Firebase/AuthProvider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

const ManageUsers = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = users;
        if (searchTerm) {
            result = result.filter(u => 
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                u.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterRole !== "all") {
            result = result.filter(u => (u.role || 'user') === filterRole);
        }
        setFilteredUsers(result);
    }, [searchTerm, filterRole, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/users");
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (mongoId, firebaseUid, newRole, targetEmail) => {
        if (currentUser?.email === targetEmail) {
            return Swal.fire({
                title: "Action Restricted",
                text: "You cannot modify your own administrative role.",
                icon: "warning",
                confirmButtonColor: '#6366F1'
            });
        }

        const confirm = await Swal.fire({
            title: `Promote to ${newRole.toUpperCase()}?`,
            text: `This will change permissions for ${targetEmail}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Confirm",
            confirmButtonColor: "#6366F1",
            cancelButtonColor: "#94A3B8",
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axios.patch(`http://localhost:5000/users/role/${mongoId}`, { role: newRole });
                if (res.data.modifiedCount > 0) {
                    if (firebaseUid) {
                        await updateDoc(doc(db, "users", firebaseUid), { role: newRole });
                    }
                    setUsers(users.map(u => u._id === mongoId ? { ...u, role: newRole } : u));
                    Swal.fire("Success", "Role updated successfully!", "success");
                }
            } catch (err) {
                Swal.fire("Error", "Server synchronization failed.", "error");
            }
        }
    };

    const handleDeleteUser = async (id, email) => {
        if (currentUser?.email === email) {
            return Swal.fire("Error", "Self-deletion is not permitted!", "error");
        }

        const result = await Swal.fire({
            title: "Permanent Removal?",
            text: "User data cannot be recovered after deletion.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            confirmButtonText: "Delete Now",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost:5000/users/${id}`);
                if (res.data.deletedCount > 0) {
                    setUsers(users.filter(u => u._id !== id));
                    Swal.fire("Deleted", "Member removed from organization.", "success");
                }
            } catch (error) {
                Swal.fire("Error", "Failed to delete user.", "error");
            }
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 transition-all duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Administrative Suite</span>
                        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Users</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-slate-400 text-sm font-medium">System Status</p>
                            <p className="text-green-500 text-sm font-bold flex items-center justify-end gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live Database
                            </p>
                        </div>
                        <button onClick={fetchUsers} className="p-4 bg-white dark:bg-slate-900 text-indigo-600 rounded-2xl shadow-xl shadow-indigo-100/20 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:rotate-180 transition-all duration-700 active:scale-90">
                            <FaSync className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="md:col-span-2 relative group">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Find member by name or email..." 
                            className="w-full h-16 pl-14 pr-6 bg-white dark:bg-slate-900 border-none rounded-[1.25rem] text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <div className="md:col-span-1 relative">
                        <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                            className="w-full h-16 pl-14 pr-6 bg-white dark:bg-slate-900 border-none rounded-[1.25rem] text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer outline-none"
                            onChange={(e) => setFilterRole(e.target.value)}>
                            <option value="all">All Memberships</option>
                            <option value="admin">Administrators</option>
                            <option value="employee">Employees</option>
                            <option value="user">Standard Users</option>
                        </select>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1.25rem] p-2 flex items-center justify-between text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                        <div className="pl-2">
                            <p className="text-xs font-bold opacity-80 uppercase tracking-tighter">Database</p>
                            <p className="text-2xl font-black">{users.length}</p>
                        </div>
                        <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                            <FaUserShield size={22} />
                        </div>
                    </div>
                </div>

                {/* Users */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-slate-400 font-bold tracking-widest uppercase text-xs">Decrypting Records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
                                        <th className="py-7 px-10">Identity & Contact</th>
                                        <th className="py-7">Access Rights</th>
                                        <th className="py-7 text-center">Security Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-indigo-50/30 dark:hover:bg-slate-800/40 transition-all duration-300 group">
                                            <td className="py-6 px-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        {user.photo ? (
                                                            <img 
                                                                src={user.photo} 
                                                                alt={user.name} 
                                                                className="h-14 w-14 rounded-[1.1rem] object-cover ring-4 ring-white dark:ring-slate-800 shadow-md group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="h-14 w-14 rounded-[1.1rem] bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white dark:ring-slate-800 group-hover:scale-105 transition-all">
                                                                {user.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                       
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 dark:text-slate-100 text-lg group-hover:text-indigo-600 transition-colors">{user.name}</div>
                                                        <div className="text-sm text-slate-400 dark:text-slate-500 font-medium">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td>
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest
                                                    ${user.role === 'admin' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600' : 
                                                      user.role === 'employee' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600' : 
                                                      'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-rose-500' : user.role === 'employee' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                                                    {user.role || 'Member'}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="flex justify-center items-center gap-4">
                                                    <button 
                                                        onClick={() => handleRoleUpdate(user._id, user.uid, 'admin', user.email)}
                                                        className={`h-11 w-11 flex items-center justify-center rounded-xl transition-all ${user.role === 'admin' ? 'opacity-20 cursor-not-allowed text-slate-300' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white shadow-sm hover:-translate-y-1'}`}
                                                        title="Promote to Admin">
                                                        <FaUserShield size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRoleUpdate(user._id, user.uid, 'employee', user.email)}
                                                        className={`h-11 w-11 flex items-center justify-center rounded-xl transition-all ${user.role === 'employee' ? 'opacity-20 cursor-not-allowed text-slate-300' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white shadow-sm hover:-translate-y-1'}`}
                                                        title="Assign to Employee">
                                                        <FaUserTie size={18} />
                                                    </button>
                                                    <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800 mx-1"></div>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user._id, user.email)}
                                                        className="h-11 w-11 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:bg-red-600 hover:text-white rounded-xl transition-all hover:shadow-lg hover:shadow-red-200 dark:hover:shadow-none hover:-translate-y-1"
                                                        title="Revoke Access">
                                                        <FaTrashAlt size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;