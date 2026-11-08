
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const profileView = document.getElementById("profileView");
const accountTabs = document.getElementById("accountTabs");

const formMessage = document.getElementById("formMessage");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const logoutBtn = document.getElementById("logoutBtn");


// SWITCH FORMS
function switchForm(form) {

    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (form === "register") {
        loginForm.hidden = true;
        registerForm.hidden = false;

        loginTab.classList.remove("active");
        registerTab.classList.add("active");

    } else {
        registerForm.hidden = true;
        loginForm.hidden = false;

        registerTab.classList.remove("active");
        loginTab.classList.add("active");
    }
}

loginTab.addEventListener("click", () => switchForm("login"));
registerTab.addEventListener("click", () => switchForm("register"));

showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    switchForm("register");
});

showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchForm("login");
});


// GET REGISTERED USERS
function getUsers() {
    return JSON.parse(localStorage.getItem("inductraUsers")) || [];
}


// REGISTER
registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();

    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        showMessage("Passwords do not match.");
        return;
    }

    const users = getUsers();

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        showMessage("This email is already registered.");
        return;
    }

    try {
        const passwordHash = await hashPassword(password);

        users.push({
            name: name,
            email: email,
            passwordHash: passwordHash
        });

        localStorage.setItem("inductraUsers", JSON.stringify(users));

        showMessage("Registration successful! You can now log in.", true);

        registerForm.reset();

        setTimeout(() => switchForm("login"), 1200);

    } catch (error) {
        showMessage("Unable to complete registration in this browser.");
    }
});


// HASH PASSWORD FOR THIS DEMO
async function hashPassword(password) {
    if (!window.crypto?.subtle) {
        throw new Error("Secure browser context required.");
    }

    const data = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// LOGIN
loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(user => user.email === email);

    if (!user) {
        showMessage("Account not found. Please register first.");
        return;
    }

    try {
        const passwordHash = await hashPassword(password);

        if (user.passwordHash !== passwordHash) {
            showMessage("Incorrect password.");
            return;
        }

        sessionStorage.setItem("inductraCurrentUser", JSON.stringify({
    name: user.name,
    email: user.email
}));

loginForm.reset();

window.location.href = "index.html";

    } catch (error) {
        showMessage("Unable to log in using this browser.");
    }
});


// DISPLAY PROFILE
function showProfile() {

    const currentUser = JSON.parse(
        sessionStorage.getItem("inductraCurrentUser")
    );

    if (!currentUser) return;

    loginForm.hidden = true;
    registerForm.hidden = true;
    accountTabs.hidden = true;

    profileView.hidden = false;

    document.getElementById("profileName").textContent =
        `Welcome, ${currentUser.name}!`;

    document.getElementById("profileEmail").textContent =
        currentUser.email;

    formMessage.textContent = "";
}


logoutBtn.addEventListener("click", () => {

    sessionStorage.removeItem("inductraCurrentUser");

    profileView.hidden = true;
    accountTabs.hidden = false;

    loginForm.reset();
    registerForm.reset();

    switchForm("login");
    showMessage("You have logged out successfully.", true);
});


// DISPLAY MESSAGE
function showMessage(message, success = false) {

    formMessage.textContent = message;
    formMessage.className = success
        ? "form-message success"
        : "form-message";
}


// CHECK EXISTING SESSION
showProfile();
