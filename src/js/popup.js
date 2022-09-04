let containerId = "history"
let tooltipId = "tooltip"
let zoom = d3.zoom()

let refreshEvent = new CustomEvent('refresh', {})

window.addEventListener('refresh', function () {
    refreshPage(date, containerId, tooltipId, zoom);
}, false);

window.onload = function () {
    generateCalendar(date)
    adjustWindow()
    window.dispatchEvent(refreshEvent)
}
