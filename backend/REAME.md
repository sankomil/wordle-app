# Backend
This application hosts all the validation logic for the system. It manages sessions, stores game state, as well as provides API endpoints for the frontend to interact with. The project consists of the following:

- app.py: File. The main page from where our flask application runs. It defines all the available endpoints, as well as sets up our app with the necessary configurations. It also calls the necessary functions
- helpers: Folder. Holds functions necessary for validating each guess. The validation logic uses Absurdle rules. Each function has a comment explaining what it does

## Validation
The validation is done using Absurdle game's logic. The system takes on a more adversarial role, cheating by not choosing a solution at the start of the game. Instead, at each guess, it removes all words from its pool that would have any score, thus ensuring it gives as few hints as possible to the user.

However, once it becomes impossible to maintain a pool of words that has score=0, the system makes a decision by randomly choosing a word from the group of words with the smallest current score.

### Trade-off
There is a possibility to try and delay the choosing of the words until much later in some instances. For example if the guess is 'cache', and the pool consists of 'allow', 'array', 'tails', 'cache', 'catch' we could still maintain a pool of 3 words, and return `_?___`. However this would have added additional complexity to the solution, and I wanted to focus on a deliverable solution. Perhaps with more time the exploration of this solution would be feasible

## Bells & whistles
I have added additional features to the project to make a smoother experience for the user. They were sourced from a need to properly implement Absurdle logic, as well as also trying to match NYT Wordle's experience.

### Session
This was the first time I used sessions - especially flask sessions. Flask has an automatic system for managing cookies, and I made use of its library to manage those for me. With simple setup needed from my side, I was able to manage sessions that allowed for more features to be implemented.

My biggest reason for using sessions was to store the remaining word pool. Though this could technically be one on the frontend, there were two issues; the potential size of the word pool can be extremely large - while there are a possible ~11.9 million combinations possible, most of them are not actual words and thus should likely not be included in the word pool. Taking Wordle as reference, it has a [solution pool of 14855 words](https://fiveletterwordfinder.com/faq/words) - which could easily eat away localStorage space. The second being the fact that the client should *not* be able to find out that the system is cheating. While the layperson would likely not look inside Dev Tools, it only takes a few savvy users to figure out that something is fishy with the games logic.

Thus I turned to PostGreSQL, having had some experience using it professionally, and being able to easily use it as a storage option for sessions using flask-sessions library which managed that for me. This resolved both concerns I had. Postgres as a limit of 1GB for each row, which is more than enough to store the word pool.

The session also persists only for 24 hours. This is again done to mimic Wordle, where the solution is resets at 12 AM everyday. Thus this will ensure that users can come back on a new day and start from a renewed word pool

### Game state storage
This was particularly inspired by the NYT Wordle app. Looking into the localStorage on the website, and you will find that the website stores the gamestate there. This is a feasible solution for Wordle, since it has a limit of max 6 tries, meaning there is unlikely to be more than 30 characters that need to be saved. However, since there is no limit on the number of attempts we allow the user, this would make the stored state to be quite large, and thus also slow down the browser. Thus I found server storage to be a better solution, one that did not impact user experience too drastically while also allowing for large storage.

## Trade-offs

The project is currently dependent on a secondary resource (a PSQL DB) for session management. This potentially incurs a cost when it comes to deploying the solution, especially as it is scaled further. However the alternative, which would be to store session details in server runtime, would not be scaleable at all, and this I find this alternative to be much more acceptable. Furthermore, by doing a daily prune of the databases to remove expired tokens we can ease the server size.