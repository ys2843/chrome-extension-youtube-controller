var timestamp = new Date().getTime();
var id = 'myid' + timestamp;
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

