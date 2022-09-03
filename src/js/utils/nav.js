function foldSideBar() {
    d3.select(".sidebar").style("width", "0%");
    d3.select(".content").style("left", "0%");
    d3.select(".content").style("width", "100%");
    d3.select(".toggle-button").classed("active", false);
}

function unfoldSideBar() {
    d3.select(".sidebar").style("width", "25%");
    d3.select(".content").style("left", "25%");
    d3.select(".content").style("width", "75%");
    d3.select(".toggle-button").classed("active", true);
}

d3.select(".toggle-button").on("click", function () {
    if (d3.select(this).classed("active")) {
        foldSideBar()
    }
    else {
        unfoldSideBar()
    }
})

d3.select(".clear-button").on("click", function () {
    let to_delete = confirm("Clear data in " + formatDate(date, "yyyy-MM-dd") + "?");
    if (to_delete) {
        chrome.runtime.sendMessage({ name: "delete", date: formatDate(date, "yyyy-MM-dd") }, function (response) {
            if (response.status != "ok") {
                alert("Failed!")
            }
        });
    }
})

function unfoldCalendar() {
    d3.select(".calendar").style("opacity", "100%").style("z-index", "1")
}

function foldCalendar() {
    d3.select(".calendar").style("opacity", "0%").style("z-index", "-1")
}

d3.select(".calendar-button").on("click", function () {
    if (d3.select(".calendar").style("opacity") == "0") {
        unfoldCalendar()
    }
    else {
        foldCalendar()
    }
})

d3.select(".calendar").on("mouseleave", function () {
    foldCalendar()
})

function adjustWindow() {
    if (window.innerWidth < 950) {
        d3.select(".logo").style("display", "none")
    }
    else {
        d3.select(".logo").style("display", "block")
    }
    if (window.innerWidth < 800 || window.innerHeight < 350) {
        foldSideBar()
    }
    else {
        unfoldSideBar()
    }
}

window.onresize = function () {
    adjustWindow()
}