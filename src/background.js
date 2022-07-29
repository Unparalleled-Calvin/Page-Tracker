/**
 * history listener
 */
chrome.history.onVisited.addListener((result) => {
    console.log(result)
})

chrome.history.onVisitRemoved.addListener((result) => {
    console.log(result)
})


/**
 * tab listener
 */
chrome.tabs.onActivated.addListener(() => {
    // get and refresh URL when switch tabs happens
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0]
        // avoid getting ""
        var value = activeTab.url || activeTab.pendingUrl

        // avoid the local variable disappearing caused by service_worker close down
        chrome.storage.sync.set({ 'currentURL': value }, function () {
            // do nothing
        })

        // for demonstrate
        chrome.storage.sync.get(['currentURL'], function (result) {
            displayUrl(result.currentURL)
        })
    })
})


/**
 * web navigation listener
 */
chrome.webNavigation.onCompleted.addListener((details) => {
    // omit sub_frame navigation
    if (details.frameType === "outermost_frame") {
        // get the prev URL and log the trace
        chrome.storage.sync.get(['currentURL'], function (result) {
            displayTrace(result.currentURL, details.url)
            // TODO: set to storage
        })

        // update the fresh url
        chrome.storage.sync.set({ 'currentURL': details.url }, function () {
            // do nothing
        })
    }
})



function displayUrl(url) {
    console.log("Current URL: " + url)
}

function displayTrace(oldURL, newURL) {
    console.log("trace: " + oldURL + " ---> " + newURL)
}