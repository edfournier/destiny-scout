import cayde from "../images/cayde.png";
import { useAuth } from "../auth/AuthProvider";
import { Navigate } from "react-router";

const AUTH_URL = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code`;

export function Login() {
    const auth = useAuth();

    // Check if user is already cached.
    if (auth.user) {
        return <Navigate to={"/landing"} />
    }

    const handleLogin = () => {
        window.location.href = AUTH_URL;
    }

    return (
        <div className="login-container tile">
            <h1>Destiny Scout</h1>
            <img className="cayde" src={cayde} alt="startled Cayde-6" />
            <button className="login-button grow" type="button" onClick={handleLogin}>Login with Bungie.net</button>
        </div>
    );
}