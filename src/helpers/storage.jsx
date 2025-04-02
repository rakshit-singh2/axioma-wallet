import { openDB } from 'idb';

// Local Storage
export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};

export const getLocalStorage = (key) => {
    return localStorage.getItem(key);
};

export const clearLocalStorage = () => {
    localStorage.clear();
};

// Save data with a timestamp
export const setTemporaryLocalStorage = (key, value, expireInHours) => {
    const timestamp = Date.now() + expireInHours * 60 * 60 * 1000;
    localStorage.setItem(key, JSON.stringify({ value, timestamp }));
}

// Retrieve data considering expiration
export const getTemporaryLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    if (item) {
        const { value, timestamp } = JSON.parse(item);
        if (Date.now() < timestamp) {
            return value; // Data is still valid
        } else {
            localStorage.removeItem(key); // Data has expired
        }
    }
    return null; // No data or expired
}

// Delete data from localStorage by key
export const deleteLocalStorageItem = (key) => {
    localStorage.removeItem(key);
}

// Session Storage
export const setSessionStorage = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
};

export const getSessionStorage = (key) => {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

// IndexedDB
const dbName = 'cryptoWallet';
const dbVersion = 1;
const walletData = 'walletData';
const chainData = 'chainData';
const userData = 'userData';

export const walletDataColumnNames = ['name', 'connectedSites', 'address', 'transactions', 'tokens', 'Nfts', 'walletKey', 'pinned', 'imported'];

const dbPromise = openDB(dbName, dbVersion, {
    upgrade(db) {
        // Create walletData object store
        if (!db.objectStoreNames.contains(walletData)) {
            const store = db.createObjectStore(walletData, { keyPath: 'address' });
            store.createIndex('name', 'name', { unique: false });
            store.createIndex('connectedSites', 'connectedSites', { multiEntry: true });
            store.createIndex('transactions', 'transactions', { multiEntry: true });
            store.createIndex('tokens', 'tokens', { multiEntry: true });
            store.createIndex('Nfts', 'Nfts', { multiEntry: true });
            store.createIndex('walletKey', 'walletKey', { unique: true });
            store.createIndex('pinned', 'pinned', { unique: true });
            store.createIndex('imported', 'imported', { unique: true });
        }

        // Create chainData object store
        if (!db.objectStoreNames.contains(chainData)) {
            const store = db.createObjectStore(chainData, { keyPath: 'hex' });
            store.createIndex('name', 'name', { unique: true });
            store.createIndex('ticker', 'ticker', { unique: false });
            store.createIndex('rpcUrl', 'rpcUrl', { unique: false });
            store.createIndex('blockExplorerUrl', 'blockExplorerUrl', { unique: false });
            store.createIndex('userAdded', 'userAdded', { unique: false }); 
        }

        // Create userData object store
        if (!db.objectStoreNames.contains(userData)) {
            const store = db.createObjectStore(userData, { keyPath: 'userId' });
            store.createIndex('lastChain', 'lastChain', { unique: false });
            store.createIndex('password', 'password', { unique: false });
            store.createIndex('childCount', 'childCount', { unique: false });
        }
    },
});

//do not change only single user
const userId = "KuchBhi"

// Function to set data in IndexedDB
export const userDataSetField = async (field, value) => {
    try {
        const db = await dbPromise;
        const transaction = db.transaction(userData, 'readwrite');
        const store = transaction.objectStore(userData);
        const request = await store.get(userId);
        let user = request ? request : { userId };;
        user[field] = value;
        const updateRequest = store.put(user);

        updateRequest.onerror = () => {
            console.error('Error updating data:', updateRequest.error);
        };

    } catch (error) {
        console.error('Error accessing database:', error);
    }
};


export const setLastChain = (value) => {
    userDataSetField('lastChain', value);
};

export const setPass= (value) => {
    userDataSetField('password', value);
};

export const setChildCount = (value) => {
    userDataSetField('childCount', value);
};

// Function to get data from IndexedDB
export const userDataGetField = async (field) => {
    try {
        const db = await dbPromise;
        const transaction = db.transaction(userData, 'readonly');
        const store = transaction.objectStore(userData);
        const request = await store.get(userId);
        if (request) {
            return request[field]
        } else {
            return null;
        }

    } catch (error) {
        console.error('Error accessing database:', error);
    }
};

export const getLastChain = () => {
    return userDataGetField('lastChain');
};

export const getPass = () => {
    return userDataGetField('password');
};

export const getChildCount = () => {
    return userDataGetField('childCount');
};

export const addChain = async (hex, name, ticker, rpcUrl, blockExplorerUrl, userAdded) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(chainData, 'readwrite');
        const store = tx.objectStore(chainData);
        const existingChain = await store.get(hex);
        if (existingChain) {
            throw new Error(`Chain with ID ${hex} already exists`);
        }
        await store.put({ hex, name, ticker, rpcUrl, blockExplorerUrl, userAdded });
        await tx.done;
    } catch (error) {
        console.error('Error adding chain in IndexedDB:', error);
        throw error;
    }
};

