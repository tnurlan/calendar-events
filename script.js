document.addEventListener("DOMContentLoaded", function () {
    const eventForm = document.getElementById("event-form");
    const eventTitle = document.getElementById("event-title");
    const eventDate = document.getElementById("event-date");
    const eventCategory = document.getElementById("event-category");
    const eventsList = document.getElementById("events-list");
    const addEventBtn = document.getElementById("add-event-btn");
    const modal = document.getElementById("event-modal");
    const closeModal = document.querySelector(".close-btn");
    const searchInput = document.getElementById("search-events");

    const API_URL = "http://localhost:5000/events";

    async function fetchEvents() {
        const res = await fetch(API_URL);
        const events = await res.json();
        renderEvents(events);
    }

    function renderEvents(events) {
        eventsList.innerHTML = "";
        events.forEach(event => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event-card");
            eventDiv.setAttribute("data-category", event.category);
            eventDiv.innerHTML = `
                <span><strong>${event.title}</strong> - ${event.date} (${event.category})</span>
                <button class="delete-btn" onclick="deleteEvent('${event._id}')">❌</button>
            `;
            eventsList.appendChild(eventDiv);
        });
    }

    async function deleteEvent(id) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchEvents();
    }

    window.deleteEvent = deleteEvent;

    addEventBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    eventForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const newEvent = {
            title: eventTitle.value,
            date: eventDate.value,
            category: eventCategory.value,
        };

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEvent),
        });

        fetchEvents();
        modal.style.display = "none";
    });

    searchInput.addEventListener("input", async function () {
        const res = await fetch(API_URL);
        const events = await res.json();
        renderEvents(events.filter(event => event.title.toLowerCase().includes(this.value.toLowerCase())));
    });

    fetchEvents();
});
