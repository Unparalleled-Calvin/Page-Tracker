try {
    importScripts('./object/History.js', './object/Graph.js',
        './object/Node.js', './object/Edge.js');
} catch (e) {
    console.error(e);
}

try {
    importScripts('./utils/utils.js');
} catch (e) {
    console.error(e)
}

let refreshInterval = 3
/**
 * history listener "replenish the nodes' content"
 */
// chrome.history.onVisited.addListener((result) => {
//     console.log(result)
// })

// chrome.history.onVisitRemoved.addListener((result) => {
//     console.log(result)
// })


/**
 * tab listener
 */
chrome.tabs.onActivated.addListener(() => {
    // get and refresh URL when switch tabs happens
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0]
        // console.log(activeTab)
        // avoid getting ""
        var value = activeTab.url || activeTab.pendingUrl

        // avoid the local variable disappearing caused by service_worker close down
        updateCurrentUrlStorage(value)

        // 0. demonstrate
        displayUrl(value)
        // 1. query the current node
        let today = new Date()
        getHistoryByDate(today).then((history) => {
            let currentNode = null
            let currIdx = -1
            if (history) {
                currIdx = history.graph.queryNode("url", value)
                if (currIdx != -1) {
                    currentNode = history.graph.nodes[currIdx]
                }
            } else {
                // create a new history instance
                let newHistory = new History()
                let newNode = new Node({
                    url: value,
                    caption: activeTab.title,
                    iconUrl: activeTab.favIconUrl
                })
                currIdx = newHistory.graph.addNode(newNode)
                newNode.id = currIdx
                newHistory.graph.addEdge(new Edge({ src: 0, dst: currIdx }))
                history = newHistory
                currentNode = newNode
            }

            // 2. change the highlight status
            if (currIdx != -1) {
                console.log(currIdx)
                history.graph.toggleSwitch(currIdx)
            }

            // 3. update to storage
            setHistoryByDate(history, today)
        })
    })
})

/**
 * web navigation listener
 */
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameType == "outermost_frame") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let tab = tabs[0]
            let startUrl = ""
            let endUrl = ""
            let promise
            if (tab.url === "") { // link to a new tab
                promise = new Promise(function (resolve, reject) {
                    resolve(chrome.tabs.get(tab.openerTabId))
                })
                // chrome.tabs.get(tab.openerTabId, (parentTab) => {
                //     startUrl = parentTab.url
                //     promise.resolve(startUrl)
                // })
            } else { // normal cases
                startUrl = tab.url
            }

            if (tab.pendingUrl) { // normal cases
                endUrl = tab.pendingUrl
            } else { // create a new blank tab, we should override startUrl
                startUrl = ""
                endUrl = tab.url
            }

            // handle navigation event in different cases
            if (tab.url === "") {
                promise.then(
                    result => {
                        startUrl = result.url
                        handleNavigation(startUrl, endUrl)
                    }
                )
            } else {
                handleNavigation(startUrl, endUrl)
            }
        })
    }
})

function handleNavigation(startUrl, endUrl) {
    // 0. demonstrate
    displayTrace(startUrl, endUrl)
    // 1. maintain the relations
    let today = new Date()
    getHistoryByDate(today).then((history) => {
        let currIdx = -1
        let targetIdx = -1
        if (history) {
            // 1.1 find the currentNode
            currIdx = history.graph.queryNode("url", startUrl)
            if (currIdx == -1) {
                let newNode = new Node({ //TODO: need more info
                    id: history.graph.nodes.length,
                    url: startUrl
                })
                currIdx = history.graph.addNode(newNode)
            }
            // 1.2 find the targetNode(or create one)
            targetIdx = history.graph.queryNode("url", endUrl)
            if (targetIdx == -1) {
                let newNode = new Node({ //TODO: need more info
                    id: history.graph.nodes.length,
                    url: endUrl
                })
                targetIdx = history.graph.addNode(newNode)
            }
            // console.log(currIdx)
            // console.log(targetIdx)
            // 1.3 check if there is already an edge between them
            let edgeIdx = history.graph.queryEdge(currIdx, targetIdx)

            // 1.3.1 if there is no edge between two nodes and it's not a single circle
            if (edgeIdx == -1 && currIdx != targetIdx) {
                history.graph.addEdge(new Edge({ src: currIdx, dst: targetIdx }))
            }
            // 1.3.2 otherwise do nothing in step 1.3

        } else {
            // may not go into this branch (extreme case: this event happens at in a new day without a previous tab change)

            // create a new history instance
            let newHistory = new History()
            let newNode = new Node({ //TODO: need more info
                id: history.graph.nodes.length,
                url: endUrl
            })
            currIdx = newHistory.graph.addNode(newNode)
            targetIdx = currIdx
            newHistory.graph.addEdge(new Edge({ src: 0, dst: currIdx }))
            history = newHistory
        }

        console.log(targetIdx)
        // 2. change the highlight status
        history.graph.toggleSwitch(targetIdx)

        // 3. update to storage
        setHistoryByDate(history, today)
    })

    updateCurrentUrlStorage(endUrl)
}

function displayUrl(url) {
    console.log("Current URL: " + url)
}

function displayTrace(oldURL, newURL) {
    console.log("trace: " + oldURL + " ==> " + newURL)
}

function updateCurrentUrlStorage(value) {
    chrome.storage.local.set({ 'currentURL': value }, function () {
        // do nothing
    })
}

// search for all history items in last 24h and update them if they are in the record
function updateAdditionInfo() {
    let today = new Date()
    getHistoryByDate(today).then((history) => {
        if (history) {
            // Only count time if system has not been idle for 30 seconds
            chrome.idle.queryState(30, function (state) {
                if (state === "active") {
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        if (tabs.length > 0) {
                            var activeTab = tabs[0]
                            var url = activeTab.url || activeTab.pendingUrl

                            var idx = history.graph.queryNode('url', url)
                            if (idx != -1) {
                                var node = history.graph.nodes[idx]
                                node.totalTime += refreshInterval
                                history.graph.nodes[idx] = node
                                setHistoryByDate(history, today)
                            }
                        }
                    })
                }
            })

            // info about caption id visitCount and isCollected
            chrome.history.search({ text: '' }, result => {
                for (var i = 0; i < result.length; i++) {
                    let idx = history.graph.queryNode("url", result[i].url)
                    if (idx != -1) {
                        let node = history.graph.nodes[idx]
                        let promise
                        promise = new Promise(function (resolve, reject) {
                            resolve(chrome.bookmarks.search({ url: result[i].url }))
                        })
                        node.caption = result[i].title
                        node.id = result[i].id
                        node.visitCount = result[i].visitCount

                        promise.then(results => {
                            if (results.length != 0) {
                                node.isCollected = 1
                            }
                            history.graph.nodes[idx] = node
                            setHistoryByDate(history, today)
                        })
                    }
                }
            })
        }
    })
}

// click extension icon
chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: chrome.runtime.getURL("../html/popup.html"),
        type: "popup"
    });
});

setInterval(updateAdditionInfo, refreshInterval * 1000)