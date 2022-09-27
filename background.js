let tabRelStatuses = {};
chrome.action.onClicked.addListener((tab) => {
    if (tabRelStatuses[tab.id] !== true) {
        tabRelStatuses[tab.id] = true;
        connectToSocket(tab);
    } else {
        tabRelStatuses[tab.id] = false;
        selectTab(tab.id);
    }
});

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

function connectToSocket(tab){
    let host = (new URL(tab.url));
    let socket = new WebSocket("ws://"+host.hostname+":35729/livereload");
    socket.onopen = function() {
        tabRelStatuses[tab.id] = true;
        selectTab(tab.id);
        console.log("Connection established.");
    };
    socket.onclose = function(event) {
        tabRelStatuses[tab.id] = false;
        selectTab(tab.id);
        if (event.wasClean) {
            console.log('Connection closed cleanly');
        } else {
            console.log('Lost connection');
        }
        console.log('Code: ' + event.code + ' reason: ' + event.reason);
    };

    socket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        if(data['command'] === "reload") {
            console.log(data['path']);
        }
    };

    socket.onerror = function(error) {
        tabRelStatuses[tab.id] = false;
        selectTab(tab.id);
        console.log("Error: " + error.message);
    };
}