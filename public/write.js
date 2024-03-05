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
            // this.addContributor(getUsername());
        } else {
            this.blank = true;
            this.author = getUsername();
            this.contributors = [];
            this.text = '';
            this.title = '...enter the title first :)';
            this.lastWriter = null;
        }        
        this.image = 'chickens.jpg';    // gonna be api later
    }

    setupStory() {
        const titleEl = document.querySelector('#storyTitle');
        titleEl.textContent = this.title;
        const textEl = document.querySelector('#storyText');
        textEl.textContent = this.text;
        const imageEl = document.querySelector('#storyImage');
        imageEl.style.backgroundImage = "url(" + this.image + ")";
        // todo: if no contributors, give alternative text
        const creditsEl = document.querySelector('#credits');
        creditsEl.textContent = 'created by: ' + this.author + '. contributions from: ' + this.contributors.join(', ') + '.';
        if (this.blank) {
            document.querySelector('#prompt').textContent = 'title your masterpiece!';
            document.querySelector('#submitBtn').textContent = 'enter';
        }
        else {  // todo: change if went last to not display input? (style.display = "none")
            if (this.lastWriter === getUsername()) {
                document.querySelector('#prompt').textContent = '...it should be someone else\'s turn';
                document.querySelector('#submitBtn').textContent = 'but writer interaction ain\'t ready yet, so write on alone :(';

            }
            else {
                document.querySelector('#prompt').textContent = 'add to the story!';
                document.querySelector('#submitBtn').textContent = 'submit';
            }
            
        }
    }

    loadStory(storyJSON) {
        const parsedStory = JSON.parse(storyJSON);
        this.title = parsedStory.title;
        this.text = parsedStory.text;
        this.lastWriter = parsedStory.lastWriter;
        this.contributors = parsedStory.contributors;
        this.author = parsedStory.author;
        this.image = parsedStory.image;
        this.blank = false;
    }

    addContributor(contributor) {
        if (!this.contributors.includes(contributor)) {
            this.contributors.push(contributor);
        }
    }

    async saveStory() {//TODO: combind with saveStoryLocal, save all stories not just current
                        //also write the actual endpoint
        try {
            await fetch('/api/story', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(this),
            });
        } catch {
            // todo: show error message
        }
    }

    saveStoryLocal() {
        let stories = [];
        const storiesText = localStorage.getItem('stories');
        if (storiesText) {
            stories = JSON.parse(storiesText);
        }
        stories = this.updateStories(this, stories);
        localStorage.setItem('stories', JSON.stringify(stories));
        localStorage.setItem('currentStory', JSON.stringify(this));
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

    async input() {
        const inputEl = document.querySelector('#inputText')
        let inputText = inputEl.value;
        inputEl.value = '';
        if (this.blank) {
            this.title = inputText;
            this.blank = false;
        }
        else {
            this.text += ' ' + inputText;
            this.lastWriter = getUsername();
            this.addContributor(getUsername());
        }
        this.saveStoryLocal();
        this.saveStory();
        this.setupStory();
    }
}

const story = new Story();
story.setupStory();

const inputField = document.querySelector('#inputText');
inputField.addEventListener('keyup', function (event) {
    if (event.code === 'Enter') {
        story.input();
    }
});




// simulate websocket notifications
setInterval(() => {
    const id = Math.floor(Math.random() * 100);
    const messegeEl = document.querySelector('#updateMess');
    if (id % 3 === 0) {
        messegeEl.textContent = 'author#' + id + ' added to the story!';
    }
    else if (id % 3 === 1) {
        messegeEl.textContent = 'author#' + id + ' joined the story!';
    }
    else {
        messegeEl.textContent = 'author#' + id + ' liked the story!';
    }
}, 4000);

