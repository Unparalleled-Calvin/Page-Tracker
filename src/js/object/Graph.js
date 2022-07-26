class Graph {
    constructor(params) {
        let defaultParams = {
            head: 0,
            nodes: [new Node()],
            edges: []
        }
        if("graph" in params) { // only pass parameter graph when constructing an instance from an existing object
            $.extend(defaultParams, params.graph)
            defaultParams.nodes = Array.from(defaultParams.nodes, (node) => new Node({node: node}))
            defaultParams.edges = Array.from(defaultParams.edges, (edge) => new Edge({edge: edge}))
        }
        else {
            $.extend(defaultParams, params)
        }
        this.head = defaultParams.head
        this.nodes = defaultParams.nodes
        this.edges = defaultParams.edges
    }
}