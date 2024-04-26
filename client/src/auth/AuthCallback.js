import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/services";

/*
 * Redirected to from Bungie's auth portal. 
 * Uses auth code attached to search params to generate and cache a token, Destiny membership ID, and character ID.
 * Redirects to landing page on success. 
 */ 
export function AuthCallback() {
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const auth = useAuth();

    useEffect(() => {
        async function getUser() {
            try {
                if (!sessionStorage.hasOwnProperty("user")) {
                    const authCode = window.location.search.substring(6);
                    const response = await fetch("https://www.bungie.net/Platform/App/OAuth/token/", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: `client_id=${process.env.REACT_APP_CLIENT_ID}&code=${authCode}&grant_type=authorization_code`
                    });
                    const json = await response.json();
                    sessionStorage.setItem("token", json.access_token);
                
                    // Get Destiny profiles linked to Bungie ID. 
                    const profiles = await fetchWithAuth(`https://www.bungie.net/Platform/Destiny2/254/Profile/${json.membership_id}/LinkedProfiles/`);
                    console.log(profiles.Response);
                    const { bungieGlobalDisplayName, membershipId, membershipType } = profiles.Response.profiles[0];
                
                    // Get character ID.
                    const profile = await fetchWithAuth(`https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`);
                    const characterId = Object.keys(profile.Response.characters.data)[0]; 
                
                    // Cache user, reset auth.user (from null), and remove auth code from URL.  
                    sessionStorage.setItem("user", JSON.stringify({ membershipId, membershipType, characterId, name: bungieGlobalDisplayName }));

                    console.log();
                    auth.setUser(JSON.parse(sessionStorage.getItem("user")));
                }
                setLoading(false);
            }
            catch (error) {
                console.log("Error occurred while getting user:", error);
                setFailed(true);
            }
        }
        getUser();
    }, [auth]);

    if (failed) {
        return <Navigate to="/" />;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return <Navigate to="/landing" />;
}