export const editChain = async (hex, name, ticker, blockExplorerUrl) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(chainData, 'readwrite');
        const store = tx.objectStore(chainData);

        const data = await store.get(hex);

        if (!data) {
            throw new Error(`No chain found for ID ${hex}`);
        }

        const newData = {
            hex,
            name,
            ticker,
            rpcUrl: data.rpcUrl,
            blockExplorerUrl,
            userAdded: data.userAdded
        };

        await store.put(newData);
        await tx.done;
    } catch (error) {
        console.error('Error editing chain in IndexedDB:', error);
        throw error;
    }
};

export const deleteChain = async (hex) => {
    try {
        console.log({hex})
        const db = await dbPromise;
        const tx = db.transaction(chainData, 'readwrite');
        const store = tx.objectStore(chainData);
        const existingChain = await store.get(hex);
        if (!existingChain) {
            throw new Error(`No chain found for ID ${hex}`);
        }
        await store.delete(hex);
        await tx.done;
        setLastChain('0x1')
    } catch (error) {
        console.error('Error deleting chain from IndexedDB:', error);
        throw error;
    }
};

export const getChain = async (hex) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(chainData, 'readonly');
        const store = tx.objectStore(chainData);
        const chain = await store.get(hex);

        if (!chain) {
			
            throw new Error(`No chain found for ID ${hex}`);
        }

        return chain;
    } catch (error) {
        console.error('Error fetching chain from IndexedDB:', error);
        throw error;
    }
};

export const getAllChains = async () => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(chainData, 'readonly');
        const store = tx.objectStore(chainData);

        const allChains = await store.getAll();

        // Transform the array into an object with 'hex' as keys
        const chainsObject = allChains.reduce((acc, chain) => {
            if (chain.hex) {  // Ensure 'hex' is defined to avoid undefined keys
                acc[chain.hex] = chain;
            }
            return acc;
        }, {});

        return chainsObject;
    } catch (error) {
        console.error('Error fetching all chains from IndexedDB:', error);
        throw error;
    }
};


export const createAccountEntry = async (address, name, walletKey) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readwrite');
        const store = tx.objectStore(walletData);
        await store.put({ address, name, connectedSites: [], transactions: [], tokens: [], Nfts: [], walletKey });
        await tx.done;
    } catch (error) {
        console.error('Error creating account entry in IndexedDB:', error);
        throw error;
    }
};

export const updateAccountName = async (address, newName) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readwrite');
        const store = tx.objectStore(walletData);

        // Get the current data for the address
        const data = await store.get(address);

        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }
        data.name = newName;
        await store.put(data);
        await tx.done;
    } catch (error) {
        console.error('Error updating account name in IndexedDB:', error);
        throw error;
    }
};

export const getAccountName = async (address) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);

        // Get the account data for the address
        const data = await store.get(address);

        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }
        return data.name;
    } catch (error) {
        console.error('Error fetching account name from IndexedDB:', error);
        throw error;
    }
};

export const countAccounts = async () => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);

        // Get all accounts from the object store
        const allAccounts = await store.getAll();
        return allAccounts.length;
    } catch (error) {
        console.error('Error counting accounts in IndexedDB:', error);
        throw error;
    }
};

export const addTransaction = async (address, chainTransaction, chainName, amount) => {
    try {

        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readwrite');
        const store = tx.objectStore(walletData);
        const data = await store.get(address);
        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }
        if (!data.transactions) {
            data.transactions = [];
        }
        chainTransaction['chainName'] = chainName;
        chainTransaction['amount'] = amount;
        data.transactions.push(chainTransaction);
        await store.put(data);
        await tx.done;
    } catch (error) {
        console.error('Error adding transaction in IndexedDB:', error);
        throw error;
    }
};

export const getTransactions = async (address, chainName) => {
    try {
        if (!address) {
            throw new Error('Address is required to fetch transactions.');
        }

        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);
        // Get current data for the address
        const data = await store.get(address);
        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }
        
        // Filter transactions by chain
        const transactions = data.transactions && Array.isArray(data.transactions)
            ? data.transactions.filter(transaction => transaction.chainName === chainName)
            : [];
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions from IndexedDB:', error);
        throw error;
    }
};

export const addToken = async (address, token) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readwrite');
        const store = tx.objectStore(walletData);

        // Get current data for the address
        const data = await store.get(address);

        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }
        if (!data.tokens) {
            data.tokens = [];
        }

        // Check for duplicate tokens with all same values in JSON format
        const isDuplicate = data.tokens.some(t => areTokensEqual(t, token));
        if (isDuplicate) {
            throw new Error(`Token already exists for address ${address}`);
        }

        data.tokens.push(token);
        await store.put(data);
        await tx.done;
    } catch (error) {
        throw error;
    }
};

