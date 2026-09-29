import contentPath from "./content/index.tsx?script";

chrome.action.onClicked.addListener((tab) => {
  if (tab.id === undefined) return;
  chrome.scripting
    .executeScript({ target: { tabId: tab.id }, files: [contentPath] })
    .catch(() => {});
});
