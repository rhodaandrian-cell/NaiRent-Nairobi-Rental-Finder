from models import db
from datetime import datetime

# Many-to-Many: listing tags
listing_tags = db.Table('listing_tags',
    db.Column('listing_id', db.Integer, db.ForeignKey('listings.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'), primary_key=True)
)

class Tag(db.Model):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def to_dict(self):
        return {'id': self.id, 'name': self.name}

class Listing(db.Model):
    __tablename__ = 'listings'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    neighborhood = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationships
    inquiries = db.relationship('Inquiry', backref='listing', lazy=True, cascade='all, delete-orphan')
    tags = db.relationship('Tag', secondary=listing_tags, backref='listings')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'bedrooms': self.bedrooms,
            'neighborhood': self.neighborhood,
            'address': self.address,
            'available': self.available,
            'created_at': self.created_at.isoformat(),
            'landlord': self.landlord.name,
            'tags': [tag.to_dict() for tag in self.tags]
        }