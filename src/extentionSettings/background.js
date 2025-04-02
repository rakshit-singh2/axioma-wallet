import { getAllAccounts } from '../helpers/storage';
import { useNavigate } from "react-router-dom";
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'CUSTOM_WALLET_REQUEST') {
        handleWalletRequest(request.payload).then(response => {
            sendResponse({ result: response });
        }).catch(error => {
            sendResponse({ error: error.message });
        });

        return true;
    }
});

async function handleWalletRequest(payload) {
    switch (payload.method) {
        case 'eth_requestAccounts':
            const accounts = await connectToWallet();
            return accounts;
        case 'eth_sendTransaction':
            const txHash = await signTransaction(payload.params);
            return txHash;
        default:
            throw new Error('Method not supported');
    }
}

async function connectToWallet() {
    const allAccounts = await getAllAccounts();
    if (allAccounts != null && allAccounts.length > 0) {
        const accounts = allAccounts.map(account => account.address);
        return accounts;
    } else {
        throw new Error("No wallet found. Please create a wallet first.");
    }
}

async function signTransaction(params) {
    const { to, from, gas, value, data, gasPrice } = params;

    // Construct the URL for the transaction route in your extension
    const url = `/transaction/${to}/${from}/${gas}/${value}/${data}/${gasPrice}`;


    chrome.runtime.sendMessage({ type: 'NAVIGATE', url: url });
}
