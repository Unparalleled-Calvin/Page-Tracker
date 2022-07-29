class Graph {
    constructor(params={}) {
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
    mermaid() { // generate mermaid text
        let definition = ""
        definition += "flowchart LR" + "\n"
        let seen = new Set()
        seen.add(this.head) // the caller is responsible for adding node index into set seen
        definition += this.nodes[this.head].mermaid(this.nodes, this.edges, seen)
        this.nodes.forEach((node, index) => { // normally there are no other connected components, add this code just for exception
            if (!seen.has(index)) {
                seen.add(index)
                definition += node.mermaid(this.nodes, this.edges, seen)
            }
        })
        return definition
    }
    queryNode(field, value) { // query the node index by sepcific field e.g. queryNode("url", "https://www.example.com"). returns index if found, -1 otherwise
        this.nodes.forEach((node, index) => {
            if(node[field] == value) {
                return index
            }
        })
        return -1
    }
    queryEdge(src, dst) { // query the edge index by id of src and dst. returns index if found, -1 otherwise
        for (let index = 0; index < this.edges.length; index++) {
            let edge = this.edges[index]
            if(edge.src == src && edge.dst == dst) {
                return index
            }
        }
        return -1
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
}