function getUsername() {
    return localStorage.getItem('username') ?? 'john doe';
}

// set username
const usernameEl = document.querySelector('#currentUser');
usernameEl.textContent = getUsername();

function newStory() {
    localStorage.removeItem('currentStory');
    window.location.href = "write.html";
}