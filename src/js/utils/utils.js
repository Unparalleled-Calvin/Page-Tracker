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

function renderGraph(id, definition) { // use or create a div with specific id. render the graph into it.
    mermaid.mermaidAPI.render(id + "-svg", definition, (svg) => {
        let element = document.getElementById(id)
        if (!element) {
            element = document.createElement("div")
            element.id = id
            document.getElementsByTagName("body")[0].append(element)
        }
        element.innerHTML = svg
    })
}

function getHistoryByDate(date) {
    let historyKey = "visual-history-" + formatDate(date, "yyyy-MM-dd")
    let history
    chrome.storage.sync.get([historyKey], function (result) {
        history = result.history
    })
    return history
}