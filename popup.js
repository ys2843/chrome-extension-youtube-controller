chrome.runtime.sendMessage({method: "handshake"}, function (response) {
});
let recVideoList = [];
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.handshake === 'done') {
        message.data.forEach(function (ele) {
            let ob = {};
            ob.img = ele.items[0].snippet.thumbnails.maxres.url;
            ob.channelTitle = ele.items[0].snippet.channelTitle;
            ob.title = ele.items[0].snippet.title;
            ob.viewCount = ele.items[0].statistics.viewCount;
            ob.id = ele.items[0].id;
            recVideoList.push(ob);
        });
        let container = document.querySelector('div.carousel-inner');
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
            img.width = "168";
            subContainer.appendChild(img);
            let link = document.createElement('a');
            link.href = "https://www.youtube.com/watch?v=" + ele.id;
            let title = document.createElement('h5');
            title.innerText = ele.title;
            let channelTitle = document.createElement('p');
            channelTitle.innerText = ele.channelTitle;
            link.appendChild(title);
            link.appendChild(channelTitle);
            subContainer.appendChild(link);
            container.appendChild(subContainer);
        });
    }
});