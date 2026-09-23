// The only job here is telling you at a glance when the extension is paused.
async function showState() {
    const { enabled } = await chrome.storage.sync.get({ enabled: true });
    chrome.action.setBadgeText({ text: enabled ? "" : "off" });
    chrome.action.setBadgeBackgroundColor({ color: "#5c6166" });
}

chrome.runtime.onInstalled.addListener(showState);
chrome.runtime.onStartup.addListener(showState);
chrome.storage.onChanged.addListener(showState);
