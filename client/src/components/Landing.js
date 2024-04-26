import { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/services";
import { Database } from "../utils/Database";
import { getVendorName } from "../utils/vendors";
import { useAuth } from "../auth/AuthProvider";
import { Search } from "./Search";
import { Inventory } from "./Inventory";
import { Logout } from "./Logout";
import { Notify } from "./Notify";


// 1. MAKE A TRANSLATE FUNCTION, THAT GOES FROM ITEM HASHES TO ITEM DEFINITIONS? THE TWO GET FUNCTIONS JUST GET HASHES, THEN ONE FUNCTION CONVERTS.
// 2. Add footer (across all pages) to contain GitHub/credits.
// 3. FIX INVENTORIES FLAG PROBLEM: ADDING NEW ITEM REFREHSES ENTIRE PAGE.
// 4. FIX TOKEN EXPIRATION ISSUE. KICK AFTER 1 HOUR OR LEAVING PAGE.

async function getVendorInventories(user, itemDefinitions) {
    // Xûr, Banshee-44, Ada-1.
    const vendorHashes = ["2190858386", "672118013", "350061650"];
    return Promise.all(vendorHashes.map(async (vendorHash) => {
        const inventory = { 
            label: getVendorName(vendorHash), 
            items: [] 
        };
        const json = await fetchWithAuth(`https://www.bungie.net/Platform/Destiny2/${user.membershipType}/Profile/${user.membershipId}/Character/${user.characterId}/Vendors/${vendorHash}/?components=402`);
        if (!json.Response) {
            return inventory;
        }
        const sales = Object.values(json.Response.sales.data);
        inventory.items = sales
            .map(sale => itemDefinitions[sale.itemHash])
            .filter(item => item !== undefined);
        return inventory;
    }));
}

async function getTrackedItems(user, itemDefinitions) {
    const items = await fetch(`http://localhost:3001/users/${user.membershipId}`).then(response => response.json());
    const defs = items.trackedItems.map(item => itemDefinitions[item]);
    return { label: "Tracked Items", items: defs };
}

export function Landing() {
    const auth = useAuth();
    const [itemDefinitions, setItemDefinitions] = useState(null);
    const [inventories, setInventories] = useState(null);          
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        async function load() {
            // Token expires after 1 hour.
            setTimeout(() => {
                alert("Please reauthenticate with Bungie.net.");
                auth.logout();
            }, 3600000);

            const db = await new Database().build();
            const itemDefinitions = await db.getItems();
            const inventories = await Promise.all([
                getVendorInventories(auth.user, itemDefinitions), 
                getTrackedItems(auth.user, itemDefinitions),
            ]);

            console.log(inventories);

            setItemDefinitions(itemDefinitions);
            setInventories(inventories.flat());
        }
        load();
    }, [auth, flag]);   

    if (!inventories) {
        return <p>Loading...</p>
    }

    return (
        <>
            <div className="nav">
                <div>Hello {auth.user.name}!</div>
                <div>
                    <Notify />
                    <Logout />
                </div>
            </div>
            <div className="home-view">
                <div className="inventories">
                    {inventories.map(inventory => <Inventory key={inventory.label} inventory={inventory} />)}
                </div>
                <Search itemDefinitions={itemDefinitions} setFlag={setFlag} flag={flag} />
            </div>
        </>
    );
}