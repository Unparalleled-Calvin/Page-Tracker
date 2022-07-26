class Edge {
    constructor(params) {
        let defaultParams = {
            type: "default", // transition type
            time: -1, // timestamp
            src: -1, // index of node
            dst: -1, // index of node
        }
        if("edge" in params) { // only pass parameter edge when constructing an instance from an existing object
            $.extend(defaultParams, params.edge)
        }
        else {
            $.extend(defaultParams, params)
        }
    }
}