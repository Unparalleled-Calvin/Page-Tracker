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

        var render = new dagreD3.render();

        g = history.graph.dagre()

        var svg = d3
            .select(containerSelector)
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight)
        var svgGroup = svg.append("g");
        let zoom = d3.zoom()
            .on("zoom", function () {
                svgGroup.attr("transform", d3.event.transform);
            });
        svg.call(zoom);
        render(d3.select(containerSelector + " g"), g);

        let gBox= d3.select(containerSelector + " g").node().getBoundingClientRect()
        svg.attr("viewBox", "" + (gBox.width - window.innerWidth) / 2 + " " + (gBox.height - window.innerHeight) / 2 + " " + window.innerWidth + " " + window.innerHeight) // show svg in center
    })
}

window.onresize = function () {
    let containerId = "history"
    let containerSelector = "#" + containerId
    d3.select(containerSelector)
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight)
}