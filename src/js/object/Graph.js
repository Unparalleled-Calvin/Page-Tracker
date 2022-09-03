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
        this.tidyGraph()
        let g = new dagreD3.graphlib.Graph()
            .setGraph({
                rankdir: 'LR'
            })
            .setDefaultEdgeLabel(function () { return {}; });
        this.nodes.forEach((node, index) => {
            if (node.type != "wasted") {
                g.setNode(index, {
                    labelType: "html",
                    label: node.genLabel(30, 20),
                    class: node.type
                })
            }
        })
        this.edges.forEach((edge, index) => {
            if (edge.type != "wasted") {
                g.setEdge(edge.src, edge.dst, {
                    class: edge.type,
                })
            }
        })

        g.nodes().forEach(function (v) {
            var node = g.node(v);
            node.rx = node.ry = 5;
        });

        return g
    }
    tidyGraph() { // supplement edges, clean arrays
        this.nodes.forEach((node, index) => {
            node.prev = Array.from(new Set(node.prev))
            node.succ = Array.from(new Set(node.succ))
        })
        this.nodes.forEach((node, index) => {
            if (node.type != "wasted" && !node.prev.length && index) {
                let edgeIndex = this.addEdge(new Edge({ src: 0, dst: index }))
                node.prev.push(edgeIndex)
                this.nodes[0].succ.push(edgeIndex)
            }
        })
        return this
    }
    queryNode(field, value) { // query the node index by sepcific field e.g. queryNode("url", "https://www.example.com"). returns index if found, -1 otherwise
        let idx = -1
        this.nodes.forEach((node, index) => {
            if (node[field] == value && node.type != "wasted") {
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
            if (edge.src == src && edge.dst == dst && edge.type != "wasted") {
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
            if (node.type == "wasted") {
                // do nothing
            } else {
                if (index == idx) {
                    node.type = "highlight"
                } else {
                    node.type = "default"
                }
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
        for (let i = 0; i < this.nodes.length; i++) {
            if (!this.nodes[i].equal(graph.nodes[i])) {
                return false
            }
        }
        for (let i = 0; i < this.edges.length; i++) {
            if (!this.edges[i].equal(graph.edges[i])) {
                return false
            }
        }
        return true
    }
    mergeNode(index1, index2) { // merge node1 into node2
        let node1 = this.nodes[index1]
        let node2 = this.nodes[index2]
        node1.type = "wasted"
        node1.prev.forEach((edgeIndex, index) => {
            let edge = this.edges[edgeIndex]
            if (this.queryEdge(edge.src, index2) != -1 || edge.src == index2) { // exists edge from prev to node2
                edge.type = "wasted"
            }
            else {
                edge.dst = index2
                node2.prev.push(edgeIndex)
            }
        })
        node1.succ.forEach((edgeIndex, index) => {
            let edge = this.edges[edgeIndex]
            if (this.queryEdge(index2, edge.dst) != -1 || edge.dst == index2) { // exists edge from node2 to dst
                edge.type = "wasted"
            }
            else {
                edge.src = index2
                node2.succ.push(edgeIndex)
            }
        })
        return this.nodes
    }
    markNode(index) { // recursively mark "default"
        let node = this.nodes[index]
        if (node.type != "default") {
            node.type = "default"
            node.succ.forEach((edgeIndex, index) => {
                this.markEdge(edgeIndex)
            })
        }
    }
    markEdge(index) { // recursively mark "default"
        let edge = this.edges[index]
        if (edge.type != "default") {
            edge.type = "default"
            this.markNode(edge.dst)
        }
    }
    exchangeNode(index1, index2) { // exchange node1 and node2
        this.nodes[index1].prev.forEach((edgeIndex, index) => {
            this.edges[edgeIndex].dst = index2
        })
        this.nodes[index1].succ.forEach((edgeIndex, index) => {
            this.edges[edgeIndex].src = index2
        })
        this.nodes[index2].prev.forEach((edgeIndex, index) => {
            this.edges[edgeIndex].dst = index1
        })
        this.nodes[index2].succ.forEach((edgeIndex, index) => {
            this.edges[edgeIndex].src = index1
        })
        let node = this.nodes[index1]
        this.nodes[index1] = this.nodes[index2]
        this.nodes[index2] = node
    }
    subGraph(rootIndex) { // generate a subgraph with index as root
        this.tidyGraph()
        let subgraph = new Graph({ graph: this }) // deep copy self
        subgraph.nodes.forEach((node, index) => {
            node.type = "wasted"
        })
        subgraph.edges.forEach((edge, index) => {
            edge.type = "wasted"
        })
        subgraph.markNode(rootIndex)
        subgraph.nodes.forEach((node, index) => {
            if (this.nodes[index].type == "highlight" && node.type == "default") {
                node.type = "highlight"
            }
        })
        subgraph.exchangeNode(0, rootIndex)
        return subgraph
    }
}