class History {
    constructor(params = {}) {
        let defaultParams = {
            date: formatDate(new Date(), "yyyy-MM-dd"),
            graph: new Graph()
        }
        if ("history" in params) { // only pass parameter history when constructing an instance from an existing object
            Object.assign(defaultParams, params.history || {})
            // $.extend(defaultParams, params.history)
            defaultParams.graph = new Graph({
                graph: defaultParams.graph
            })
        }
        else {
            Object.assign(defaultParams, params || {})
            // $.extend(defaultParams, params)
        }
        this.date = defaultParams.date
        this.graph = defaultParams.graph
    }
}