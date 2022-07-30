class History {
    constructor(params = {}) {
        let defaultParams = {
            date: formatDate(new Date(), "yyyy-MM-dd"),
            graph: new Graph()
        }
        if("history" in params) { // only pass parameter history when constructing an instance from an existing object
            $.extend(defaultParams, params.history)
            defaultParams.graph = new Graph({
                graph: defaultParams.graph
            })
        }
        else {
            $.extend(defaultParams, params)
        }
        this.date = defaultParams.date
        this.graph = defaultParams.graph
    }
}