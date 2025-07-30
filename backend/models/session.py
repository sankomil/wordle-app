from app import db

class Session(db.Model):
    __tablename__ = "Sessions"
    __table_args__ = {'extend_existing': True}
    id = db.Column(db.String(10), primary_key=True)
    solution = db.Column(db.String(5), nullable=False)
    def __repr__(self):
        return f'<Session {self.id}>'

if __name__ =="__main__":
    from app import app, db
    with app.app_context():
        db.create_all()