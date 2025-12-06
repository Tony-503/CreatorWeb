import { Navigate } from "react-router-dom";   
import supabase from "../Client.js";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        supabase.auth.getSession().then(({ data }) => {
            setIsAuthenticated(data.session);
            setLoading(false);
        });
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }
    return children;
};

export default ProtectedRoute;