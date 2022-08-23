class Node {
    constructor(params = {}) {
        let defaultParams = {
            id: "root", // id in history
            url: "",
            caption: "",
            iconUrl: "",
            startTime: -1, // timestamp
            endTime: -1, // timestamp
            totalTime: -1, // seconds
            visitCount: 0,
            isCollected: 0,
            isCopied: 0,
            type: "default", // default
            highlight: 0,
            prev: [], // index of edges
            succ: [], // index of edges
        }
        if ("node" in params) { // only pass parameter node when constructing an instance from an existing object
            Object.assign(defaultParams, params.node || {})
            // $.extend(defaultParams, params.node)
        }
        else {
            Object.assign(defaultParams, params || {})
            // $.extend(defaultParams, params)
        }
        this.id = defaultParams.id
        this.url = defaultParams.url
        this.caption = defaultParams.caption
        this.iconUrl = defaultParams.iconUrl
        this.startTime = defaultParams.startTime
        this.endTime = defaultParams.endTime
        this.totalTime = defaultParams.totalTime
        this.visitCount = defaultParams.visitCount
        this.isCollected = defaultParams.isCollected
        this.isCopied = defaultParams.isCopied
        this.type = defaultParams.type
        this.highlight = defaultParams.highlight
        this.prev = defaultParams.prev
        this.succ = defaultParams.succ
    }
    mermaid(nodes, edges, seen) { // generate mermaid text
        let definition = ""
        // successive edges definition
        this.succ.forEach(edgeIndex => {
            definition += edges[edgeIndex].mermaid(nodes, edges, seen)
        })
        // own definition
        let id = this.id
        let url = this.url ? this.url : " "
        let caption = this.caption ? this.caption : url
        caption = caption.length > 20 ? caption.substring(0, 20) + "..." : caption
        definition += id + "[\"" + caption + "\"]" + "\n" // define the caption displayed of the node
        definition += "click " + id + " href \"" + url + "\" _blank" + "\n" // define the click event of the node, currently 'href'
        return definition
    }
}