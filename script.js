
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.textContent = isOpen ? "✕" : "☰";

});



document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.textContent = "☰";

    });

});

document.addEventListener("DOMContentLoaded", () => {

    const accountArea = document.getElementById("accountArea");

    if (!accountArea) return;

    const currentUser = JSON.parse(
        sessionStorage.getItem("inductraCurrentUser")
    );

    if (currentUser) {

        accountArea.innerHTML = `
            <div class="logged-in-account">
                <a href="account.html" class="account-link">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="19" height="19"
                         viewBox="0 0 24 24"
                         fill="none" stroke="currentColor"
                         stroke-width="2"
                         stroke-linecap="round"
                         stroke-linejoin="round">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M5 21a7 7 0 0 1 14 0"/>
                    </svg>

                    <span>${escapeHtml(currentUser.name)}</span>
                </a>
            </div>
        `;

    }

});

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}
