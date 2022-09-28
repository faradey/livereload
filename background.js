let tabRelStatuses = {};
let connections = {};
chrome.action.onClicked.addListener((tab) => {
    if (tabRelStatuses[tab.id] !== true) {
        tabRelStatuses[tab.id] = true;
        connectToSocket(tab);
    } else {
        tabRelStatuses[tab.id] = false;
        connections[tab.id].close();
    }

    selectTab(tab.id);
});

function connectToSocket(tab) {
    let url = (new URL(tab.url));
    connections[tab.id] = new WebSocket("ws://" + url.host + ":35729/livereload");
    connections[tab.id].onopen = function () {
        tabRelStatuses[tab.id] = true;
        selectTab(tab.id);
        console.log("Connection established.");
    };
    connections[tab.id].onclose = function (event) {
        tabRelStatuses[tab.id] = false;
        selectTab(tab.id);
        if (event.wasClean) {
            console.log('Connection closed cleanly');
        } else {
            console.log('Lost connection');
        }
        console.log('Code: ' + event.code + ' reason: ' + event.reason);
    };

    connections[tab.id].onmessage = function (event) {
        let data = JSON.parse(event.data);
        console.log(data);
        if (data['command'] === "reload") {
            reload(tab.id, data['path']);
        }
    };

    connections[tab.id].onerror = function (error) {
        tabRelStatuses[tab.id] = false;
        selectTab(tab.id);
        console.log("Error: " + error.message);
    };
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    selectTab(tabId);
});
chrome.tabs.onActivated.addListener((info) => {
    selectTab(info.tabId);
});

function selectTab(tabId) {
    if (tabRelStatuses[tabId] === true) {
        chrome.action.setIcon({'path': {128: 'images/icon_livereload_green128.png'}});
    } else {
        chrome.action.setIcon({'path': {128: 'images/icon_livereload_red128.png'}});
    }
}

function reload(tabId, path) {
    chrome.tabs.sendMessage(tabId, {actionType: "reload", path: path}, function (response) {
        console.log(response);
    });
}