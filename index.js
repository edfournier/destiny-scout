const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());  
app.use(express.static("build"));  

// Get a user's tracked items.
app.get("/users/:membershipId", (request, response) => {
    response.json({ id: request.params.membershipId });
});

// Add new item to user's tracked items. 
app.post("/users/:membershipId", async (request, response) => {
    const body = request.body;

    if (!body.token || !body.membershipId || !body.itemHash) {
        response.status(400).json({ error: "Missing token, membershipId, or itemHash." });
        return;
    }

    try {
        // Get current user from Bungie.net, and compare IDs. 
        const response = await fetch("https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/", {
            headers: {
                "X-API-KEY": process.env.API_KEY,
                "Authorization": `Bearer ${body.token}`
            }
        });
        const user = await response.json();
        
        if (user.bungieNetUser.membershipId !== request.params.membershipId) {
            throw new Error("Given membershipId and token membershipId do not match.");
        }

        // Need to check if itemHash is valid from item endpoint. 

        // Add data to database. 
    }
    catch (error) {
        console.log(error);
        response.status(400).json({ error: "Bad token, membershipId, or itemHash." });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
