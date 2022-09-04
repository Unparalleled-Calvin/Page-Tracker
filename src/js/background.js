/**
 * import necessary js file
 */
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

/**
 * default refresh interval
 */
let refreshInterval = 3

/**
 * click extension icon
 */
chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: chrome.runtime.getURL("../html/popup.html"),
        type: "popup"
    });
});

/**
 * listen delete message from nav.js
 * delete specific item according to the date
 */
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.name == "delete") {
        let key = getStorageKey(request.date)
        chrome.storage.local.remove([key])
        sendResponse({ status: 'ok' })
    }
})

/**
 * tab listener
 * in charge of visitCount and current node tracking
 */
chrome.tabs.onActivated.addListener(() => {
    // get and refresh URL when switch tabs happens
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0]
        // avoid getting ""
        var value = activeTab.url || activeTab.pendingUrl

        // avoid the local variable disappearing caused by service_worker close down
        updateCurrentUrlStorage(value)

        displayUrl(value)
        // 1. query the current node
        let today = new Date()
        getHistoryByDate(today).then((history) => {
            let currIdx = -1
            if (history) {
                currIdx = history.graph.queryNode("url", value)
            } else {
                if (!value.startsWith("chrome-extension://")) {
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
                }
            }

            // 2. change the highlight status
            if (currIdx != -1) { // switch tab not navigate
                var node = history.graph.nodes[currIdx]
                // add details of node
                node.visitCount += 1
                history.graph.nodes[currIdx] = node

                history.graph.toggleSwitch(currIdx)
            }

            // 3. update to storage
            setHistoryByDate(history, today)
        })
    })
})

/**
 * web navigation listener
 * in charge of the recording of basic navigation information
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

/**
 * add some details from history listener
 */
chrome.history.onVisited.addListener((result) => {
    let today = new Date()
    getHistoryByDate(today).then((history) => {
        if (history) {
            // info about caption id isCollected
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
})

/**
 * add some details through history and bookmarks
 */
chrome.webNavigation.onCompleted.addListener((details => {
    if (details.frameType == "outermost_frame") {
        let today = new Date()
        getHistoryByDate(today).then((history) => {
            if (history) {
                // favIconUrl
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    if (tabs.length > 0) {
                        var activeTab = tabs[0]
                        if (activeTab.favIconUrl) {
                            var idx = history.graph.queryNode("url", details.url)
                            if (idx != -1) {
                                var node = history.graph.nodes[idx]
                                node.iconUrl = activeTab.favIconUrl
                                history.graph.nodes[idx] = node
                                setHistoryByDate(history, today)
                            }
                        }
                    }
                })

                // info about caption id isCollected
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
}))

/**
 * link the two nodes
 * @param {string} startUrl 
 * @param {string} endUrl 
 */
function handleNavigation(startUrl, endUrl) {
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
                if (!startUrl.startsWith("chrome-extension://")) {
                    let newNode = new Node({
                        id: history.graph.nodes.length,
                        url: startUrl
                    })
                    currIdx = history.graph.addNode(newNode)
                }
            }
            // 1.2 find the targetNode(or create one)
            targetIdx = history.graph.queryNode("url", endUrl)
            if (targetIdx == -1) {
                if (!endUrl.startsWith("chrome-extension://")) {
                    let newNode = new Node({
                        id: history.graph.nodes.length,
                        url: endUrl
                    })
                    targetIdx = history.graph.addNode(newNode)
                }
            }
            // 1.3 check if there is already an edge between them
            let edgeIdx = history.graph.queryEdge(currIdx, targetIdx)

            // 1.3.1 if there is no edge between two nodes and it's not a single circle
            if (edgeIdx == -1 && currIdx != targetIdx) {
                history.graph.addEdge(new Edge({ src: currIdx, dst: targetIdx }))
            }
            // 1.3.2 otherwise do nothing in step 1.3

        } else {
            // create a new history instance
            if (!endUrl.startsWith("chrome-extension://")) {
                let newHistory = new History()
                let newNode = new Node({
                    id: newHistory.graph.nodes.length,
                    url: endUrl
                })
                currIdx = newHistory.graph.addNode(newNode)
                targetIdx = currIdx
                newHistory.graph.addEdge(new Edge({ src: 0, dst: currIdx }))
                history = newHistory
            }
        }

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
    chrome.storage.local.set({ 'currentURL': value })
}

/**
 * update time info in a time interval
 * also, check abnormal nodes periodically
 */
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
        }
    })
    checkAbnormalNodes()
}

