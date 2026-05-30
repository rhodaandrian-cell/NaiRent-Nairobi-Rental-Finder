from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt

from config import Config
from models import db
from models.user import User
from models.listing import Listing, Tag
from models.inquiry import Inquiry

from routes.auth import auth_bp, bcrypt
from routes.listings import listings_bp
from routes.inquiries import inquiries_bp
from routes.saved import saved_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    db.init_app(app)
    JWTManager(app)
    bcrypt.init_app(app)

    # Fix CORS — allow both localhost variants
    CORS(app, resources={r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(listings_bp, url_prefix='/api/listings')
    app.register_blueprint(inquiries_bp, url_prefix='/api/inquiries')
    app.register_blueprint(saved_bp, url_prefix='/api/saved')

    # Create tables
    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)