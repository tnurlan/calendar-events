document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:5000";
    
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    const loginContainer = document.querySelector(".auth-container");
    const registerContainer = document.getElementById("register-container");

    document.getElementById("show-register").addEventListener("click", () => {
        loginContainer.classList.add("hidden");
        registerContainer.classList.remove("hidden");
    });

    document.getElementById("show-login").addEventListener("click", () => {
        registerContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    });

    // **Регистрация пользователя**
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;

        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
        alert(data.message || data.error);
        if (res.ok) {
            window.location.href = "login.html";
        }
    });

    // **Вход пользователя**
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            alert(data.error);
        }
    });

    // **Защита страниц (если нет токена, перенаправляем на login.html)**
    if (window.location.pathname === "/index.html" && !localStorage.getItem("token")) {
        window.location.href = "login.html";
    }
});

async function login(email, password) {
    console.log("Отправка данных:", { email, password });

    const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("Ответ от сервера:", data); // ✅ Проверяем, что сервер отвечает

    if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    } else {
        alert(data.error);
    }
}
