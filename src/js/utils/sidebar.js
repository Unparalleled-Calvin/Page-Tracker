function bindListenerToItemNode() {
    d3.selectAll(".item-node")
        .on("click", function () {
            rootIndex = parseInt(d3.select(this).attr("node-index"))
            previousTransform = undefined
            firstDisplay = true
            readAndRenderGraph(date, containerId, tooltipId, zoom)
        })
        .on("mouseenter", function () {
            d3.selectAll(".item-node")
                .classed("normal", true);
            d3.select(this)
                .classed("normal", false)
                .classed("focused", true)
        })
        .on("mouseleave", function () {
            d3.selectAll(".item-node")
                .classed("normal", true);
            d3.select(this)
                .classed("focused", false);
        })
}

function renderSidebarItems(nodesList, date) {
    let sidebarItem = d3.select(".sidebar-item")
    sidebarItem
        .html("")
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
    bindListenerToItemNode()
}

function renderSearchResult() {
    d3.select(".search-result").style("display", "block")
    let searchResult = d3.select(".search-result")
    let keyword = d3.select(".search-input").node().value
    searchResult
        .html("")
    let seen = new Set()
    let nodesList = []
    if (keyword != "") {
        graph.nodes.forEach((node, index) => {
            if (node.type != "wasted" && !seen.has(index)) {
                let likeRank = node.like(keyword)
                if (likeRank != -1) {
                    seen.add(index)
                    nodesList.push([node, index, likeRank])
                }
            }
        })
    }
    nodesList.sort(function (nodeInfo1, nodeInfo2) {
        return nodeInfo1[2] - nodeInfo2[2]
    })
    .forEach((nodeInfo) => {
        let node = nodeInfo[0]
        let index = nodeInfo[1]
        let likeRank = nodeInfo[2]
        searchResult
            .append("div")
            .classed("normal", true)
            .classed("item-node", true)
            .attr("node-index", index)
            .attr("like-rank", likeRank)
            .text(node.genCaption())
    })
    
    bindListenerToItemNode()
}

d3.select(".search-input").on("input", function () {
    renderSearchResult()
})

d3.select(".search-button").on("click", function() {
    renderSearchResult()
})

d3.select(".search-input").on("blur", function () {
    d3.select(".search-result")
        .style("display", "none")
})
