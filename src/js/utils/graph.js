async function renderGraph(id, definition) { // use or create a div with specific id. render the graph into it.
    let svgId = id + "-svg"
    await mermaid.mermaidAPI.render(svgId, definition, (svg) => {
        let element = document.getElementById(id)
        if (!element) {
            element = document.createElement("div")
            element.id = id
            document.body.append(element)
        }
        element.align = "center"
        element.style.position = "absolute"
        element.style.left = "50%"
        element.style.top = "50%"
        element.style.transform = "translate(-50%,-50%)"
        element.innerHTML = svg
    })
    return svgId
}

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