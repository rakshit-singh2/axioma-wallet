import axios from 'axios';
import { addChain } from './storage';
const InitialChains = [{
    name: 'Polygon',
    ticker: "MATIC",
    blockExplorerUrl: 'https://amoy.polygonscan.com',
    rpcUrl: `https://polygon-mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`,
    userAdded: false,
}, {
    name: 'Ethereum',
    ticker: "ETH",
    blockExplorerUrl: 'https://etherscan.io',
    // rpcUrl: `https://rpc.mevblocker.io`,
    rpcUrl: `https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`,
    userAdded: false,
},{
    name: 'AlveyChain',
    ticker: 'ALV',
    blockExplorerUrl: 'https://alveyscan.com/',
    rpcUrl: 'https://elves-core2.alvey.io',
    userAdded: false,
}];

const getHex = async (rpcUrl) => {
    try {
        const requestPayload = {
            jsonrpc: "2.0",
            method: "eth_chainId",
            params: [],
            id: 1
        };

        const response = await axios.post(rpcUrl, requestPayload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.result) {
            return response.data.result;
        } else {
            throw new Error('Unexpected response format');
        }
    } catch (error) {
        throw error;
    }
};

export const addUserChain = async (name, ticker, rpcUrl, blockExplorerUrl) => {
    try {
        const hex = await getHex(rpcUrl);
        if (!hex) {
            throw new Error('Failed to get chain data');
        }
        await addChain(hex, name, ticker, rpcUrl, blockExplorerUrl, 1);
    } catch (error) {
        throw new Error(`Unable to add chain. Please verify RPC URL: ${error.message}`);
    }
};

export const initializeChainsDb = async () => {
    try {
        for (const chain of InitialChains) {
            const hex = await getHex(chain.rpcUrl);
            if (!hex) {
                throw new Error('Failed to get chain data for ' + chain.name);
            }
            await addChain(hex, chain.name, chain.ticker, chain.rpcUrl, chain.blockExplorerUrl, 0);
        }

    } catch (error) {
        console.error('Failed to initialize chains database:', error);
    }
};