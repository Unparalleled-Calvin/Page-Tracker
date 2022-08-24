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

        var svg = d3.select(containerSelector);
        
        var svgGroup = svg.append("g");

        let zoom = d3.zoom()
            .on("zoom", function () {
                svgGroup.attr("transform", d3.event.transform);
            });
        svg.call(zoom);

        render(d3.select(containerSelector + " g"), g);

        document.getElementById(containerId).style.width = window.innerWidth
        document.getElementById(containerId).style.height = window.innerHeight
    })
}

window.onresize = function() {
    let containerId = "history"
    document.getElementById(containerId).style.width = window.innerWidth
    document.getElementById(containerId).style.height = window.innerHeight
}