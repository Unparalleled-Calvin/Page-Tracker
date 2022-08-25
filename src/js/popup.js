addScript("../js/object/History.js")
addScript("../js/object/Graph.js")
addScript("../js/object/Node.js")
addScript("../js/object/Edge.js")

addScript("../js/utils/graph.js")

let displayDate = new Date()
let containerId = "history"
let tooltipId = "tooltip"
let zoom = d3.zoom()
let refreshInterval = 3000

window.onload = function () {
    readAndRenderGraph(displayDate, containerId, tooltipId, zoom, refreshInterval)
}

window.onresize = function () {
    d3.select(containerSelector)
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
}