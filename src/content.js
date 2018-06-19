let listenerAdded = false;
let timer;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log('message.method: ' + message.method);
    switch (message.method) {
        case 'next':
            document.querySelector('a.ytp-next-button').click();
            sendResponse({message: 'nextFinish'});
            break;
        case 'stop':
            document.querySelector('button.ytp-play-button').click();
            break;
        case 'like':
            document.querySelector('div#menu-container div#menu ytd-toggle-button-renderer').click();
            break;
        case 'pre':
            document.querySelector('a.ytp-prev-button.ytp-button').click();
            break;
        case 'urlUpdated':
            if (message.url.indexOf('watch') !== -1) {
                setTimeout(updateTimer.bind(null, timer), 1000);
                // Skip ads
                if (document.querySelector('div.html5-video-player').classList[4] === "ad-showing") {
                    document.querySelector('video').currentTime = document.querySelector('video').duration;
                }
                if (!listenerAdded) {
                    setTimeout(addAllListener, 1500);
                    listenerAdded = true;
                }
            } else {
                clearTimeout(timer);
            }
            break;
        case 'popupNext':
            window.location.href = message.url;
            break;
        default:
            console.log("No such command");
    }

    // clear and reassign a new timer
    function updateTimer(timer) {
        console.log("Timer reset!");
        if (timer) {
            clearTimeout(timer);
        }
        // Get the duration of the video in millisecond
        let len = 1000 * document.querySelector('span.ytp-time-duration').innerText.split(':').map((ele, index, arr) =>
            Math.pow(60, (arr.length - index - 1)) * Number(ele)).reduce((pre, cur) => pre + cur);
        // Set the timer to the duration, trigger sendTags when video ends. This means user somewhat like this video.
        timer = setTimeout(sendTags, len - 1500);
    }

    // Add listener on 'like' and 'subscribe' button, clicking such buttons shows interest of user to this video
    function addAllListener() {
        // 'like' button listener
        document.querySelector('div#menu-container div#menu ytd-toggle-button-renderer').addEventListener('click', function () {
            console.log('Like clicked!');
            let that = this;
            setTimeout(function () {
                if (!that.querySelector('yt-icon-button').classList.contains('style-text')) {
                    console.log("Like message send");
                    sendTags();
                }
            }, 500);
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
            setTimeout(function () {
                isSubscribed = subscribeButton.hasAttribute('subscribed');
            }, 5000);
        });
        console.log("All listener added");
    }

    // Send the video's id to background.js
    function sendTags() {
        console.log("Tags sent to backrgound!");
        chrome.runtime.sendMessage({
            method: "videoId",
            videoId: window.location.href.split('=')[1]
        }, function (response) {
        });
    }
});



