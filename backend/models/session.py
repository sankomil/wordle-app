from app import db

class Session(db.Model):
    __tablename__ = "Sessions"
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.Integer, primary_key=True)
    solution = db.Column(db.String(5), unique=True, nullable=False)
    turns = db.Column(db.Integer, default=0)
    game_over = db.Column(db.Boolean, default=False)
    won = db.Column(db.Boolean, default=False)
    guesses = db.Column(db.ARRAY(db.String(5)), default=[])

    def __repr__(self):
        return f'<Session {self.id}>'

if __name__ =="__main__":
    from app import app, db
    with app.app_context():
        db.create_all()