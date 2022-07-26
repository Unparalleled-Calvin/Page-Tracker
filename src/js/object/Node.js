class Node {
    constructor(params) {
        let defaultParams = {
            id: "",
            url: "",
            caption: "",
            iconUrl: "",
            startTime: -1, // timestamp
            endTime: -1, // timestamp
            totalTime: -1, // seconds
            type: "default", // default
            prev: [], // index of edges
            succ: [], // index of edges
        }
        if("node" in params) { // only pass parameter node when constructing an instance from an existing object
            $.extend(defaultParams, params.node)
        }
        else {
            $.extend(defaultParams, params)
        }
        this.id = defaultParams.id
        this.url = defaultParams.url
        this.caption = defaultParams.caption
        this.iconUrl = defaultParams.iconUrl
        this.startTime = defaultParams.startTime
        this.endTime = defaultParams.endTime
        this.totalTime = defaultParams.totalTime
        this.type = defaultParams.type
        this.prev = defaultParams.prev 
        this.succ = defaultParams.succ
    }
}