/**
 * check the nodes with no caption but not all situations are covered
 */
function checkAbnormalNodes() {
    let today = new Date()
    getHistoryByDate(today).then((history) => {
        if (history) {
            let arr = history.graph.nodes
            arr.forEach((node, index) => {
                if (node.type != "wasted" && node.caption == "") {
                    // native embedded pages
                    if (node.url.startsWith("chrome://")) {
                        let len = node.url.length
                        let str = node.url.substring(9, 10).toUpperCase() + node.url.substring(10, len - 1).toLowerCase()
                        node.caption = str
                    } else if (node.url.startsWith("edge://")) {
                        let len = node.url.length
                        let str = node.url.substring(7, 8).toUpperCase() + node.url.substring(8, len - 1).toLowerCase()
                        node.caption = str
                    } else if (node.url.startsWith("https://www.google.com")) {
                        chrome.history.search({ text: node.url }, result => {
                            if (result.length > 0) {
                                if (checkIfOnlyTldDiff(node.url, result[0].url)) {
                                    let idx = history.graph.queryNode("url", result[0].url)
                                    if (history.graph.nodes[index] != null && history.graph.nodes[idx] != null) {
                                        history.graph.nodes = history.graph.mergeNode(index, idx)
                                    }
                                    setHistoryByDate(history, today)
                                }
                            }
                        })
                    } else if (node.url.startsWith("https://www.bing.com")) {
                        let searchQ = node.url.substring(node.url.indexOf('.'))
                        chrome.history.search({ text: searchQ }, result => {
                            if (result.length > 0) {
                                if (checkIfOnlyFirstDomainDiff(node.url, result[0].url)) {
                                    let idx = history.graph.queryNode("url", result[0].url)
                                    if (history.graph.nodes[index] != null && history.graph.nodes[idx] != null) {
                                        history.graph.nodes = history.graph.mergeNode(index, idx)
                                    }
                                    setHistoryByDate(history, today)
                                }
                            }
                        })
                    }
                }
                // merge new tab into root (compatible to edge and chrome)
                if (node.type != "wasted" && (node.url.endsWith("://newtab/") || node.url == "http://lx.pub/")) {
                    let idx = history.graph.queryNode("id", "root")
                    if (history.graph.nodes[index] != null && history.graph.nodes[idx] != null) {
                        history.graph.nodes = history.graph.mergeNode(index, idx)
                    }
                    setHistoryByDate(history, today)
                }
            })
            history.graph.nodes = arr
            setHistoryByDate(history, today)
        }
    })
}

/**
 * Extract the domain from the url
 * @param {string} url 
 * @returns {string} domain
 */
function extractDomain(url) {
    var re = /:\/\/(www\.)?(.+?)\//;
    return url.match(re)[2];
}

/**
 * e.g. www.chrome.com --- www.chrome.com.hk -- return true
 * @param {string} url1 
 * @param {string} url2 
 * @returns boolean
 */
function checkIfOnlyTldDiff(url1, url2) {
    let domain1 = extractDomain(url1)
    let domain2 = extractDomain(url2)
    let temp2 = domain2.substring(0, domain2.lastIndexOf("."))
    let temp2a = domain2.substring(domain2.lastIndexOf(".") + 1)
    // support Chinese HK China USA and Singapore
    if (domain1 == temp2 && (temp2a == "hk" || temp2a == "cn" || temp2a == "us" || temp2a == "sg")) {
        return true
    }
    return false
}

/**
 * e.g. www.bing.com --- cn.bing.com --> then return true 
 * @param {string} url1 
 * @param {string} url2 
 * @returns boolean
 */
function checkIfOnlyFirstDomainDiff(url1, url2) {
    let domain1 = extractDomain(url1)
    let domain2 = extractDomain(url2)
    let temp2a = domain2.substring(0, domain2.indexOf("."))
    let temp2 = domain2.substring(domain2.indexOf(".") + 1)
    if (domain1 == temp2 && (temp2a == "cn" || temp2a == "hk" || temp2a == "us" || temp2a == "sg")) {
        return true
    }
    return false
}

/**
 * refresh the info periodically
 */
setInterval(updateAdditionInfo, refreshInterval * 1000)