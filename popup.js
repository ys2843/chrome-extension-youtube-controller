chrome.runtime.sendMessage({method: "handshake"}, function (response) {
});
let recVideoList = [];
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.handshake === 'done') {
        message.data.forEach(function (ele) {
            let ob = {};
            console.log(ele)
            if (ob.img = ele.items[0].snippet.thumbnails.standard) {
                ob.img = ele.items[0].snippet.thumbnails.standard.url;
            } else if (ob.img = ele.items[0].snippet.thumbnails.high) {
                ob.img = ele.items[0].snippet.thumbnails.high.url;
            } else if (ob.img = ele.items[0].snippet.thumbnails.medium) {
                ob.img = ele.items[0].snippet.thumbnails.medium.url;
            } else {
                ob.img = ele.items[0].snippet.thumbnails.default.url;
            }
            ob.channelTitle = ele.items[0].snippet.channelTitle;
            ob.title = ele.items[0].snippet.title;
            ob.id = ele.items[0].id;
            recVideoList.push(ob);
        });
        let container = document.querySelector('div.carousel-inner');
        container.style.transitionDuration = "0.3s";
        container.onmouseover = function () {
            container.style.cursor = "pointer";
            container.style.color = "blue";
            container.style.opacity = "0.7";
        };
        container.onmouseout = function () {
            container.style.cursor = "default";
            container.style.color = "black";
            container.style.opacity = "1";
        };
        recVideoList.forEach(function (ele, index) {
            let subContainer = document.createElement('div');
            subContainer.classList.add("carousel-item");
            if (index === 0) {
                subContainer.classList.add("active");
            }
            let img = document.createElement('img');
            img.classList.add("d-block", "w-100");
            img.src = ele.img;
            img.alt = "Video Image";
            img.width = "168px";
            img.style.padding = "5px 0px 10px 0px";
            subContainer.appendChild(img);
            let link = document.createElement('div');
            let title = document.createElement('h6');
            title.innerText = ele.title;
            title.style.paddingBottom = '5px';
            let channelTitle = document.createElement('p');
            channelTitle.innerText = ele.channelTitle;
            channelTitle.classList.add("blockquote-footer");
            link.appendChild(title);
            link.appendChild(channelTitle);
            subContainer.appendChild(link);
            container.appendChild(subContainer);
            subContainer.addEventListener('click', function () {
                chrome.tabs.query({url: "https://www.youtube.com/*"}, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        method: "popupNext",
                        url: "https://www.youtube.com/watch?v=" + ele.id
                    }, function (response) {
                    });
                });
            });
        });
    }
});