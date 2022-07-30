addScript("../js/object/History.js")
addScript("../js/object/Graph.js")
addScript("../js/object/Node.js")
addScript("../js/object/Edge.js")

addScript("../js/utils/graph.js")

window.onload = function () {
    getHistoryByDate(new Date()).then((history) => {
        history = new History({history: history})
        renderGraph("history", history.graph.mermaid()).then((svgId) => {
            draggable(svgId)
        })
    })
}