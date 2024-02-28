function getUsername() {
    return localStorage.getItem('username') ?? 'john doe';
}

const usernameEl = document.querySelector('#currentUser');
usernameEl.textContent = getUsername();

class Story {
    title;
    text;
    image;
    lastWriter;

    constructor() {
        const storageStory = JSON.parse(localStorage.getItem('currentStory'));
        // need to account for new story option
        this.title = storageStory.title;
        this.text = storageStory.text;
        this.image = 'chickens.jpg';
        this.lastWriter = storageStory.lastWriter;
    }
}

