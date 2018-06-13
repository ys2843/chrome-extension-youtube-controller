chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method === 'next') {
        window.location.href = document.querySelector('a.ytp-next-button').href;
    }
});
