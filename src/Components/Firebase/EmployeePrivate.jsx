import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate } from "react-router";
import axios from "axios";

const EmployeePrivate = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [dbUser, setDbUser] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (user?.email) {
                try {
                    const res = await axios.get(`http://localhost:5000/users/${user.email}`);
                    setDbUser(res.data);
                } catch (error) {
                    console.error("Error fetching role:", error);
                } finally {
                    setRoleLoading(false);
                }
            } else if (!loading) {
                setRoleLoading(false);
            }
        };
        fetchRole();
    }, [user, loading]);

    if (loading || roleLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-indigo-600"></span>
            </div>
        );
    }
    if (!user) return <Navigate to="/login" replace />;

    const currentRole = dbUser?.role;
    if (currentRole === "admin" || currentRole === "employee") {
        return children;
    }

    return <Navigate to="/" replace />;
};

export default EmployeePrivate;