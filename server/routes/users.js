import express from "express";
import User from "../models/User.js";
import cors from "cors";

const router = express.Router();

async function getIdFromAuth(auth) {
    const membership = await fetch("https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/", {
        headers: {
            "X-API-KEY": process.env.API_KEY,
            "Authorization": auth
        }
    }).then(response => response.json());
    return membership.Response.primaryMembershipId;
}

router.get("/:membershipId", async (request, response, next) => {
    try {
        const user = await User.findById(request.params.membershipId);
        return user ? response.status(200).json(user) : response.sendStatus(404);
    }
    catch (error) {
        next(error);
    }
});

// TODO: Need to validate itemHash
router.post("/:membershipId", async (request, response, next) => {
    try {
        if (!request.headers.authorization || !request.body.itemHash) {
            return response.status(400).json({ error: "Missing token or itemHash in request body." });
        }

        const id = await getIdFromAuth(request.headers.authorization);
        if (id !== request.params.membershipId) {
            return response.status(401).json({ error: "User not authorized." });
        }

        // Save itemHash to user's document in database
        let user = await User.findById(request.params.membershipId);
        if (!user) {
            user = new User({
                _id: request.params.membershipId,
                trackedItems: []
            });
        }
        await user.addItem(request.body.itemHash);

        return response.sendStatus(200);
    } 
    catch (error) {
        next(error);
    }
});

router.delete("/:membershipId", async (request, response, next) => {
    try {
        if (!request.headers.authorization || !request.body.itemHash) {
            return response.status(400).json({ error: "Missing token or itemHash in request body." });
        }

        const id = await getIdFromAuth(request.headers.authorization);
        if (id !== request.params.membershipId) {
            return response.sendStatus(401);
        }

        const user = await User.findById(request.params.membershipId);
        if (!user) {
            return response.sendStatus(404);
        }
        await user.removeItem(request.body.itemHash);

        return response.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
});

export default router;
