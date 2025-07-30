from app import db
from models import Session
from datetime import datetime


class SessionHandler:
    def __init__(self):
        self.session_id = str(datetime.now().timetuple().tm_yday + datetime.now().year)

    def fetch_session(self, solution):
        session = self.fetch_session()
        if session:
            return session
        session = Session(solution=solution, id=self.session_id)
        db.session.add(session)
        db.session.commit()
        return session
