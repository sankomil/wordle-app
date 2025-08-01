from datetime import datetime, timedelta
import random
import os
from flask import Flask, jsonify, request, session
from dotenv import load_dotenv
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session

from helpers import validate_string, update_word_pool

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

app.config['SESSION_TYPE'] = 'sqlalchemy'
app.config['SESSION_SQLALCHEMY'] = db
app.config['SESSION_COOKIE_PARTITIONED'] = True


Session(app)
frontend_url = os.getenv("FRONTEND_URL")

CORS(app, supports_credentials=True, origins=[frontend_url])

WORD_POOL = os.getenv("WORD_POOL").split(',')
WORD_POOL = [word.strip().upper() for word in WORD_POOL]
ATTEMPTS = int(os.getenv("ATTEMPTS"))



@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.before_request
def set_session_expiry_to_end_of_day():
    session.permanent = True
    now = datetime.now()
    midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    remaining = (midnight - now)
    app.permanent_session_lifetime = remaining

@app.route("/validate", methods=["POST"])
def validate_word():
    data = request.get_json()
    guess = data.get("guess").upper()
    turn = data.get("turn")

    if not guess or turn == None:
        return jsonify({"error": "Missing required fields"}), 400

    if len(guess) != 5:
        return jsonify({"error": "The guess should be five letters long"}), 400

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
    