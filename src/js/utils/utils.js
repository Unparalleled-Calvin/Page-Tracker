function addScript(url) {
    // introduce a js file into document
    document.write("<script src=\"" + url + "\"></script>");
}

function formatDate(date, format) {
    // standard format: yyyy-MM-dd HH:mm:ss
    const map = {
        yyyy: date.getFullYear(),
        yy: date.getFullYear().toString().slice(-2),
        MM: date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1,
        dd: date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
        HH: date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        mm: date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
        ss: date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
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

async function setHistoryByDate(date, history) {
    let historyKey = getStorageKey(date)
    let historyObject = {}
    historyObject[historyKey] = JSON.stringify(history)
    await chrome.storage.sync.set(historyObject)
}

async function getHistoryByDate(date) {
    let historyKey = getStorageKey(date)
    let result = await chrome.storage.sync.get([historyKey])
    let history = null
    if (result[historyKey]) {
        history = new History({ history: JSON.parse(result[historyKey]) })
    }
    return history
}

function draggable(id) {
    // from https://stackoverflow.com/a/6166850/15412975
    console.log(id)
    $("#" + id)
        .draggable()
        .bind('mousedown', function (event, ui) {
            // bring target to front
            $(event.target.parentElement).append(event.target);
        })
        .bind('drag', function (event, ui) {
            // update coordinates manually, since top/left style props don't work on SVG
            event.target.setAttribute('x', ui.position.left);
            event.target.setAttribute('y', ui.position.top);
        });
}