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

    # Fix CORS
    CORS(app, resources={r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "https://nairent.netlify.app", "*"],
        "methods": ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(listings_bp, url_prefix='/api/listings')
    app.register_blueprint(inquiries_bp, url_prefix='/api/inquiries')
    app.register_blueprint(saved_bp, url_prefix='/api/saved')

    # Create tables and auto-seed if empty
    with app.app_context():
        db.create_all()
        auto_seed()

    return app

def auto_seed():
    from flask_bcrypt import Bcrypt as Bcrypt2
    import random

    # Only seed if database is empty
    if User.query.first():
        print("Database already has data, skipping seed.")
        return

    print("Database is empty, seeding...")
    _bcrypt = Bcrypt2()

    NEIGHBORHOODS = [
        'Westlands', 'Kilimani', 'Karen', 'Thika Road', 'Roysambu',
        'Kahawa', 'Githurai', 'Ruiru', 'Kasarani', 'Ruaka',
        'Eastleigh', 'Mwihoko', 'Lavington', 'Parklands', 'Kileleshwa',
        'South B', 'South C', 'Langata', 'Embakasi', 'Utawala',
        'Donholm', 'Umoja', 'Buruburu', 'Kayole', 'Komarock',
        'Dagoretti', 'Riruta', 'Kabete', 'Kikuyu', 'Rongai',
        'Ngong', 'Kitengela', 'Syokimau', 'Mlolongo', 'Imara Daima',
        'Fedha', 'Pipeline', 'Soweto', 'Mathare', 'Huruma',
        'Zimmerman', 'Muthaiga', 'Ridgeways', 'Gigiri', 'Runda',
        'Spring Valley', 'Loresho', 'Nairobi West', 'Nairobi South', 'CBD'
    ]

    TAGS_LIST = ['WiFi', 'Parking', 'Furnished', 'Borehole', 'Generator', 'Security', 'Garden', 'Pool', 'CCTV', 'Balcony']

    PRICE_RANGES = {
        'premium': {0: (20000,40000), 1: (25000,45000), 2: (50000,120000), 3: (90000,200000), 4: (160000,400000)},
        'mid':     {0: (8000,15000),  1: (6000,12000),  2: (18000,35000),  3: (30000,55000),  4: (50000,90000)},
        'budget':  {0: (3500,7000),   1: (2500,5500),   2: (8000,14000),   3: (14000,19000),  4: (20000,35000)},
    }

    PREMIUM_AREAS = ['Karen','Muthaiga','Runda','Gigiri','Lavington','Kilimani','Spring Valley','Ridgeways','Westlands','Loresho','Parklands','Kileleshwa','CBD']
    BUDGET_AREAS  = ['Githurai','Mwihoko','Roysambu','Kasarani','Ruiru','Thika Road','Kahawa','Zimmerman','Huruma','Mathare','Soweto','Pipeline','Kayole','Komarock','Embakasi','Utawala','Umoja','Donholm','Buruburu','Fedha','Eastleigh','Dagoretti','Riruta','Kabete']

    BUDGET_ROOM_TYPES  = [0,0,0,1,1,1,2,2,3,4]
    MID_ROOM_TYPES     = [0,0,1,1,2,2,2,3,3,4]
    PREMIUM_ROOM_TYPES = [0,1,2,2,2,3,3,3,4,4]

    TITLES = {
        0: ['Bedsitter in {area}','Self Contained Bedsitter in {area}','Cozy Bedsitter in {area}','Modern Bedsitter in {area}'],
        1: ['Single Room in {area}','Clean Single Room in {area}','Affordable Single Room in {area}','Single Room to Let in {area}'],
        2: ['1 Bedroom Apartment in {area}','Self Contained 1BR in {area}','Modern 1 Bedroom in {area}','Spacious 1BR Flat in {area}'],
        3: ['2 Bedroom Apartment in {area}','Spacious 2BR Flat in {area}','Modern 2 Bedroom in {area}','2BR Family Apartment in {area}'],
        4: ['3 Bedroom House in {area}','Spacious 3BR in {area}','3 Bedroom Family Home in {area}','Executive 3BR in {area}'],
    }

    DESCRIPTIONS = {
        0: ['A cozy bedsitter in {area}. Small kitchen area included. Close to matatu stage and shopping.','Clean and affordable bedsitter in {area}. Water included. Easy access to public transport.'],
        1: ['A clean single room in {area}. Shared bathroom and kitchen. Very affordable.','Single room to let in {area}. Shared facilities. Close to matatu stage.'],
        2: ['Modern 1 bedroom apartment in {area}. Self contained with kitchen and bathroom inside.','Spacious 1 bedroom unit in {area}. En-suite bathroom, fitted kitchen. Easy matatu access.'],
        3: ['Comfortable 2 bedroom apartment in {area}. Master en-suite, fitted kitchen.','Spacious 2 bedroom flat in {area}. Two bathrooms, large sitting room. Secure compound.'],
        4: ['Beautiful 3 bedroom home in {area}. Master en-suite, spacious living area, fitted kitchen.','Spacious 3 bedroom house in {area}. Large compound, parking, borehole water.'],
    }

    # Tags
    tag_objects = {}
    for name in TAGS_LIST:
        tag = Tag(name=name)
        db.session.add(tag)
        tag_objects[name] = tag
    db.session.commit()

    # Landlords
    landlord_names = [
        ('John Kamau','jkamau@test.com'), ('Grace Wanjiku','gwanjiku@test.com'),
        ('Peter Otieno','potieno@test.com'), ('Mary Njeri','mnjeri@test.com'),
        ('David Mwangi','dmwangi@test.com'), ('Sarah Achieng','sachieng@test.com'),
        ('James Kipchoge','jkipchoge@test.com'), ('Rose Wairimu','rwairimu@test.com'),
        ('Samuel Odhiambo','sodhiambo@test.com'), ('Agnes Mutua','amutua@test.com'),
    ]

    landlords = []
    for name, email in landlord_names:
        landlord = User(
            name=name, email=email,
            password_hash=_bcrypt.generate_password_hash('password123').decode('utf-8'),
            role='landlord'
        )
        db.session.add(landlord)
        landlords.append(landlord)

    test_landlord = User(name='John Kamau Test', email='landlord@test.com',
        password_hash=_bcrypt.generate_password_hash('password123').decode('utf-8'), role='landlord')
    test_tenant = User(name='Brian Ochieng', email='tenant@test.com',
        password_hash=_bcrypt.generate_password_hash('password123').decode('utf-8'), role='tenant')

    db.session.add_all([test_landlord, test_tenant])
    db.session.commit()
    landlords.append(test_landlord)

    # Listings — 20 per neighborhood to keep it light on free tier
    for area in NEIGHBORHOODS:
        if area in PREMIUM_AREAS:
            tier, room_types = 'premium', PREMIUM_ROOM_TYPES
        elif area in BUDGET_AREAS:
            tier, room_types = 'budget', BUDGET_ROOM_TYPES
        else:
            tier, room_types = 'mid', MID_ROOM_TYPES

        for i in range(20):
            room_type = random.choice(room_types)
            min_p, max_p = PRICE_RANGES[tier][room_type]
            price = random.randrange(min_p, max_p, 500)
            title = random.choice(TITLES[room_type]).format(area=area)
            description = random.choice(DESCRIPTIONS[room_type]).format(area=area)
            selected_tags = random.sample(list(tag_objects.values()), random.randint(2, 4))

            listing = Listing(
                title=title, description=description,
                price=float(price), bedrooms=room_type,
                neighborhood=area, address=f'{area}, Nairobi',
                user_id=random.choice(landlords).id,
                tags=selected_tags
            )
            db.session.add(listing)

        db.session.commit()

    print("✅ Auto-seed complete!")

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)