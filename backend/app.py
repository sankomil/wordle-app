from datetime import datetime, timedelta
import random
import os
from flask import Flask, Response, jsonify, request, session
from dotenv import load_dotenv
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session

from helpers import validate_string, update_word_pool

load_dotenv()

# Load environment variables for session maintainance
# SECRET_KEY is used for creating session IDs
# The PostGreSQL database is being used to save session details
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SESSION_SQLALCHEMY'] = db
app.config['SESSION_COOKIE_PARTITIONED'] = True


Session(app)
frontend_url = os.getenv("FRONTEND_URL")

# Allow frontend to pass credentials. If this is not done then fronten cannot pass cookies to server
CORS(app, supports_credentials=True, origins=[frontend_url])

WORD_POOL = os.getenv("WORD_POOL").split(',')
WORD_POOL = [word.strip().upper() for word in WORD_POOL]
ATTEMPTS = int(os.getenv("ATTEMPTS"))


# Ensure proper headers are added. Necessary for pre-flight checks
@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response

# Before each request, update the cookie's expiry, ensuring that it is always valid until midnight of current day
# This is done so that the gamestate only persists for 24 hours, following NYT Wordle's ideology
@app.before_request
def set_session_expiry_to_end_of_day():
    session.permanent = True
    now = datetime.now()
    midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    remaining = (midnight - now)
    app.permanent_session_lifetime = remaining

# Returns a saved game state for current session if it exists. Otherwise returns blank array and string
@app.route("/get-session", methods=["GET"])
def get_previous_sesion():
    previous_guesses = session.get("previous_guesses", [])
    solution = session.get("possible_words")
    game_over = session.get("game_over")

    return jsonify({"guesses": previous_guesses, "solution": solution[0] if game_over else ""}), 200

# Validation call. It updates the game state in session
# If a word pool already exists for the session, it is passed for validation, otherwise we use the entire word bank (i.e. when new session is started)
# The solution is only returned if the game is over - decided based on number of tries and if user guessed the word correctly
@app.route("/validate", methods=["POST"])
def validate_word():
    data = request.get_json()
    guess = data.get("guess").strip().upper()
    turn = data.get("turn")

    if not guess or turn == None:
        return Response( "Missing required fields", 400)

    if len(guess) != 5:
        return Response("The guess should be 5 letters long", 500)

    if guess not in WORD_POOL:
        return Response("Guess is not a valid word", 400)

    possible_words = session.get("possible_words", WORD_POOL)
    previous_guesses = session.get("previous_guesses", [])
    
    if len(possible_words) > 1:
        possible_words = update_word_pool(possible_words, guess)

    validation = validate_string(guess=guess, solution=possible_words[0])
    previous_guesses.append(validation)

    session['possible_words'] = possible_words
    session['previous_guesses'] = previous_guesses

    return_sol = possible_words[0] if (len(possible_words) == 1 and possible_words[0] == guess) or turn+1 == ATTEMPTS else ""

    session["game_over"] = return_sol != ""
    
    return jsonify({
        "validated_guess": validation,
        "solution": return_sol
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    