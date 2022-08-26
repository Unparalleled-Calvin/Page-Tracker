let containerId = "history"
let tooltipId = "tooltip"
let zoom = d3.zoom()
let refreshInterval = 3000

let refreshEvent = new CustomEvent('refresh', {})

window.addEventListener('refresh', function () {
    refreshPage(date, containerId, tooltipId, zoom, refreshInterval);
}, false);

window.onload = function () {
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
    window.dispatchEvent(refreshEvent)
}

