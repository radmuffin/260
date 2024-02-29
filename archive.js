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

function openStory(story) {
    localStorage.setItem('currentStory', JSON.stringify(story));
    window.location.href = "write.html";
}

function loadStories() {
    const storyCardsEl = document.querySelector('#storyCards');

    let stories = [];
    const storiesText = localStorage.getItem('stories');
    if (storiesText) {
        stories = JSON.parse(storiesText);

        for (const story of stories) {

            const colLg4 = document.createElement('div');
            colLg4.className = "col-lg-4 col-md-12 mb-4";
            const card = document.createElement('div');
            card.className = "card";
            const imgOverlay = document.createElement('div');
            imgOverlay.className = "bg-image hover-overlay";
            imgOverlay.setAttribute('data-mdb-ripple-init', '');
            imgOverlay.setAttribute('data-mdb-ripple-color', 'light');
            const img = document.createElement('img');
            img.className = "img-fluid";
            img.src = story.image;
            const clickableA = document.createElement('a');
            clickableA.onclick = function () {
                openStory(story);
            }
            const mask = document.createElement('div');
            mask.className = "mask";
            mask.style.backgroundColor = "rgba(251, 251, 251, 0.15)";

            clickableA.appendChild(mask);
            imgOverlay.appendChild(img);
            imgOverlay.appendChild(clickableA);
            card.appendChild(imgOverlay);

            const cardBody = document.createElement('div');
            cardBody.className = "card-body";
            const h5 = document.createElement('h5');
            h5.className = "card-title";
            h5.textContent = story.title;
            const p = document.createElement('p');
            p.className = "card-text";
            if (story.text.length > 100) {
                p.textContent = story.text.substring(0, 100) + '...';
            } else {
                p.textContent = story.text;
            }
            const button = document.createElement('a');
            button.className = "btn btn-primary";
            button.setAttribute('data-mdb-ripple-init', '');
            button.textContent = "Open";
            button.onclick = function () {
                openStory(story);
            }

            cardBody.appendChild(h5);
            cardBody.appendChild(p);
            cardBody.appendChild(button);
            card.appendChild(cardBody);
            colLg4.appendChild(card);
            storyCardsEl.appendChild(colLg4);
        }
    }
}

loadStories();