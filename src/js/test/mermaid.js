mermaid.mermaidAPI.initialize({ startOnLoad:false, securityLevel: "loose"}); 

function testMermaid() {
    let graph = new Graph()
    
    let node1 = new Node({id:"a", url:"https://www.example.com/1", caption: "Example1"})
    let node1_id = graph.addNode(node1)
    let edge1 = new Edge({src:0, dst: node1_id})
    graph.addEdge(edge1)

    let node2 = new Node({id:"b", url:"https://www.example.com/2", caption: "Example2"})
    let node2_id = graph.addNode(node2)
    let edge2 = new Edge({src:0, dst: node2_id})
    graph.addEdge(edge2)
    
    let node3 = new Node({id:"c", url:"https://www.example.com/3", caption: "Example3"})
    let node3_id = graph.addNode(node3)
    let edge3 = new Edge({src:node2_id, dst: node3_id})
    graph.addEdge(edge3)

    let definition = graph.mermaid()
    document.body.style.height = "500px"
    document.body.style.width = "500px"
    renderGraph("graphDiv", definition)
}