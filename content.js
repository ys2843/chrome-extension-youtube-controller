let timer;

function updateTimer() {
    if (timer) {
        clearTimeout(timer);
    }
    let len = 1000 * document.querySelector('span.ytp-time-duration').innerText.split(':').map((ele, index, arr) =>
        Math.pow(60, (arr.length - index - 1)) * Number(ele)).reduce((pre, cur) => pre + cur);
    timer = setTimeout(sendTags, len);
    console.log(len);
}

// setTimeout(addAllListener, 2000);

function addAllListener() {

    console.log("All listener added");
    document.querySelectorAll("a.yt-simple-endpoint.style-scope.ytd-toggle-button-renderer")[0].addEventListener('click', function () {
        console.log('Like clicked!');
        if (this.querySelector('yt-icon-button').classList.contains('style-text')) {
            console.log("Like message send");
            sendTags();
        }
    });
    let subscribeButton = document.querySelector('paper-button.style-scope.ytd-subscribe-button-renderer');
    let isSubscribed = subscribeButton.hasAttribute('subscribed');
    subscribeButton.addEventListener('click', function () {
        console.log("Subscribe clicked!");
        if (!isSubscribed) {
            console.log("Subscribe message sent!");
            isSubscribed = !isSubscribed;
            sendTags();
        }
    });

}

function sendTags() {
    chrome.runtime.sendMessage({method: "videoId", videoId: window.location.href.split('=')[1]}, function (response) {
    });
}

window.onload = function () {
    addAllListener();
    updateTimer();
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        // console.log('message.method: ' + message.method)
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
}