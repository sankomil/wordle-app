# Frontend
This application is the user interface for the game. It consists of a single screen, with limited styling to make the user experience as non-invasive as possible. The project consists of the following:

- App.tsx: File. The index page of the application. It pulls together the Gameboard and Keypad components
- hooks: Folder. Stores the `useWordle` hook. Further explanation on its functionality below
- components: Folder. Stores the various components required for the game
- helpers: Folder. Stores axios call functions
- types: Folder. Stores the various interfaces and types defined for this project. A central repository from where we can easily fetch any relevant type needed for the project

## useWordle
I have opted to create a React Hook for maintaining game state, as well as do any validation. I prefer it over a global context, as I only have a single page and thus do not have to worry about state propagation from parent to children to a high extent. 

Furthermore, hooks allow me to control which states I make visible, thus allowing me to run functions to update the states, which can then be used by the components for changes to the interface

### States
- guesses: Previous guesses that have been made. It stores the validation state for each letter for each word
- solution: A string state that is only populated when the game ends. It is used for showing the solution when the player loses
- turn: Counts the current turn of the game
- currentGuess: A string that maintains the current guess that the player is typing
- previousLetter: A validation for each letter that has previously been used. This is updated after each guess to ensure that any letters entered previously are updated if their validation has been updated
- error: A string to handle server errors and show them to user
- gameOver: Object state to show whether the game is finished or not, and if user won or lost

### Functions
Explanation for each function is given in comments above each function implementation

## Bells and whistles - Feedback animations on user input
My primary focus for improvement was the user interface. In particular I quite liked the way the Wordle app implemented revealing the validation for each letter in the guess.

### Tile flip on validation
Thus I implemented a flip keyframe for each letter, changing its background colour during the flip to show the validation. This tile flip also occurs on the keypad as well, where all validated keys flip and have their colours changed, thus giving user the opportunity to easily see what previous letters have been used.

### Tile bounce on input
I have also added a slight bounce when the user inputs a letter. This gives a slight feedback on input.

### Shudder on error
My third improvement was adding a shudder on error. When the user enters a word that is not considered valid by the server - i.e. not part of the word bank - the current guess row shifts momentarily from side to sie, the border colour changing to red. This informs user that the input was invalid, allowing them to try again without moving the turn

## Trade-off

Currently my gamestate is all stored on the server-side - thus making the process of updating gamestate on page refresh/open a little slower. This is because of the possible number of attempts that can be added. The localStorage has a limitation that, as I understand, is different from browser to browser. Furthermore, storing large amounts of data in localStorage can slow down the browser, which also made it unsuitable as a potential option for storing game state. While this would be a satisfactory solution if the number of attempts was fixed and limited - as is the case for NYT Wordle - the possibility of the attempts being flexible made me consider server side storage as a more suitable solution