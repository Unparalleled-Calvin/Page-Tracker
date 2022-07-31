class Edge {
    constructor(params = {}) {
        let defaultParams = {
            type: "default", // transition type
            time: -1, // timestamp
            src: -1, // index of node
            dst: -1, // index of node
        }
        if ("edge" in params) { // only pass parameter edge when constructing an instance from an existing object
            Object.assign(defaultParams, params.edge || {})
            // $.extend(defaultParams, params.edge)
        }
        else {
            Object.assign(defaultParams, params || {})
            // $.extend(defaultParams, params)
        }
        this.type = defaultParams.type
        this.time = defaultParams.time
        this.src = defaultParams.src
        this.dst = defaultParams.dst
    }
    mermaid(nodes, edges, seen) { // generate mermaid text
        let definition = ""
        // dst node definition
        if (!seen.has(this.dst) && this.dst != -1) {
            seen.add(this.dst)
            definition += nodes[this.dst].mermaid(nodes, edges, seen)
        }
        // own definition
        if (this.src != 0 && this.dst != 0) {
            let srcNode = nodes[this.src]
            let dstNode = nodes[this.dst]
            definition += srcNode.id + "-->" + dstNode.id + "\n" // use '-->' temporarily
        }
        return definition
    }
}