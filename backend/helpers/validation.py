from typing import List, Dict

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