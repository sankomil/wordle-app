from collections import defaultdict
from typing import List
import random

from .validation import validate_string

# Runs the validate_string function for each word in the pool. In this instance we pretend as if the guess
# is the actual solution, and creating a score for each word based on its validation.
# Correctly placed letters are prioritised, as we want to ensure we avoid choosing any word where even
# one letter is correctly placed
# We then return a dictionary of score - words from word pool with that score
def cheat_validate(curr_pool: List, current_guess:str)->dict[int, List]:
    score = {"correct": 6, "misplaced": 1, "incorrect": 0}
    current_guess = current_guess.strip().upper()

    result = defaultdict(list)

    for pot_sol in curr_pool:
        pot_sol = pot_sol.strip().upper()
        curr_validation = validate_string(solution=current_guess, guess=pot_sol)
        curr_score = sum([score[a["status"]] for a in curr_validation])
        result[curr_score].append((pot_sol, curr_validation))
    
    return result

# From a given dictionary of number, list pair, return the list with the smallest number key
def select_group(groups):
    min_score = min(groups.keys())
    return groups[min_score], min_score


# Group all words in the word pool based on their scores, then choose the group with the smallest score
# If we find that the smallest score is no longer zero, we have no choice but to make a decision for
# the solution. In that case we choose a random word from the selected list, and set that as the solution
def update_word_pool(word_pool, guess):
    groups = cheat_validate(word_pool, guess)
    chosen, min_score = select_group(groups)
    if min_score != 0:
        solution = random.choice(chosen)
        return [solution[0]]
    return [sol[0] for sol in chosen]

