from models import db
from datetime import datetime

# Many-to-Many: saved listings
saved_listings = db.Table('saved_listings',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('listing_id', db.Integer, db.ForeignKey('listings.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='tenant')  # 'tenant' or 'landlord'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    listings = db.relationship('Listing', backref='landlord', lazy=True)
    inquiries = db.relationship('Inquiry', backref='tenant', lazy=True)
    saved = db.relationship('Listing', secondary=saved_listings, backref='saved_by')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }