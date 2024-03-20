(async () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        const usernameEl = document.querySelector('#currentUser');
        usernameEl.textContent = userName;
        setDisplay('signedOut', 'none');
        setDisplay('signedIn', 'block');
    } else {
        setDisplay('signedOut', 'block');
        setDisplay('signedIn', 'none');
    }
  })();

async function login() {
    await loginOrCreate("api/auth/login");
}

async function create() {
    await loginOrCreate("api/auth/create");
}

function play() {
    window.location.href = "archive.html";
}

function logout() {
    localStorage.removeItem("username");
    fetch("api/auth/logout", { method: "delete" }).then(() => (window.location.href = "/"));
}

async function loginOrCreate(endpoint) {
    const usernameEl = document.querySelector("#username");
    const passwordEl = document.querySelector("#password");

    const response = await fetch(endpoint, {
        mehod: 'POST',
        headers: { 'content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
            username: usernameEl.value,
            password: passwordEl.value
        })
    })

    if (response.ok) {
        localStorage.setItem("username", usernameEl.value);
        window.location.href = "archive.html";
    } else {
        const body = await response.json();
        const messegeEl = document.querySelector("#headerText");
        messegeEl.textContent = `⚠ Error: ${body.msg}`
    }

}

function setDisplay(controlId, display) {
    const playControlEl = document.querySelector(`#${controlId}`);
    if (playControlEl) {
      playControlEl.style.display = display;
    }
  }

const passwordEl = document.querySelector("#password");
passwordEl.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        login();
    }
});