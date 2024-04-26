import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));   // Null if no user
    const navigate = useNavigate();

    function logout() {
        // Nuke caches and send to login screen
        setUser(null);
        sessionStorage.clear();
        return navigate("/");
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/*
 * Hook allowing consumers to access context.
 */ 
export function useAuth() {
    return useContext(AuthContext);
}
