// inject.js

console.log('Injected script loaded');

class CustomEthereumProvider {
    constructor() {
        this.selectedAddress = null;
        this.chainId = null;
    }

    request(args) {
        return new Promise((resolve, reject) => {
            console.log('Request received:', args);

            window.postMessage({
                direction: 'from-page-script',
                message: args
            }, '*');

            window.addEventListener('message', function(event) {
                if (event.source !== window) return;
                if (event.data.direction && event.data.direction === 'from-content-script') {
                    if (event.data.message.error) {
                        reject(event.data.message.error);
                    } else {
                        resolve(event.data.message.result);
                    }
                }
            });
        });
    }
}

if (typeof window.ethereum === 'undefined') {
    window.ethereum = new CustomEthereumProvider();
} else {
    console.warn('window.ethereum already defined. Skipping definition.');
}
