function getUsername() {
    return localStorage.getItem('username') ?? 'john doe';
}

// set username
const usernameEl = document.querySelector('#currentUser');
usernameEl.textContent = getUsername();

class Story {
    blank;
    title;
    text;
    image;
    contributors;
    author;
    lastWriter;

    constructor() {
        const storageStory = localStorage.getItem('currentStory');
        if (storageStory) {
            this.loadStory(storageStory);
            this.addContributor(getUsername());
        } else {
            this.blank = true;
            this.author = getUsername();
            this.contributors = [this.author];
            this.text = '';
            this.title = '...enter the title first :)';
            this.lastWriter = null;
        }        
        this.image = 'chickens.jpg';    // gonna be api later
        // setupStory();        
    }

    setupStory() {
        const titleEl = document.querySelector('#storyTitle');
        titleEl.textContent = this.title;
        const textEl = document.querySelector('#storyText');
        textEl.textContent = this.text;
        const imageEl = document.querySelector('#storyImage');
        imageEl.style.backgroundImage = "url(" + this.image + ")";
        // todo: add contributors and author
        if (this.blank) {
            document.querySelector('#prompt').textContent = 'title your masterpiece!';
            document.querySelector('#submitBtn').textContent = 'enter';
        }
        else {  // todo: change if went last
            document.querySelector('#prompt').textContent = 'add to the story!';
            document.querySelector('#submitBtn').textContent = 'submit';
        }
    }

    loadStory(storyJSON) {
        const parsedStory = JSON.parse(storyJSON);
        this.title = parsedStory.title;
        this.text = parsedStory.text;
        this.lastWriter = parsedStory.lastWriter;
        this.blank = false;
    }

    addContributor(contributor) {
        if (!this.contributors.includes(contributor)) {
            this.contributors.push(contributor);
        }
    }

    saveStory() {
        let stories = [];
        const storiesText = localStorage.getItem('stories');
        if (storiesText) {
            stories = JSON.parse(storiesText);
        }
        stories = this.updateStories(this, stories);

    }

    updateStories(story, stories) {
        const index = stories.findIndex(s => s.title === story.title);
        if (index > -1) {
            stories[index] = story;
        } else {
            stories.push(story);
        }
        return stories

    }

    input() {
        const inputEl = document.querySelector('#inputText')
        let inputText = inputEl.value;
        inputEl.value = '';
        if (this.blank) {
            this.title = inputText;
            this.blank = false;
        }
        else {

        }
        this.saveStory();
        this.setupStory();
    }
}

const story = new Story();
story.setupStory();
