import { Navigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import axios from "axios";

const AdminPrivate = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, setIsAdmin] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (user?.email) {
                try {
                    const res = await axios.get(`http://localhost:5000/users/${user.email}`);
                    if (res.data?.role === "admin") {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Role Check Error:", error);
                    setIsAdmin(false);
                } finally {
                    setRoleLoading(false);
                }
            } else if (!loading) {
                setRoleLoading(false);
            }
        };

        checkAdmin();
    }, [user, loading]);

    if (loading || roleLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-bars loading-lg text-indigo-600"></span>
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;

    if (isAdmin !== true) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-50 dark:bg-red-500/10 p-10 rounded-[2.5rem] border border-red-100 dark:border-red-500/20 max-w-md">
                    <h2 className="text-3xl font-black text-red-600 mb-4">Access Denied</h2>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                        Sorry! This area is restricted to administrators only.
                    </p>
                    <button 
                        onClick={() => window.history.back()}
                        className="mt-8 px-8 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminPrivate;