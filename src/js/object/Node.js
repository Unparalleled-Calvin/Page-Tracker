class Node {
    constructor(params = {}) {
        let defaultParams = {
            id: "root", // id in history
            url: "",
            caption: "",
            iconUrl: "",
            // startTime: -1, // timestamp
            // endTime: -1, // timestamp
            totalTime: 0, // seconds
            visitCount: 1,
            isCollected: 0,
            // isCopied: 0,
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
        // this.startTime = defaultParams.startTime
        // this.endTime = defaultParams.endTime
        this.totalTime = defaultParams.totalTime
        this.visitCount = defaultParams.visitCount
        this.isCollected = defaultParams.isCollected
        // this.isCopied = defaultParams.isCopied
        this.type = defaultParams.type
        this.prev = defaultParams.prev
        this.succ = defaultParams.succ
    }
    infoHTML(debug = false) {
        let html
        if (debug) {
            html = "id: " + this.id + "<br>"
                + "url: " + this.url + "<br>"
                + "caption: " + this.caption + "<br>"
                + "iconUrl:" + this.iconUrl + "<br>"
                // + "startTime: " + this.startTime + "<br>"
                // + "endTime: " + this.endTime + "<br>"
                + "totalTime: " + this.totalTime + "s <br>"
                + "visitCount: " + this.visitCount + "<br>"
                + "isCollected: " + this.isCollected + "<br>"
                // + "isCopied: " + this.isCopied + "<br>"
                + "type: " + this.type + "<br>"
        }
        else {
            html = "Time&nbsp;&nbsp;&nbsp;&nbsp;:" + this.totalTime + "s<br>"
                 + "Count&nbsp;&nbsp;&nbsp;:" + this.visitCount + "<br>"
            if (this.isCollected)
                html += "Favorite:True<br>"
                         
        }
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
    genHrefTag(captionLimit) {
        let caption, hrefTag
        if (this.caption) {
            caption = this.caption
        }
        else if (this.url) {
            caption = this.url
        }
        else {
            caption = String(this.id)
        }
        if (caption.length > captionLimit) {
            let letterPattern = new RegExp("[A-Za-z]"); let firstLine = caption.substring(0, captionLimit)
            let cut1 = 1, cnt = 0, i
            for (i = 0; i < caption.length; i++) {
                if (caption.charCodeAt(i) > 255)
                    cnt += 2
                else
                    cnt += 1
                if (cnt >= captionLimit) {
                    cut1 = i
                    break
                }
            }
            while (cut1 > 1 && letterPattern.test(firstLine.charAt(cut1 - 1)))
                cut1--
            if (cut1 == 1)
                cut1 = i
            firstLine = caption.substring(0, cut1)
            let cut2 = caption.length
            cnt = 0
            for (; i < caption.length; i++) {
                if (caption.charCodeAt(i) > 255)
                    cnt += 2
                else
                    cnt += 1
                if (cnt >= captionLimit) {
                    cut2 = i
                    break
                }
            }
            while (cut2 > cut1 + 1 && letterPattern.test(firstLine.charAt(cut2 - 1)))
                cut2--
            if (cut2 == cut1 + 1)
                cut2 = i
            let secondLine = caption.substring(cut1, cut2) + (cut2 < caption.length ? "..." : "")
            hrefTag =
                "<div style=\"margin-left: 2px;\">" +
                "<a href=" + this.url + " target=_blank>" + firstLine + "</a>" +
                "<a href=" + this.url + " target=_blank>" + secondLine + "</a>" +
                "</div>"
        }
        else {
            hrefTag =
                "<div style=\"margin-left: 2px;\">" +
                "<a href=" + this.url + " target=_blank>" + caption + "</a>" +
                "</div>"
        }
        return hrefTag
    }
    genIconTag() {
        let iconTag = ""
        if (this.totalTime > 1800) {
            iconTag += "<div class=\"icon-star dwelltime-star\">🟊</div>"
        }
        if (this.visitCount > 2) {
            iconTag += "<div class=\"icon-star launch-star\">🟊</div>"
        }
        if (this.isCollected) {
            iconTag += "<div class=\"icon-star collect-star\">🟊</div>"
        }
        return iconTag
    }
    genLabel(captionLimit, imgSize) {
        let hrefTag = this.genHrefTag(captionLimit)
        let imgTag = this.iconUrl ? "<img src=\"" + this.iconUrl + "\" width=\"" + imgSize + "px\" height=\"" + imgSize + "px\">" : ""
        let iconTag = this.genIconTag()
        let label = "<div style=\"display: flex; align-items: center; justify-content: center; min-height: 32px; min-width: 32px;\">" + imgTag + hrefTag + iconTag + "</div>"
        return label
    }
}