import React from 'react';
import { useNavigate } from 'react-router-dom';
import './archive.css';

export function Archive() {
    const navigate = useNavigate();
    
    const [stories, setStories] = React.useState([]);

    React.useEffect(() => {
        loadStories();
    }, []);

    async function loadStories() {
        let dbStories = [];
        try {
            const response = await fetch('/api/stories');
            dbStories = await response.json();
            if (response.ok) {
                localStorage.setItem('stories', JSON.stringify(dbStories));
            }
        } catch {
            const storiesText = localStorage.getItem('stories');
            if (storiesText) {
                dbStories = JSON.parse(storiesText);
            }
        }
        setStories(dbStories);    
    }

    let storyCards = [
        <div className="col-lg-4 col-md-12 mb-4">
            <div className="card">
              <div className="bg-image hover-overlay" data-mdb-ripple-init data-mdb-ripple-color="light">
                <img src="dojo.jpg" className="img-fluid" />
                <a onClick={() => newStory()}>
                  <div className="mask"></div>
                </a>
              </div>
              <div className="card-body">
                <h5 className="card-title">New Story</h5>
                <p className="card-text">
                  Unleash your creativity!
                </p>
                <a onClick={() => newStory()} className="btn btn-primary" data-mdb-ripple-init>Open</a>
              </div>
            </div>
        </div>
    ];
    if (stories.length > 0) {
        for (const [i, story] of stories.entries()) {
            storyCards.push(<StoryCard key={i} story={story} />);
        }
    }

    function newStory() {
        localStorage.removeItem('currentStory');
        navigate('/write');
     }    

    return (
        <main className="my-5">
            <div className="container">
              <section className="text-center">
                <p></p>
                <h4 className="mb-5"><strong>The Hall of Fame</strong></h4>        
                <div id="storyCards" className="row">{storyCards}</div>      
              </section>       
            </div>
        </main> 
    );
}

function StoryCard({ key, story }) {
    const navigate = useNavigate();

    function openStory(story) {
        localStorage.setItem('currentStory', JSON.stringify(story));
        navigate('/write');
    }

    return (
        <div key={key} className="col-lg-4 col-md-12 mb-4">
            <div className="card">
              <div className="bg-image hover-overlay" data-mdb-ripple-init data-mdb-ripple-color="light">
                <img src={story.image} className="img-fluid" />
                <a onClick={() => openStory(story)}>
                  <div className="mask"></div>
                </a>
              </div>
              <div className="card-body">
                <h5 className="card-title">{story.title}</h5>
                <p className="card-text">
                  {story.text.substring(0, 100)}...
                </p>
                <a onClick={() => openStory(story)} className="btn btn-primary" data-mdb-ripple-init>Open</a>
              </div>
            </div>
        </div> 
    );    
}
        