document.addEventListener("DOMContentLoaded", function () {
    const calendarView = document.getElementById("calendar-view");
    const monthPicker = document.getElementById("month-picker");

    let events = JSON.parse(localStorage.getItem("events")) || [];

    function generateCalendar(year, month) {
        calendarView.innerHTML = "";

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDay = firstDay.getDay(); 

        const monthName = firstDay.toLocaleString("ru", { month: "long" });
        let html = `<h2>${monthName} ${year}</h2>`;

        // Добавляем заголовки дней недели
        html += `
            <div class="calendar-header">
                <div>Пн</div>
                <div>Вт</div>
                <div>Ср</div>
                <div>Чт</div>
                <div>Пт</div>
                <div>Сб</div>
                <div>Вс</div>
            </div>
            <div class="calendar-grid">
        `;

        // Добавляем пустые ячейки перед началом месяца
        for (let i = 1; i < startDay; i++) {
            html += `<div class="calendar-cell empty"></div>`;
        }

        // Заполняем календарь числами
        for (let day = 1; day <= daysInMonth; day++) {
            const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = events.filter(event => event.date === date);

            let eventHTML = "";
            dayEvents.forEach(event => {
                eventHTML += `<span class="event-marker">${event.title}</span>`;
            });

            html += `<div class="calendar-cell">${day}${eventHTML}</div>`;
        }

        html += `</div>`; // Закрываем сетку
        calendarView.innerHTML = html;
    }

    // При смене месяца обновляем календарь
    monthPicker.addEventListener("change", function () {
        const [year, month] = monthPicker.value.split("-");
        generateCalendar(parseInt(year), parseInt(month) - 1);
    });

    const today = new Date();
    monthPicker.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    generateCalendar(today.getFullYear(), today.getMonth());
});
