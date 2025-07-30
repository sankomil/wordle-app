from app import db
from models import Session
import random
import os


class SessionHandler:
    def __init__(self, solution=None):
        self.solution = solution

    def create_session(self):
        session = Session(solution=self.solution)
        db.session.add(session)
        db.session.commit()
        return session

    def fetch_session(self, session_id):
        return Session.query.get(session_id)