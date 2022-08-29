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
    equal(edge) {
        return this.type == edge.type &&
        this.src == edge.src &&
        this.dst == edge.dst
    }
}