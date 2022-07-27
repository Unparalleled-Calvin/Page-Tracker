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

function renderGraph(id, definition) { // create a div with specific id. render the graph into it.
    element = document.createElement("div");
    element.id = id
    var insertSvg = function(svgCode) {
        element.innerHTML = svgCode;
        document.getElementsByTagName("body")[0].append(element)
    };
    mermaid.mermaidAPI.render(id, definition, insertSvg);
}