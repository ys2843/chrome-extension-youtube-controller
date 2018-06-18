let recVideoList = [];
let favTags = {};
chrome.storage.local.get(['ytCtr'], function (result) {
    if (result.ytCtr) {
        console.log("get list from local storage!");
        favTags = result.ytCtr;
        fetchRecVideo(favTags);
    }
});

function updateRecVideoList() {
    recVideoList = [];
    fetchRecVideo(favTags);
}

function fetchRecVideo(favTags) {
    let recTags = recAlgorithm(favTags);
    recTags.forEach(function (ele) {
        fetch('https://www.googleapis.com/youtube/v3/search?key=AIzaSyB2eHvSSzxb4d_mWCJ8ZaQVTSksqH3NUM4&part=snippet&maxResults=10&q=' + ele + '&type=video')
            .then(res => res.json())
            .then(js => {
                fetch("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyB2eHvSSzxb4d_mWCJ8ZaQVTSksqH3NUM4&part=snippet&id=" + js.items[Math.floor(Math.random() * 10)].id.videoId)
                    .then(res => res.json())
                    .then(js => {
                        recVideoList.push(js);
                    })
            })
    });
}

function recAlgorithm(favTags) {
    let curHour = new Date().getHours();
    let map = [];
    for (let item in favTags) {
        let sum = 0;
        favTags[item].forEach(function (ele) {
            sum += Math.pow(1 / Math.E, (ele - curHour));
        });
        map.push([item, sum]);
    }
    return map.sort((a, b) => b[1] - a[1]).slice(0, 5).map(ele => ele[0]);
}


function updateFavTags(favTags, newTags) {
    let hours = new Date().getHours();
    newTags.forEach(function (ele) {
        if (favTags.hasOwnProperty(ele)) {
            favTags[ele].push(hours);
        } else {
            favTags[ele] = [hours];
        }
    });
}


// add keyboard control
let timestamp = new Date().getTime();
let id = 'myid' + timestamp;
chrome.commands.onCommand.addListener(function (command) {
    // console.log('Command:', command);
    chrome.tabs.query({url: "https://www.youtube.com/*"}, function (tabs) {
        // console.log(tabs[0]);
        chrome.tabs.sendMessage(tabs[0].id, {method: command}, function (response) {
            if (response) {
                chrome.tabs.query({url: "https://www.youtube.com/*"}, function (tabs) {
                    chrome.notifications.create(id, {
                            type: 'basic',
                            iconUrl: './images/128.png',
                            title: 'Now playing',
                            message: tabs[0].title
                        },
                        function (id) {
                            // console.log(chrome.runtime.lastError)
                        }
                    );
                });
            }
        });
    });
});

// send urlupdated message to content.js
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url.indexOf('youtube.com/watch') !== -1 && changeInfo && changeInfo.status === "complete") {
        // console.log("Tab updated: " + tab.url);
        chrome.tabs.sendMessage(tabId, {method: 'urlUpdated', url: tab.url}, function (response) {
            // console.log(chrome.runtime.lastError);
        });

    }
});

// use a tmp to cache the AJAX content in order to reduce HTTP requests
let tmp = {};
// receive video id to fetch tags
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.method === 'videoId') {
            if (!tmp.hasOwnProperty(request.videoId)) {
                fetch("https://www.googleapis.com/youtube/v3/videos?key=AIzaSyB2eHvSSzxb4d_mWCJ8ZaQVTSksqH3NUM4&part=snippet&id=" + request.videoId)
                    .then(res => res.json())
                    .then(myjson => {
                        console.log(myjson);
                        if (myjson.items[0].snippet.tags) {
                            tmp[request.videoId] = myjson.items[0].snippet.tags;
                            updateFavTags(favTags, myjson.items[0].snippet.tags);
                            updateRecVideoList();
                            chrome.storage.local.set({ytCtr: favTags}, function () {
                                console.log('Favorite is updated');
                            });
                        }
                    });
            } else {
                updateFavTags(favTags, tmp[request.videoId]);
                updateRecVideoList();
                chrome.storage.local.set({ytCtr: favTags}, function () {
                    console.log('Favorite is updated by temp');
                });
            }
        } else if (request.method === 'handshake') {
            chrome.runtime.sendMessage({handshake: 'done', data: recVideoList}, function (response) {
            });
        } else if (request.method === 'reset') {
            chrome.storage.local.remove(['ytCtr'], function () {
            });
            recVideoList = [];
            favTags = {};
            sendResponse({message: "resetFinish"});
        }
    });

// page action show
chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'www.youtube.com'},
        })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
});