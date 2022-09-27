let tabRelStatuses = {};
chrome.action.onClicked.addListener((tab) => {
    if (tabRelStatuses[tab.id] !== true) {
        tabRelStatuses[tab.id] = true;
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