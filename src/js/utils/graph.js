async function renderGraph(id, definition) { // use or create a div with specific id. render the graph into it.
    let svgId = id + "-svg"
    await mermaid.mermaidAPI.render(svgId, definition, (svg) => {
        let element = document.getElementById(id)
        if (!element) {
            element = document.createElement("div")
            element.id = id
            document.body.append(element)
        }
        element.align = "center"
        element.style.position = "absolute"
        // element.style.transform = "translate(-100%,-50%)"
        element.style.width = "100%"
        element.style.height = "100%"
        element.innerHTML = svg
    })
    return svgId
}

function genRandomGraph(n) { // randomly generate a graph with n nodes with at least 2n edges
    let graph = new Graph()
    for (i = 1; i <= n; i++) {
        let node = new Node({ id: String(i), url: "https://www.example.com/" + i, caption: "Example" + i })
        graph.addNode(node)
    }
    for (i = 1; i <= 2 * n; i++) {
        let id1 = parseInt(Math.random() * (n + 1)), id2 = parseInt(Math.random() * (n + 1))
        let edge = new Edge({ src: id1, dst: id2 })
        if (graph.queryEdge(id1, id2) == -1) {
            graph.addEdge(edge)
        }
    }
    return graph
}

function draggable(containerId, svgId) {
    svgImage = document.getElementById(svgId);
    svgContainer = document.getElementById(containerId);

    let originalWidth = parseFloat(svgImage.clientWidth)
    let originalHeight = parseFloat(svgImage.clientHeight)

    svgImage.setAttribute("weight", svgContainer.clientWidth)
    svgImage.setAttribute("height", svgContainer.clientWidth)
    svgImage.style.maxWidth = svgContainer.clientWidth
    var viewBox = { x: (originalWidth - parseFloat(svgContainer.clientWidth))/2, y: (originalHeight - parseFloat(svgContainer.clientHeight))/2, w: svgImage.clientWidth, h: svgImage.clientHeight };
    svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    const svgSize = { w: svgImage.clientWidth, h: svgImage.clientHeight };
    var isPanning = false;
    var startPoint = { x: 0, y: 0 };
    var endPoint = { x: 0, y: 0 };;
    var scale = 1;

    svgContainer.onmousewheel = function (e) {
        e.preventDefault();
        var w = viewBox.w;
        var h = viewBox.h;
        var mx = e.offsetX;//mouse x  
        var my = e.offsetY;
        var dw = w * Math.sign(e.deltaY) * 0.05;
        var dh = h * Math.sign(e.deltaY) * 0.05;
        var dx = dw * mx / svgSize.w;
        var dy = dh * my / svgSize.h;
        viewBox = { x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w - dw, h: viewBox.h - dh };
        scale = svgSize.w / viewBox.w;
        svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
    }

    svgContainer.onmousedown = function (e) {
        isPanning = true;
        startPoint = { x: e.x, y: e.y };
    }

    svgContainer.onmousemove = function (e) {
        if (isPanning) {
            endPoint = { x: e.x, y: e.y };
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            var movedViewBox = { x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h };
            svgImage.setAttribute('viewBox', `${movedViewBox.x} ${movedViewBox.y} ${movedViewBox.w} ${movedViewBox.h}`);
        }
    }

    svgContainer.onmouseup = function (e) {
        if (isPanning) {
            endPoint = { x: e.x, y: e.y };
            var dx = (startPoint.x - endPoint.x)/scale;
            var dy = (startPoint.y - endPoint.y)/scale;
            viewBox = { x: viewBox.x + dx, y: viewBox.y + dy, w: viewBox.w, h: viewBox.h };
            svgImage.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
            isPanning = false;
        }
    }

    svgContainer.onmouseleave = function (e) {
        isPanning = false;
    }
}