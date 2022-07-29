function renderGraph(id, definition) { // use or create a div with specific id. render the graph into it.
    mermaid.mermaidAPI.render(id + "-svg", definition, (svg) => {
        let element = document.getElementById(id)
        if (!element) {
            element = document.createElement("div")
            element.id = id
            document.body.append(element)
        }
        element.innerHTML = svg
    })
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