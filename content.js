let timer;

function updateTimer() {
    if (timer) {
        clearTimeout(timer);
    }
    // Get the duration of the video in millisecond
    let len = 1000 * document.querySelector('span.ytp-time-duration').innerText.split(':').map((ele, index, arr) =>
        Math.pow(60, (arr.length - index - 1)) * Number(ele)).reduce((pre, cur) => pre + cur);
    // Set the timer to the duration, trigger sendTags when video ends. This means user somewhat like this video.
    timer = setTimeout(sendTags, len - 100);
    // console.log(len);
}

// Add listener on 'like' and 'subscribe' button, clicking such buttons shows interest of user to this video
function addAllListener() {
    console.log("All listener added");
    // 'like' button listener
    document.querySelectorAll("a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer")[0].addEventListener('click', function () {
        console.log('Like clicked!');
        if (this.querySelector('yt-icon-button').classList.contains('style-text')) {
            console.log("Like message send");
            sendTags();
        }
    });
    // 'subscribe' button listener
    let subscribeButton = document.querySelector('paper-button.style-scope.ytd-subscribe-button-renderer');
    let isSubscribed = subscribeButton.hasAttribute('subscribed');
    subscribeButton.addEventListener('click', function () {
        console.log("Subscribe clicked!");
        console.log("isSub: " + isSubscribed);
        if (!isSubscribed) {
            console.log("Subscribe message sent!");
            sendTags();
        }
        isSubscribed = !isSubscribed;
    });
}

// Send the video's id to background.js
function sendTags() {
    chrome.runtime.sendMessage({method: "videoId", videoId: window.location.href.split('=')[1]}, function (response) {
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('message.method: ' + message.method)
    switch (message.method) {
        case 'next':
            window.location.href = document.querySelector('a.ytp-next-button').href;
            sendResponse({message: 'nextFinish'});
            break;
        case 'stop':
            document.querySelector('button.ytp-play-button').click();
            break;
        case 'like':
            document.querySelectorAll("a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer")[0].click();
            break;
        case 'urlUpdated':
            setTimeout(updateTimer, 1000);
            break;
    }
});

window.onload = function () {
    addAllListener();
    updateTimer();
}