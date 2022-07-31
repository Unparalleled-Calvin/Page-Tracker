addScript("js/object/History.js")
addScript("js/object/Graph.js")
addScript("js/object/Node.js")
addScript("js/object/Edge.js")

function testConstructor() {
    let history = new History({ date: "2022-07-28" })
    let graph = new Graph({ head: 1 })
    let node = new Node({ url: "www.example1.com", caption: "just for test html" })
    let edge = new Edge({ src: 2, dst: 3 })

    console.log(history)
    console.log(graph)
    console.log(node)
    console.log(edge)
}