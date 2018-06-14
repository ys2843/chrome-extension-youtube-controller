chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // console.log('message.method: ' + message.method)
    switch(message.method) {
        case 'next':
            window.location.href = document.querySelector('a.ytp-next-button').href;
            sendResponse({message: 'nextFinish'})
            break;
        case 'stop':
            document.querySelector('button.ytp-play-button').click();
            break;
        case 'like':
            document.querySelectorAll("a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer")[0].click();
            break;

    }
});
