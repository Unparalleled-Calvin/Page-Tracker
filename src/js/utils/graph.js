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

function centerSvgAroundElement(svg, g, node) {
    let gBox = g.node().getBoundingClientRect()
    let svgBox = svg.node().getBoundingClientRect()
    let nodeBox = node.node().getBoundingClientRect()
    svg.attr("viewBox", "" + (nodeBox.x + nodeBox.width / 2 - gBox.x - svgBox.width / 2) + " " + (nodeBox.y + nodeBox.height / 2 - gBox.y - svgBox.height / 2) + " " + svgBox.width + " " + svgBox.height)
}

let previousTransform
let firstDisplay = true
let previousGraph

function readAndRenderGraph(date, containerId, tooltipId, zoom) {
    getHistoryByDate(date).then(function (history) {
        history = new History({ history: history })
        let containerSelector = "#" + containerId
        let tooltipSelector = "#" + tooltipId

        let render = new dagreD3.render();

        let graph = history.graph

        if (previousGraph && !graph.equal(previousGraph) || !previousGraph) {

            let g = graph.dagre()

            let svg = d3
                .select(containerSelector)
                .html("<g></g>")
                .attr("width", "100%")
                .attr("height", "100%")
            render(d3.select(containerSelector + " g"), g);
            let svgGroup = d3.select(containerSelector + " g")
            zoom.on("zoom", function () {
                previousTransform = d3.event.transform
                svgGroup.attr("transform", d3.event.transform);
            });
            let transform
            if (previousTransform) {
                transform = d3.zoomIdentity
                    .scale(previousTransform.k)
                    .translate(
                        previousTransform.x / previousTransform.k,
                        previousTransform.y / previousTransform.k
                    )
            }
            else {
                transform = d3.zoomIdentity
            }
            svg.call(zoom.transform, transform);
            svg.call(zoom);

            if (firstDisplay) {
                firstDisplay = false
                centerSvgAroundElement(
                    d3.select(containerSelector),
                    d3.select(containerSelector + " g"),
                    d3.select(".node.highlight").node() ? d3.select(".node.highlight") : d3.select(".node")
                )
            
            }
        }

        d3.selectAll(".node").on("mouseenter", function (id) {
            d3.selectAll(".node").classed("unfocused", true);
            d3.selectAll(".edgePath").classed("unfocused", true);
            d3.selectAll(".node").classed("normal", false);
            d3.selectAll(".edgePath").classed("normal", false);
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
            d3.selectAll(".node").classed("normal", true);
            d3.selectAll(".edgePath").classed("normal", true);
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

        previousGraph = graph
    })
}

function refreshPage(date, containerId, tooltipId, zoom) {
    previousTransform = undefined
    firstDisplay = true
    readAndRenderGraph(date, containerId, tooltipId, zoom)
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key.substring(0, keyPrefix.length) == keyPrefix) {
        readAndRenderGraph(date, containerId, tooltipId, zoom)
      }
    }
});

// this function is for debugging
function _renderGraph(graph) {
    let containerSelector = "#" + containerId
    let g = graph.dagre()

    let render = new dagreD3.render();
    let svg = d3
        .select(containerSelector)
        .html("<g></g>")
        .attr("width", "100%")
        .attr("height", "100%")
    render(d3.select(containerSelector + " g"), g);
    let svgGroup = d3.select(containerSelector + " g")
    zoom.on("zoom", function () {
        previousTransform = d3.event.transform
        svgGroup.attr("transform", d3.event.transform);
    });
    let transform
    if (previousTransform) {
        transform = d3.zoomIdentity
            .scale(previousTransform.k)
            .translate(
                previousTransform.x / previousTransform.k,
                previousTransform.y / previousTransform.k
            )
    }
    else {
        transform = d3.zoomIdentity
    }
    svg.call(zoom.transform, transform);
    svg.call(zoom);
}