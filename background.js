// Get local storage of user favorite
let favTags = {};
chrome.storage.local.get(['ytCtr'], function (result) {
    if (result.ytCtr) {
        favTags = result.ytCtr;
    }
});

function updateFavTags(favTags, newTags) {
    newTags.forEach(function (ele) {
        if (favTags.hasOwnProperty(ele)) {
            favTags[ele].push(new Date().getHours());
        } else {
            favTags[ele] = [new Date().getHours()];
        }
    });
    return favTags;
}

function recAlgorithm(favTags) {
    let curHour = new Date().getHours();
    let map = {};
    for (let item in favTags) {
        let sum = 0;
        favTags[item].forEach(function (ele) {
            sum += Math.pow(1 / Math.E, (ele - curHour));
        });
        map[item] = sum;
    }
    return map;
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
                            iconUrl: './images/get_started128.png',
                            title: 'Now playing',
                            message: tabs[0].title
                        },
                        function (id) {
                            console.log(chrome.runtime.lastError)
                        }
                    );

                });

            }
        });
    });
});


// receive video id to fetch tags
var tmp = {};
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.method === 'videoId') {
            if (!tmp.hasOwnProperty(request.videoId)) {
                let url = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyB2eHvSSzxb4d_mWCJ8ZaQVTSksqH3NUM4&part=snippet&id=" + request.videoId;
                fetch(url)
                    .then(res => res.json())
                    .then(myjson => {
                        tmp[request.videoId] = myjson.items[0].snippet.tags;
                        updateFavTags(favTags, myjson.items[0].snippet.tags);
                        chrome.storage.local.set({ytCtr: favTags}, function () {
                            console.log('Favorite is updated');
                        });
                    });
            } else {
                updateFavTags(favTags, tmp[request.videoId]);
                chrome.storage.local.set({ytCtr: favTags}, function () {
                    console.log('Favorite is updated');
                });
            }
        }
    });

