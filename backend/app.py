import random
import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

WORD_POOL = os.getenv("WORD_POOL").split(',')
SELECTED_WORD = random.choice(WORD_POOL).strip().upper()
ATTEMPTS = int(os.getenv("ATTEMPTS"))

turns = 0

print(SELECTED_WORD, ATTEMPTS)

@app.route("/create-session", methods=["POST"])
def create_session():
    from services import SessionHandler
    session = SessionHandler(SELECTED_WORD).create_session()
    return jsonify({"id":session.id})

@app.route("/validate", methods=["POST"])
def validate_word():
    data = request.get_json()
    guess = data.get("guess").upper()

    if not guess:
        return jsonify({"error": "Guess not provided"}), 400

    if len(guess) != 5:
        return jsonify({"error": "The guess should be five letters long"}), 400

    sol_array = list(SELECTED_WORD)
    validated_guess = [{"value": letter, "status": "invalidated"} for letter in guess]

    for i, letter_obj in enumerate(validated_guess):
        if sol_array[i] == letter_obj["value"]:
            sol_array[i] = None
            validated_guess[i]["status"] = "correct"


    for i, letter_obj in enumerate(validated_guess):
        if letter_obj["status"] == "correct":
            continue

        try:
            letter_index = sol_array.index(letter_obj["value"])
            sol_array[letter_index] = None
            validated_guess[i]["status"] = "misplaced"
        except ValueError:
            validated_guess[i]["status"] = "incorrect"
    


    return jsonify({
        "validated_guess": validated_guess,
        "turn": turns,
        "attempts": ATTEMPTS,
        "game_over": turns == ATTEMPTS or guess == SELECTED_WORD,
        "victory": guess == SELECTED_WORD
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    