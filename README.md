# 3 Story Word

### Elevator pitch

You know that game where you're making a story with your friends, but you only get to add like three stories at a time? It never goes where you want, and something rediculous usually happens as far as the plot right? Well you're in luck because we have not fixed that problem! We're making it available to you and your friends all across the globe! Just hop on 3 Story Word, make an account, connect to your friends and with three words at a time spin fantastical stories together, alone! You'll love it, we promise :)) 

### Design TODO

![Mock](voterMockUI.jpg)

Here is a sequence diagram that shows how to people would interact with the backend to write a story.

![Voting sequence diagram](votingSequenceDiagram.png)

### Key features

- Secure login over HTTPS
- Connect with your friends
- Each friend gets a turn to add to the story
- Display of past stories
- See the current story as it's written in real time
- Ability for a user to save the story to read later
- Stories are persistently stored

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Uses correct HTML structure for application. Two HTML pages. One for login and one for voting. Hyperlinks to choice artifact.
- **CSS** - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
- **JavaScript** - Provides login, choice display, applying votes, display other users votes, backend endpoint calls.
- **Service** - Backend service with endpoints for:
  - login
  - adding friends
  - retrieving stories
  - submitting your three words
  - retrieving updated story
- **DB/Login** - Store users, friends lists and stories in database. Register and login users. Credentials securely stored in database. Can't contribute unless authenticated and friends with the story creator
- **WebSocket** - As each user contributes, the story is updated for everyone
- **React** - Application ported to use the React web framework.

## HTML deliverable

➡️ The following is an example of the required information for the `Startup HTML` deliverable

For this deliverable I built out the structure of my application using HTML.

- **HTML pages** - Two HTML page that represent the ability to login and vote.
- **Links** - The login page automatically links to the voter page. The voter page contains links for every voting choice.
- **Text** - Each of the voting choices is represented by a textual description.
- **Images** - I couldn't figure out how to include an image and so I didn't do this. 😔
- **DB/Login** - Input box and submit button for login. The voting choices represent data pulled from the database.
- **WebSocket** - The count of voting results represent the tally of realtime votes.

##### [notes](https://github.com/radmuffin/startup/blob/main/notes.md)
