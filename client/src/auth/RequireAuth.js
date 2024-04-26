import { Navigate } from "react-router";
import { useAuth } from "./AuthProvider";

/*
 * Used to protect private routes. Redirect unauthorized users. 
 */ 
export function RequireAuth({ children }) {
    const auth = useAuth();
    if (!auth.user) {
        console.log("No authorized user found.");
        return <Navigate to="/" />;
    }
    return children;
}