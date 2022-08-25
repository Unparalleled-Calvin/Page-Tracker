addScript("../js/object/History.js")
addScript("../js/object/Graph.js")
addScript("../js/object/Node.js")
addScript("../js/object/Edge.js")

addScript("../js/utils/graph.js")

window.onload = function () {
    getHistoryByDate(new Date()).then((history) => {
        history = new History({ history: history })
        let containerId = "history"
        let containerSelector = "#" + containerId

        let render = new dagreD3.render();

        let graph = history.graph
        let g = graph.dagre()

        let svg = d3
            .select(containerSelector)
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight)
        let svgGroup = svg.append("g");
        let zoom = d3.zoom()
            .on("zoom", function () {
                svgGroup.attr("transform", d3.event.transform);
            });
        svg.call(zoom);
        render(d3.select(containerSelector + " g"), g);

        let gBox= d3.select(containerSelector + " g").node().getBoundingClientRect()
        svg.attr("viewBox", "" + (gBox.width - window.innerWidth) / 2 + " " + (gBox.height - window.innerHeight) / 2 + " " + window.innerWidth + " " + window.innerHeight) // show svg in center
    
        d3.selectAll(".node").on("mouseenter", function (id) {
            d3.selectAll(".node").classed("unfocused", true);
            d3.selectAll(".edgePath").classed("unfocused", true);
            d3.select(this).classed("focused", true);
            d3.select(this).classed("unfocused", false);

            d3.select("#tooltip")
              .html(graph.nodes[id].infoHTML())
              .style("top", event.pageY + 20 + "px")
              .style("left", event.pageX + 20 + "px")
        });
        d3.selectAll(".node").on("mouseleave", function () {
            d3.selectAll(".node").classed("unfocused", false);
            d3.selectAll(".edgePath").classed("unfocused", false);
            d3.select(this).classed("focused", false);

            d3.select("#tooltip")
                .style("top", "-500px")
                .style("left", "-500px")
        });
        d3.selectAll(".node").on("mousemove", function () {
            d3.select("#tooltip")
              .style("top", event.pageY + 20 + "px")
              .style("left", event.pageX + 20 + "px")
        });
    })
}

window.onresize = function () {
    let containerId = "history"
    let containerSelector = "#" + containerId
    d3.select(containerSelector)
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
}