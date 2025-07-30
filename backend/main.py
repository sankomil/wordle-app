import random
import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

WORD_POOL = os.getenv("WORD_POOL").split(',')
SELECTED_WORD = random.choice(WORD_POOL)
ATTEMPTS = int(os.getenv("ATTEMPTS"))

turns = 0

print(SELECTED_WORD, ATTEMPTS)

@app.route("/validate", methods=["POST"])
def validate_word():
    data = request.get_json()
    guess = data.get("guess")

    if not guess:
        return jsonify({"error": "Guess not provided"}), 400

    if len(guess) != 5:
        return jsonify({"error": "The guess should be five letters long"}), 400

    if guess == SELECTED_WORD:
        return jsonify({"correct": SELECTED_WORD})
    else:
        return jsonify({"correct": SELECTED_WORD})

if __name__ == "__main__":
    app.run(debug=True, port=8080)