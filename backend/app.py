import random
import os
from flask import Flask, jsonify, request, make_response
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

from helpers import validate_string

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
db = SQLAlchemy(app)

WORD_POOL = os.getenv("WORD_POOL").split(',')
SELECTED_WORD = random.choice(WORD_POOL).strip().upper()
ATTEMPTS = int(os.getenv("ATTEMPTS"))


print(SELECTED_WORD, ATTEMPTS)


@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.route("/validate", methods=["POST"])
def validate_word():
    data = request.get_json()
    guess = data.get("guess").upper()
    turn = data.get("turn")

    if not guess or turn == None:
        return jsonify({"error": "Missing required fields"}), 400

    if len(guess) != 5:
        return jsonify({"error": "The guess should be five letters long"}), 400

    from services import SessionHandler

    session = SessionHandler().fetch_session(solution=SELECTED_WORD)

    validated_guess = validate_string(guess=guess, solution=session.solution)
    
    return jsonify({
        "validated_guess": validated_guess,
        "solution": session.solution if int(turn) + 1 == ATTEMPTS or session.solution == guess else ""
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
    