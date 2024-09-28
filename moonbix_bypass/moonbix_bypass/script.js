chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.url.includes("page-6553") && details.url.includes(".js")) {
		console.log('Detected');
        return {redirectUrl: chrome.runtime.getURL("page-6553.js")};
      }
    },
    {urls: ["*://bin.bnbstatic.com/*"]},
    ["blocking"]
  );