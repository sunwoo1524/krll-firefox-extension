async function getShortURL(url) { // short long url
    const response = await fetch("https://krll.me/api/urls", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "url": url,
        }),
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    return "https://krll.me/" + data.key;
}

// connect to content_script
let port;

browser.runtime.onConnect.addListener((p) => {
    port = p;
});

// create context menu
browser.contextMenus.create(
    {
        id: "krll-url-shortener",
        title: "Shorten this URL",
        contexts: ["link"]
    },
);


// short url if you click context menu
browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "krll-url-shortener") {
        // get short URL
        const short_url = await getShortURL(info.linkUrl);

        // check error
        if (short_url === null) {
            // error in API
            port.postMessage({ success: false });
        } else {
            // send short url to content script
            port.postMessage({ success: true, url: short_url });
        }
    }
});