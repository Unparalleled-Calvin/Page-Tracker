function genRandomGraph(n) { // randomly generate a graph with n nodes with at least 2n edges
    let graph = new Graph()
    for (i = 1; i <= n; i++) {
        let node = new Node({ id: String(i), url: "https://www.example.com/" + i, caption: "Example" + i })
        graph.addNode(node)
    }
    for (i = 1; i <= 2 * n; i++) {
        let id1 = parseInt(Math.random() * (n + 1)), id2 = parseInt(Math.random() * (n + 1))
        let edge = new Edge({ src: id1, dst: id2 })
        if (graph.queryEdge(id1, id2) == -1) {
            graph.addEdge(edge)
        }
    }
    return graph
}

let previousTransform
let firstDisplay = true

function readAndRenderGraph(date, containerId, tooltipId, zoom, refreshInterval) {
    getHistoryByDate(date).then(function (history) {
        history = new History({ history: history })
        let containerSelector = "#" + containerId
        let tooltipSelector = "#" + tooltipId

        let render = new dagreD3.render();

        let graph = history.graph
        let g = graph.dagre()

        let svg = d3
            .select(containerSelector)
            .html("<g></g>")
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight)
        render(d3.select(containerSelector + " g"), g);
        let svgGroup = d3.select(containerSelector + " g")
        zoom.on("zoom", function () {
            previousTransform = d3.event.transform
            svgGroup.attr("transform", d3.event.transform);
        });
        svg.call(zoom.transform, (previousTransform ? d3.zoomIdentity
            .scale(previousTransform.k)
            .translate(
                previousTransform.x / previousTransform.k,
                previousTransform.y / previousTransform.k
            ) : d3.zoomIdentity));
        svg.call(zoom);
        
        if (firstDisplay) {
            firstDisplay = false
            let gBox = d3.select(containerSelector + " g").node().getBoundingClientRect()
            svg.attr("viewBox", "" + (gBox.width - window.innerWidth) / 2 + " " + (gBox.height - window.innerHeight) / 2 + " " + window.innerWidth + " " + window.innerHeight) // show svg in center
        }

        d3.selectAll(".node").on("mouseenter", function (id) {
            d3.selectAll(".node").classed("unfocused", true);
            d3.selectAll(".edgePath").classed("unfocused", true);
            d3.select(this).classed("focused", true);
            d3.select(this).classed("unfocused", false);

            d3.select(tooltipSelector)
                .html(graph.nodes[id].infoHTML())
                .style("top", event.pageY + 20 + "px")
                .style("left", event.pageX + 20 + "px")
        });
        d3.selectAll(".node").on("mouseleave", function () {
            d3.selectAll(".node").classed("unfocused", false);
            d3.selectAll(".edgePath").classed("unfocused", false);
            d3.select(this).classed("focused", false);

            d3.select(tooltipSelector)
                .style("top", "-500px")
                .style("left", "-500px")
        });
        d3.selectAll(".node").on("mousemove", function () {
            d3.select(tooltipSelector)
                .style("top", event.pageY + 20 + "px")
                .style("left", event.pageX + 20 + "px")
        });

        setTimeout(function () {
            readAndRenderGraph(date, containerId, tooltipId, zoom, refreshInterval)
        }, refreshInterval);
    })
}