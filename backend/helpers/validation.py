from typing import List, Dict

# Basic validation. It compares the guess against the solution, and assigns the state for each letter
# It also accounts for repeated words, ensuring that the next instance of a repeated letter in the solution
# is not incorrectly validated

# The function first goes through each letter in the guess and compares it against the letter in same
# index in the solution, changing its validation to 'correct' if matched. It also sets matched letter
# in solution to None. Next we go through the guess object again, checking if an instance of an
# unvalidated letter exists, and checking if it exists in the solution array. This manages the 
# 'misplaced' state. The rest of the letters are then assigned 'incorrect' 
def validate_string(guess:str, solution: str)-> List[Dict[str, str]]:
    sol_array = list(solution)
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
    return validated_guess