function addScript(url) {
    // introduce a js file into document
    document.write("<script src=\"" + url + "\"></script>");
}

function formatDate(date, format) {
    // standard format: yyyy-MM-dd HH:mm:ss
    const map = {
        yyyy: date.getFullYear(),
        yy: date.getFullYear().toString().slice(-2),
        MM: date.getMonth() + 1,
        dd: date.getDate(),
        HH: date.getHours(),
        mm: date.getMinutes(),
        ss: date.getSeconds()
    }
    return format.replace(/yyyy|yy|MM|dd|HH|mm|ss/gi, matched => map[matched])
}

function getStorageKey(date) {
    let patt = /^\d\d\d\d-\d\d-\d\d$/i
    if (!patt.test(date)) {
        date = formatDate(date, "yyyy-MM-dd")
    }
    return "visual-history-" + date
}

function setHistoryByDate(date, history) {
    let historyKey = getStorageKey(date)
    let historyObject = {}
    historyObject[historyKey] = history
    chrome.storage.sync.set(historyObject, function (result) {
        // console.log(result)
    })
}

function getHistoryByDate(date) {
    let historyKey = getStorageKey(date)
    let history
    chrome.storage.sync.get([historyKey], function (result) {
        history = result.history
    })
    return history
}