class Node {
    constructor(params = {}) {
        let defaultParams = {
            id: "root", // id in history
            url: "",
            caption: "",
            iconUrl: "",
            startTime: -1, // timestamp
            endTime: -1, // timestamp
            totalTime: 0, // seconds
            visitCount: 1,
            isCollected: 0,
            isCopied: 0,
            type: "default", // default
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
        this.prev = defaultParams.prev
        this.succ = defaultParams.succ
    }
    infoHTML() {
        let html = "id: " + this.id + "<br>"
            + "url: " + this.url + "<br>"
            + "caption: " + this.caption + "<br>"
            + "iconUrl:" + this.iconUrl + "<br>"
            + "startTime: " + this.startTime + "<br>"
            + "endTime: " + this.endTime + "<br>"
            + "totalTime: " + this.totalTime + "<br>"
            + "visitCount: " + this.visitCount + "<br>"
            + "isCollected: " + this.isCollected + "<br>"
            + "isCopied: " + this.isCopied + "<br>"
            + "type: " + this.type + "<br>"
        return html
    }
    equal(node) {
        return this.id == node.id &&
        this.url == node.url &&
        this.caption == node.caption &&
        this.iconUrl == node.iconUrl &&
        this.isCollected == node.isCollected &&
        this.type == node.type &&
        this.prev.toString() == node.prev.toString() &&
        this.succ.toString() == node.succ.toString()
    }
}