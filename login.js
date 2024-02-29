function login() {
    const usernameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");
    // save username and password to a user object in database later
    localStorage.setItem("username", usernameEl.value);
    localStorage.setItem("password", passwordEl.value);
    window.location.href = "archive.html";
}

const passwordEl = document.querySelector("#password");
passwordEl.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        login();
    }
});