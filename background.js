chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);
    chrome.tabs.query({url: "https://www.youtube.com/*"}, function (tabs) {
        console.log(tabs[0]);
        chrome.tabs.sendMessage(tabs[0].id, {method: command}, function (response) {
            console.log(response);
            if (response) {
                console.log("next success")
                chrome.tabs.query({url: "https://www.youtube.com/*"}, function (tabs) {
                    console.log("tab success: " + tabs[0].title);
                    if (tabs[0]) {
                        chrome.notifications.create('Next song', {
                                type: 'basic',
                                iconUrl: './images/get_started128.png',
                                title: 'Now playing',
                                message: "heo"
                            },
                            function (id) {
                                console.log(chrome.runtime.lastError)
                            }
                        );
                    }
                });
            }
        });
    });
});
