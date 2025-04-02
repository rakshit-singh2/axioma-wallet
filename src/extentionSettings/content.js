// contentScript.js

console.log('Content script loaded');

const script = document.createElement('script');
script.src = chrome.runtime.getURL('inject.js');
(document.head || document.documentElement).appendChild(script);

script.onload = () => {
    console.log('Inject script loaded');
    script.remove();
};

window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    if (event.data.direction && event.data.direction === 'from-page-script') {
        chrome.runtime.sendMessage({
            type: 'CUSTOM_WALLET_REQUEST',
            payload: event.data.message
        }, (response) => {
            window.postMessage({
                direction: 'from-content-script',
                message: response
            }, '*');
        });
    }
});
