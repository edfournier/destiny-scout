import { useAuth } from "../auth/AuthProvider";

export function Logout() {
    const auth = useAuth();

    return (
        <button onClick={auth.logout}>Logout</button>
    );
}