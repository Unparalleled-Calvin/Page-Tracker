let containerId = "history"
let tooltipId = "tooltip"
let zoom = d3.zoom()
let refreshInterval = 3000

let refreshEvent = new CustomEvent('refresh', {})

window.addEventListener('refresh', function () {
    refreshPage(date, containerId, tooltipId, zoom, refreshInterval);
}, false);

window.onload = function () {
    window.dispatchEvent(refreshEvent)
}
