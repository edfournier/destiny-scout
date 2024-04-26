/*
 * Fetch wrapper for making authorized request to the Bungie.net API. 
 */

export async function fetchWithAuth(url, body) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-API-KEY": process.env.REACT_APP_API_KEY
        }
    });
    return response.json();
}

export async function fetchWithKey(url) {
    const response = await fetch(url, {
        headers: {
            "X-API-KEY": process.env.REACT_APP_API_KEY,
        }
    });
    return response.json();
}

export async function postWithAuth(url, body) {
    const token = sessionStorage.getItem("token");
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });
    return response;
}