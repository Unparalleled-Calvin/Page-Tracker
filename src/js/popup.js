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
    d3.select(".toggle-button").on("click", function () {
        if(d3.select(this).classed("active")) {
            d3.select(".sidebar").style("width", "0%");
            d3.select(".content").style("left", "0%");
            d3.select(".content").style("width", "100%");
            d3.select(this).classed("active", false);
        }
        else{
            d3.select(".sidebar").style("width", "25%");
            d3.select(".content").style("left", "25%");
            d3.select(".content").style("width", "75%");
            d3.select(this).classed("active", true);
        }
    })
}

