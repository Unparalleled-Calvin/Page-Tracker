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

d3.select(".clear-button").on("click", function () {
    let to_delete = confirm("Clear data in " + formatDate(date, "yyyy-MM-dd") + "?");
    if (to_delete) {
        deleteHistoryByDate(date).then(function () {
            refreshPage(date, containerId, tooltipId, zoom, refreshInterval);
        })
    }
})