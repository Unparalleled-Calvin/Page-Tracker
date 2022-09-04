function renderSidebarItems(nodesList, date) {
    let sidebarItem = d3.select(".sidebar-item")
    sidebarItem
        .html("")
    sidebarItem
        .append("div")
        .classed("item-header", true)
        .text(formatDate(date, "yyyy-MM-dd"))
    let sidebarItemNodes = sidebarItem
        .append("div")
        .classed("item-nodes", true)
    nodesList.forEach((infoPair, index) => {
        let node = infoPair[0], nodeIndex = infoPair[1]
        sidebarItemNodes
            .append("li")
            .classed("item-node", true)
            .classed("normal", true)
            .attr("node-index", nodeIndex)
            .text(node.genCaption())
    })
    d3.selectAll(".item-node").on("click", function () {
        rootIndex = parseInt(d3.select(this).attr("node-index"))
        previousTransform = undefined
        firstDisplay = true
        readAndRenderGraph(date, containerId, tooltipId, zoom)
    })
    d3.selectAll(".item-node").on("mouseenter", function () {
        d3.selectAll(".item-node")
            .classed("unfocused", true)
            .classed("normal", false);
        d3.select(this)
            .classed("focused", true)
            .classed("unfocused", false);
    })
    d3.selectAll(".item-node").on("mouseleave", function () {
        d3.selectAll(".item-node")
            .classed("unfocused", false)
            .classed("normal", true);
        d3.select(this)
            .classed("focused", false);
    })
}

d3.select(".search-input").on("click", function() {
    d3.select(".search-result")
        .style("display", "block")
})

d3.select(".search-result").on("mouseleave", function() {
    d3.select(this)
        .style("display", "none")
})