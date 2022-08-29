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
            let labelLimit = 20
            let label
            if (node.caption) {
                label = node.caption.substring(0, labelLimit) + (node.caption.length > labelLimit ? "..." : "")
            }
            else if (node.url) {
                label = node.url.substring(0, labelLimit) + (node.url.length > labelLimit ? "..." : "")
            }
            else {
                label = String(node.id)
            }
            g.setNode(index, {
                labelType: "html",
                label: "<a href=" + node.url + " target=_blank>" + label + "</a>",
                class: node.type
            })
            if (!node.prev.length && index) {
                g.setEdge(0, index, {
                    class: "default",
                })
            }
        })
        this.edges.forEach((edge, index) => {
            g.setEdge(edge.src, edge.dst, {
                class: edge.type,
            })
        })

        g.nodes().forEach(function (v) {
            var node = g.node(v);
            node.rx = node.ry = 5;
        });

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
    equal(graph) {
        if (this.nodes.length != graph.nodes.length) {
            return false
        }
        if (this.edges.length != graph.edges.length) {
            return false
        }
        for (let i=0; i<this.nodes.length; i++) {
            if (!this.nodes[i].equal(graph.nodes[i])) {
                return false
            }
        }
        for (let i=0; i<this.edges.length; i++) {
            if (!this.edges[i].equal(graph.edges[i])) {
                return false
            }
        }
        return true
    }
}