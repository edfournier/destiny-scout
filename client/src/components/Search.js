import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { postWithAuth } from "../utils/services";

// 3. MAKE INVENTORY DISPLAY DISPLAY TRACKED ITEMS TOO IN LAND.

export function Search({ itemDefinitions, setFlag, flag }) {
    const auth = useAuth();
    const [query, setQuery] = useState("");

    const items = Object.values(itemDefinitions);
    const compQuery = query.toLowerCase();
    const filtered = items.filter(
        item => item.displayProperties.name.toLowerCase().includes(compQuery)
    );

    async function handleAddItem(e) {
        e.preventDefault();

        // Check query is the name of some item (may not have auto-filled). 
        const item = filtered.find(item => item.displayProperties.name.toLowerCase() === compQuery);
        if (!item) {
            alert(`"${query}" is an invalid search!`);
        }
        else {
            try {
                // Send query to server here here.
                console.log("User query:", query);
                console.log("Item hash to send:", item.hash);

                await postWithAuth(`http://localhost:3001/users/${auth.user.membershipId}`, {
                    itemHash: item.hash
                });
                
                setFlag(!flag);
                setQuery("");
            }
            catch (error) {
                console.log(error);
                alert("Failed to add item due to server issue.")
            }
        }
    }

    return (
        <form className="search-form">
            <input 
                className="search-box"
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)} 
                placeholder="Search an item..."
             />
            <button onClick={handleAddItem}>Add</button>
            <div className="search-container tile">
                {query === "" ? [] : filtered.slice(0, 19).map(item => <SearchResult key={item.hash} item={item} setQuery={setQuery}/>)}
            </div>
        </form>
    );
}

function SearchResult({ item, setQuery }) {
    function handleClick() {
        setQuery(item.displayProperties.name);
        console.log(item);
    }

    return (
        <div className="search-result tile" onClick={handleClick}>
            <img className="small-item-icon" alt={item.displayProperties.name} src={`https://bungie.net${item.displayProperties.icon}`} />
            {item.displayProperties.name}
        </div>
    );
}