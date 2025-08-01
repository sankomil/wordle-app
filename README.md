# Wordle App

This project is a recreation of the NYT Wordlegame. It servers to demonstrate my skillset with Python an TypeScript. The project consists of two applications, one each for backend and frontend. The layout of the project is as such:

```
.
├── backend
│   ├── app.py
│   ├── helpers
├── frontend
│   ├── package.json
│   ├── public
│   ├── src
│   │   ├── App
│   │   ├── components
│   │   │   ├── GameBoard
│   │   │   ├── Keypad
│   │   │   ├── Letter
│   │   │   ├── Word
│   │   ├── helpers
│   │   ├── hooks
│   │   └── types
│   │   │   ├── axios
│   │   │   └── components
│   ├── tsconfig.json
│   └── yarn.lock
└── README.md
```

## Libraries used

### Backend

1. **Flask**: Flask is Python framework that allows users to make web applications quickly. Due to previous experience with the Framework as well as the vast array of community supported libraries available for it I opted for this framework.
2. **Flask-SQLAlchemy**: This library is an extension for Flask and allows me to easily access the DB. With this library DB queries become much easier and streamlined.
3. **Python-Dotenv**: Adds `.env` support to Flask projects. Rather than directly adding all environment variables in the `app.py` file I can now import them from an external file, thus allowing for more privacy when uploading to Git management websites as well as change variables depending on deployment environment.
4. **Flask-Cors:** A Flask extension for handling Cross-Origin Resource Sharing (CORS), making it possible to send cross-origin requests. I am using it to resolve issues with pre-flight checks from frontend.
5. **Flask-Session:** An extension for Flask that adds support for server-side sessions. I am using it for maintaining the word pool for each session, as well as storing gamestate on a database.

### Frontend

1. **React**: One of the most popular JavaScript libraries for building web application. Past experience and vast community support were deciding factors in its selection, as well as the free form approach it provides to building projects.
2. **Typescript**: Making the project strongly typed and reducing inevitable bugs that would have caused issues at runtime.
3. **Axios**: The library provides functions to make API calls. Along with this it provides easier management for error states.

## Running the project

The requirement for this project is as follows:

- **Python:** 3.12.5
- **pip:** 24.0
- **Node:** 22.14.0
- **Yarn:** 1.22.22

**Warning**. Please do not try to use `npm` with this project as it does not contain a package lock file. Doing so may result in errors when installing packages.

```shell
git clone https://github.com/sankomil/wordle-app.git
cd wordle-app
```

### Backend

Open a new terminal and run the following commands:

```shell
cd backend
virtualenv venv
source ./venv/bin/activate
pip install -r requirements.txt
```

Once all requirements have been installed, make sure that the `.env` file in the backend folder is populated properly. Refer to the `.env` file under `backend` folder for reference.

Before running the app, please ensure your DB is up and running, and acessable with the credentials provided in `.env`

Make sure you are still in the `backend` directory. Now we can start the project with:

```python
flask run
```

This will run the backend application on port `5000`

### Frontend

Open a new terminal and run the following commands:

```shell
cd frontend
yarn
```

Once all requirements have been installed, populate the `.env` file for the frontend as well. Refer to the `.env` file under folder `frontend` for reference.

Still remaining in the `frontend` directory, run:

```node
yarn start
```

This will run the frontend application on port `3000`

With both projects up and running you are now free to explore the application. This project implements the following tasks:

- Task 1: A Wordle game that matches the scoring system for the NYT Wordle game
- Task 2: A client-server relationship, with all validation occurring on the server side
- Task 3: Absurdle. An antagonistic validation pattern that does not choose a solution at game start, but rather maintains a pool of potential solutions based on user input

README under the frontend and backend folder discuss each task and implementation ideology in further detail.

## Docker
This project also supports containerization. Make sure that the `.env` files are filled out correctly in both frontend and backend folders. Then in your terminal:

```shell
cd wordle-app
docker compose up --build
```

If you are running this on Linux, you may need to use the `sudo` command.

## Future enhancements
The following are improvements I'd like to make the project:

- Enhanced responsiveness: Currently the application is best suited for desktop browsers. I would want to use Bootstrap to make the implementation easier - though it does constrain the styling
- CI/CD pipeline:
    - Github workflows: Setup a Github workflow to run on a new release. This would build and deploy the solution to the hosting portal of choice.
        - I have not implemented this currently because it would not be possible to test this solution with my current implementation - with my DB running locally. Furthermore, it would incur hosting charges.
- Testing: Currently the project has no testing. I would want to implement this for better coverage, as well as also use it for further maintainability. As more developers are added to the project, code quality and integration will become extremely important. Thus testing would be necessary