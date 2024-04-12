import React from 'react';
import './write.css';

export function Write( { username } ) {
    const storageStory = localStorage.getItem('currentStory');
    let story = null;
    let isBlank = true;
    if (storageStory) {
        story = JSON.parse(storageStory);
        isBlank = false;
    }
    const [blank, setBlank] = React.useState(isBlank);
    const [title, setTitle] = React.useState(!storageStory ? '...enter the title first :)' : story.title);
    const [text, setText] = React.useState(!storageStory ? '' : story.text);
    const [image, setImage] = React.useState(!storageStory ? 'chickens.jpg' : story.image);
    const [contributors, setContributors] = React.useState(!storageStory ? [] : story.contributors);
    const author = !storageStory ? username : story.author;
    const [lastWriter, setLastWriter] = React.useState(!storageStory ? null : story.lastWriter);

    const [prompt, setPrompt] = React.useState(!storageStory ? 'title your masterpiece!' : lastWriter === username ? 'hey you just wrote!' : 'add to the story!');
    const [message, setMessage] = React.useState('');

    let socket = null;

    React.useEffect(() => {
        socket = configureWebSocket();
    }, []);

    async function getPic() {
        const random = Math.floor(Math.random() * 1000);
        fetch(`https://picsum.photos/v2/list?page=${random}&limit=1`)
            .then((response) => response.json())
            .then((data) => {
            const backgroundImgEl = document.querySelector('#storyImage');

            const width = backgroundImgEl.offsetWidth;
            const height = backgroundImgEl.offsetHeight;

            const imgUrl = `https://picsum.photos/id/${data[0].id}/${width}/${height}?blur=1`;
            setImage(imgUrl);
    });
    }

    function addContributor(contributor) {
        if (!contributors.includes(contributor)) {
            setContributors([...contributors, contributor]);
        }
    }

    function makeStoryObject() {
        return {
            title: title,
            text: text,
            image: image,
            author: author,
            lastWriter: lastWriter,
            contributors: contributors,
        };
    }

    function updateThisToStories(story, stories) {
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

    async function saveStory() {
        let stories = [];
        const storiesText = localStorage.getItem('stories');
        if (storiesText) {
            stories = JSON.parse(storiesText);
        }
        stories = updateThisToStories(makeStoryObject(), stories);
        localStorage.setItem('stories', JSON.stringify(stories));
        let response;
        try {
            response = await fetch('/api/story', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify(makeStoryObject()),
            });
        } catch {
            setMessage('Failed to save story to server :(');
        }
        if (response.ok) {
            localStorage.setItem('currentStory', JSON.stringify(makeStoryObject()));
        } else {            
            const body = await response.json();
            setMessage(`⚠ Error: ${body.msg}`);
        }
    }

    async function input() {
        const inputEl = document.querySelector('#inputText')
        let inputText = inputEl.value;
        inputEl.value = '';
        getPic();
        if (blank) {
            setTitle(inputText);
            setBlank(false);
            setPrompt('add to the story!');
        }
        else {
            setText(text + ' ' + inputText);
            setLastWriter(username);
            addContributor(username);
            // send through websocket
            broadcastEdit(inputText);
            setPrompt('write on!')
            saveStory();
        }
        
    }

    function configureWebSocket() {
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
        socket.onopen = () => {
            broadcastJoin();
            setMessage('connected XD');
        };
        socket.onclose = (event) => {
            setMessage('disconnected :(');
        }
        socket.onmessage = async (event) => {
            const data = JSON.parse(await event.data.text());
            if (data.title === title) {
                if (data.text) {
                    webSocketEdit(data.text, data.author, data.image);
                }
                setMessage(data.message);
            } else {
                setMessage(data.altMsg);
            }            
        };
        return socket;
    }

    function webSocketEdit(inText, inAuthor, image) {
        setText(text + ' ' + inText);
        setLastWriter(inAuthor);
        addContributor(inAuthor);
        // timing of getPic() combined with this leaves the image as the last one set by the user :'/
        // this.image = image;
    }

    function broadcastJoin() {
        const sendTitle = blank ? 'a new story' : title;
        const stuff = {
            title: sendTitle,
            message: username + ' opened the story!',
            altMsg: username + ' opened ' + sendTitle + '!',
        };
        socket.send(JSON.stringify(stuff));
    }

    function broadcastEdit(edit) {
        const stuff = {
            text: edit,
            title: title,
            image: image,
            author: username,
            message: username + ' added to the story!',
            altMsg: username + ' edited ' + title + '!',
        };
        socket.send(JSON.stringify(stuff));
    }


    return (
    <main className="my-5">
        <div id="storyImage" className="bg-image shadow-2-strong" style={{backgroundImage: `url(${image})`}}>
            <div className="mask">        
                <div className="container d-flex align-items-center justify-content-center text-center h-100">
                    <div className="text-white" data-mdb-theme="dark">

                        <h1 id="storyTitle" className="mb-5"><strong>{title}</strong></h1>

                        <p id="storyText" className="card-text">
                          {text}</p>

                        <h5 id="updateMess" className="mb-5">{message}</h5>

                        <div className="form-outline" data-mdb-input-init>                                        
                          <input type="text" id="inputText" className="form-control" />
                          <label id="prompt" className="form-label" htmlFor="inputText">     ...write here...   </label>
                          <button type="submit" id="submitBtn" className="btn btn-primary btn-block mb-4" onClick={() => input()} data-mdb-ripple-init>{prompt}</button>

                        </div>
                        <h5 id="credits" className="mb-5">created by: {author}. contributions from: {contributors.join(', ') + '.'}</h5>          

                    </div>          
                </div>
            </div>
        </div>
    </main>     
  );

}