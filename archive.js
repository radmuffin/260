function getUsername() {
    return localStorage.getItem('username') ?? 'john doe';
}

const usernameEl = document.querySelector('#currentUser');
usernameEl.textContent = getUsername();