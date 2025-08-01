from collections import defaultdict
from typing import List
import random

from .validation import validate_string


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

def select_group(groups):
    min_score = min(groups.keys())
    return groups[min_score], min_score



def update_word_pool(word_pool, guess):
    groups = cheat_validate(word_pool, guess)
    chosen, min_score = select_group(groups)
    if min_score != 0:
        solution = random.choice(chosen)
        return [solution[0]]
    return [sol[0] for sol in chosen]