// Utility function to compare tokens for equality
function areTokensEqual(token1, token2) {
    return (
        token1.name === token2.name &&
        token1.symbol === token2.symbol &&
        token1.totalSupply === token2.totalSupply &&
        token1.decimals === token2.decimals &&
        token1.chain === token2.chain
    );
}

export const removeToken = async (address, tokenToRemove) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readwrite');
        const store = tx.objectStore(walletData);

        // Get current data for the address
        const data = await store.get(address);

        if (!data || !data.tokens) {
            throw new Error(`No tokens found for address ${address}`);
        }

        // Filter out the token to be removed based on equality check
        data.tokens = data.tokens.filter(token => !areTokensEqual(token, tokenToRemove));

        await store.put(data);
        await tx.done;
    } catch (error) {
        console.error('Error removing token from IndexedDB:', error);
        throw error;
    }
};

export const getTokens = async (address, chain) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);

        // Get current data for the address
        const data = await store.get(address);

        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }

        // Check if tokens array exists and filter by chain
        const tokens = data.tokens && Array.isArray(data.tokens)
            ? data.tokens.filter(token => token.chain === chain)
            : [];

        return tokens;
    } catch (error) {
        console.error('Error fetching tokens from IndexedDB:', error);
        throw error;
    }
};

export const addNFT = async (address, nft) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readwrite');
        const store = tx.objectStore(walletData);

        // Get current data for the address
        const data = await store.get(address);

        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }
        if (!data.Nfts) {
            data.Nfts = [];
        }

        // Check for duplicate NFTs with all same values in JSON format
        const isDuplicate = data.Nfts.some(n => areNFTsEqual(n, nft));
        if (isDuplicate) {
            throw new Error(`NFT already exists for address ${address}`);
        }

        data.Nfts.push(nft);
        await store.put(data);
        await tx.done;
    } catch (error) {
        console.error('Error adding NFT in IndexedDB:', error);
        throw error;
    }
};

// Utility function to compare NFTs for equality
function areNFTsEqual(nft1, nft2) {
    return (
        nft1.name === nft2.name &&
        nft1.symbol === nft2.symbol &&
        nft1.tokenId === nft2.tokenId &&
        nft1.chain === nft2.chain
    );
}

export const removeNFT = async (address, nftToRemove) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readwrite');
        const store = tx.objectStore(walletData);

        // Get current data for the address
        const data = await store.get(address);

        if (!data || !data.Nfts) {
            throw new Error(`No NFTs found for address ${address}`);
        }

        // Filter out the NFT to be removed based on equality check
        data.Nfts = data.Nfts.filter(nft => !areNFTsEqual(nft, nftToRemove));

        await store.put(data);
        await tx.done;
    } catch (error) {
        console.error('Error removing NFT from IndexedDB:', error);
        throw error;
    }
};

export const getNFTs = async (address, chain) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);

        // Get current data for the address
        const data = await store.get(address);

        if (!data) {
            throw new Error(`No account found for address ${address}`);
        }

        // Check if NFTs array exists and filter by chain
        const nfts = data.Nfts && Array.isArray(data.Nfts)
            ? data.Nfts.filter(nft => nft.chain === chain)
            : [];

        return nfts;
    } catch (error) {
        console.error('Error fetching NFTs from IndexedDB:', error);
        throw error;
    }
};

export const getWalletData = async (address) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);
        const data = await store.get(address);
        return data ? data : null;
    } catch (error) {
        console.error('Error getting data from IndexedDB:', error);
        throw error;
    }
};

export const getWalletDataByFields = async (address, fieldIndices) => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);
        const data = await store.get(address);

        if (!data) return null;

        const result = {};
        fieldIndices.forEach(index => {
            if (index >= 0 && index < walletDataColumnNames.length) {
                const fieldName = walletDataColumnNames[index];
                result[fieldName] = data[fieldName];
            }
        });

        return JSON.stringify(result);
    } catch (error) {
        console.error('Error getting data by fields from IndexedDB:', error);
        throw error;
    }
};

export const getAllAccounts = async () => {
    try {
        const db = await dbPromise;
        const tx = db.transaction(walletData, 'readonly');
        const store = tx.objectStore(walletData);
        const allAccounts = await store.getAll();

        // Sort accounts by name
        if (allAccounts.length > 0) {
            return allAccounts.sort((a, b) => {
                // Ensure the names are compared in a case-insensitive manner
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
        }

        return null;
    } catch (error) {
        if (error.name === 'NotFoundError' || error.message.includes('not found')) {
            return null;
        }
        console.error('Error listing all accounts in IndexedDB:', error);
        throw error;
    }
};


export const clearIndexedDB = () => {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.deleteDatabase(dbName);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};