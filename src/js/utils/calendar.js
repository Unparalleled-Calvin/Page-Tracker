const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Augus",
    "Septemb",
    "October",
    "November",
    "December"
];

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let date = new Date();

function getCurrentDate(element) {
    if (element) {
        console.log("?")
        return element.value = formatDate(date, "yyyy-MM-dd").substr(0, 10);
    }
    return date;
}


function generateCalendar() {

    const calendar = document.getElementById("calendar");
    if (calendar) {
        calendar.remove();
    }

    const table = document.createElement("table");
    table.id = "calendar";

    const trHeader = document.createElement("tr");
    trHeader.className = "weekends";
    weekdays.map(week => {
        const th = document.createElement("th");
        const w = document.createTextNode(week.substring(0, 3));
        th.appendChild(w);
        trHeader.appendChild(th);
    });

    table.appendChild(trHeader);

    const weekDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    ).getDay();

    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();

    let tr = document.createElement("tr");
    let td = "";
    let empty = "";
    let btn = document.createElement("button");
    let week = 0;

    while (week < weekDay) {
        td = document.createElement("td");
        empty = document.createTextNode(" ");
        td.appendChild(empty);
        tr.appendChild(td);
        week++;
    }

    for (let i = 1; i <= lastDay;) {
        while (week < 7) {
            td = document.createElement("td");
            let text = document.createTextNode(i);
            btn = document.createElement("button");
            btn.className = "btn-day";
            btn.addEventListener("click", function () { changeDate(this) });
            week++;


            if (i <= lastDay) {
                i++;
                btn.appendChild(text);
                td.appendChild(btn)
            } else {
                text = document.createTextNode(" ");
                td.appendChild(text);
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);

        tr = document.createElement("tr");

        week = 0;
    }
    document.getElementById("calendar-table").appendChild(table);
    changeActive();
    changeHeader(date);
    document.getElementById("date").textContent = date;
    getCurrentDate(document.getElementById("date"));
}

function setDate(form) {
    let newDate = new Date(form.date.value);
    date = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
    generateCalendar();
    return false;
}

function changeHeader(dateHeader) {
    const month = document.getElementById("month-header");
    if (month.childNodes[0]) {
        month.removeChild(month.childNodes[0]);
    }
    const headerMonth = document.createElement("h1");
    const textMonth = document.createTextNode(months[dateHeader.getMonth()].substring(0, 3) + " " + dateHeader.getFullYear());
    headerMonth.appendChild(textMonth);
    month.appendChild(headerMonth);
}

function changeActive() {
    let btnList = document.querySelectorAll("button.active");
    btnList.forEach(btn => {
        btn.classList.remove("active");
    });
    btnList = document.getElementsByClassName("btn-day");
    for (let i = 0; i < btnList.length; i++) {
        const btn = btnList[i];
        if (btn.textContent === (date.getDate()).toString()) {
            btn.classList.add("active");
        }
    }
}

function resetDate() {
    date = new Date();
    generateCalendar();
}

function changeDate(button) {
    let newDay = parseInt(button.textContent);
    date = new Date(date.getFullYear(), date.getMonth(), newDay, 1);
    generateCalendar();
}

function nextMonth() {
    date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    generateCalendar(date);
}

function prevMonth() {
    date = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    generateCalendar(date);
}


function prevDay() {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, date.getHours());
    console.log(123)
    generateCalendar();
}

function nextDay() {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, date.getHours());
    generateCalendar();
}

document.onload = generateCalendar(date);

$("#prevDay").on("click", function() {
    prevDay()
})

$("#resetDate").on("click", function() {
    resetDate()
})

$("#nextDay").on("click", function() {
    nextDay()
})

$("#prevMonth").on("click", function() {
    prevMonth()
})

$("#nextMonth").on("click", function() {
    nextMonth()
})

$("#date-submit").on("click"), function() {
    changeDate($(this))
}