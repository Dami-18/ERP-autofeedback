// Clicking the toolbar icon forces a re-fill on the current tab.
chrome.action.onClicked.addListener((tab) => {
  if (tab && tab.id != null) {
    chrome.tabs.sendMessage(tab.id, { type: "refill" }).catch(() => {});
  }
});
