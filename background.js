chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);
    chrome.tabs.query({url: "https://www.youtube.com/*"}, function (tabs) {
        console.log(tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {method: "next"}, function (response) {
        });
    });
});

