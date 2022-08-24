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