import { fetchWithKey } from "./services";

export class Database {
    constructor() {
        this.db = null;
    }

    async build() {
        return new Promise((resolve, reject) => {
            const dbRequest = indexedDB.open("destiny-scout", 1);

            dbRequest.onupgradeneeded = (event) => {
                event.target.result.createObjectStore("manifest");
                sessionStorage.removeItem("item-definition-path"); 
            }
    
            dbRequest.onsuccess = async () => {
                this.db = dbRequest.result;

                const localPath = sessionStorage.getItem("item-definition-path");
                const manifest = await fetchWithKey("https://www.bungie.net/Platform/Destiny2/Manifest/");
                const newestPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition;

                // Check db is present and up to date. 
                if (localPath === newestPath) {
                    return resolve(this);
                }

                sessionStorage.setItem("item-definition-path", newestPath); 

                // Fetch definitions and filter object entries by item type: 2 (armor), 3 (weapons), 19 (mod/shader).
                const itemDefinitions = await fetch(`https://www.bungie.net${newestPath}`).then(response => response.json());
                const accepted = [2, 3, 19];
                const filtered = Object.fromEntries(Object.entries(itemDefinitions).filter(([key, value]) => accepted.includes(value.itemType) && value.itemSubType !== 0));

                // Store item definitions in IDB. 
                const store = this.db.transaction("manifest", "readwrite").objectStore("manifest");
                const putRequest = store.put(filtered, "item-definitions");

                putRequest.onsuccess = () => {
                    resolve(this);
                }

                putRequest.onerror = (event) => {
                    reject(event);
                }
            }

            dbRequest.onerror = (event) => {
                reject(event);
            }
        });
    }

    async getItems() {
        return new Promise((resolve, reject) => {
            // Retrieve item definitions from IDB.
            const store = this.db.transaction("manifest", "readonly").objectStore("manifest");
            const getRequest = store.get("item-definitions");

            getRequest.onsuccess = () => {
                resolve(getRequest.result);
            }
            
            getRequest.onerror = (event) => {
                reject(event);
            }
        });
    }
}