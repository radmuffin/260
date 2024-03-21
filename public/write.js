function getUsername() {
    return localStorage.getItem('username') ?? 'login to save your work!';
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
        } else {
            this.blank = true;
            this.author = getUsername();
            this.contributors = [];
            this.text = '';
            this.title = '...enter the title first :)';
            this.lastWriter = null;
            this.image = 'chickens.jpg';
        }        
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
        else {  
            if (this.lastWriter === getUsername()) {
                document.querySelector('#prompt').textContent = 'let someone else write! :)';
                document.querySelector('#submitBtn').textContent = 'maybe?';
                // document.querySelector('#submitBtn').style.display = "none";

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

    getPic() {
        const random = Math.floor(Math.random() * 1000);
        fetch(`https://picsum.photos/v2/list?page=${random}&limit=1`)
            .then((response) => response.json())
            .then((data) => {
            const backgroundImgEl = document.querySelector('#storyImage');

            const width = backgroundImgEl.offsetWidth;
            const height = backgroundImgEl.offsetHeight;

            const imgUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}?blur=1`;
            this.image = imgUrl;
    });
    }

    addContributor(contributor) {
        if (!this.contributors.includes(contributor) && contributor !== 'login to save your work!') {
            this.contributors.push(contributor);
        }
    }

    async saveStory() {
        let stories = [];
        const storiesText = localStorage.getItem('stories');
        if (storiesText) {
            stories = JSON.parse(storiesText);
        }
        stories = this.updateThisToStories(this, stories);
        localStorage.setItem('stories', JSON.stringify(stories));
        let response;
        try {
            response = await fetch('/api/story', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(this),
            });
        } catch {
            const errMessegeEl = document.querySelector('#updateMess');
            errMessegeEl.textContent = 'Failed to save story to server :(';
        }
        if (response.ok) {
            localStorage.setItem('currentStory', JSON.stringify(this));
        } else {            
            const body = await response.json();
            const messegeEl = document.querySelector('#updateMess');
            messegeEl.textContent = `⚠ Error: ${body.msg}`;
        }
    }

    updateThisToStories(story, stories) {
        if (stories.length === 0) {
            stories.push(story);
            return stories;
        }
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
        this.getPic();
        if (this.blank) {
            this.title = inputText;
            this.blank = false;
        }
        else {
            this.text += ' ' + inputText;
            this.lastWriter = getUsername();
            this.addContributor(getUsername());
        }
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

