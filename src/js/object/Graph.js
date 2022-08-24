class Graph {
    constructor(params = {}) {
        let defaultParams = {
            head: 0,
            nodes: [new Node()],
            edges: []
        }
        if ("graph" in params) { // only pass parameter graph when constructing an instance from an existing object
            Object.assign(defaultParams, params.graph || {})
            // $.extend(defaultParams, params.graph)
            defaultParams.nodes = Array.from(defaultParams.nodes, (node) => new Node({ node: node }))
            defaultParams.edges = Array.from(defaultParams.edges, (edge) => new Edge({ edge: edge }))
        }
        else {
            Object.assign(defaultParams, params || {})
            // $.extend(defaultParams, params)
        }
        this.head = defaultParams.head
        this.nodes = defaultParams.nodes
        this.edges = defaultParams.edges
    }
    dagre() {
        let g = new dagreD3.graphlib.Graph()
            .setGraph({
                rankdir: 'LR'
            })
            .setDefaultEdgeLabel(function () { return {}; });
        this.nodes.forEach((node, index) => {
            g.setNode(index, {
                label: node.caption,
                style: "fill:#fff;stroke:#000"
            })
        })
        this.edges.forEach((edge, index) => {
            g.setEdge(edge.src, edge.dst, {
                style: "fill:#fff;stroke:#333;stroke-width:1.5px"
            })
        })
        return g
    }


    queryNode(field, value) { // query the node index by sepcific field e.g. queryNode("url", "https://www.example.com"). returns index if found, -1 otherwise
        let idx = -1
        this.nodes.forEach((node, index) => {
            if (node[field] == value) {
                idx = index
                return
            }
        })
        return idx
    }
    queryEdge(src, dst) { // query the edge index by id of src and dst. returns index if found, -1 otherwise
        let idx = -1
        for (let index = 0; index < this.edges.length; index++) {
            let edge = this.edges[index]
            if (edge.src == src && edge.dst == dst) {
                idx = index
                return
            }
        }
        return idx
    }
    addNode(node) { // add a new node into nodes. make sure the node is distinct from others by method queryNode
        let index = this.nodes.push(node) - 1
        return index
    }
    addEdge(edge) { // add a new edge into edges
        let index = this.edges.push(edge) - 1
        this.nodes[edge.src].succ.push(index)
        this.nodes[edge.dst].prev.push(index)
        return index
    }
    toggleSwitch(idx) {
        this.nodes.forEach((node, index) => {
            if (index == idx) {
                node.highlight = 1
            } else {
                node.highlight = 0
            }
        })
    }
}