from app import app
from models import db
from models.user import User
from models.listing import Listing, Tag
from models.inquiry import Inquiry
from flask_bcrypt import Bcrypt
import random

bcrypt = Bcrypt(app)

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

# Room types mapped to bedrooms number:
# 0 = Bedsitter
# 1 = Single Room (just a room, shared facilities)
# 2 = 1 Bedroom (self contained, kitchen + bathroom inside)
# 3 = 2 Bedrooms
# 4 = 3 Bedrooms

PRICE_RANGES = {
    'premium': {
        0: (20000, 40000),   # Bedsitter
        1: (25000, 45000),   # Single Room
        2: (50000, 120000),  # 1 Bedroom
        3: (90000, 200000),  # 2 Bedrooms
        4: (160000, 400000), # 3 Bedrooms
    },
    'mid': {
        0: (8000, 15000),
        1: (6000, 12000),
        2: (18000, 35000),
        3: (30000, 55000),
        4: (50000, 90000),
    },
    'budget': {
        0: (3500, 7000),
        1: (2500, 5500),
        2: (8000, 14000),
        3: (14000, 19000),
        4: (20000, 35000),
    }
}

PREMIUM_AREAS = [
    'Karen', 'Muthaiga', 'Runda', 'Gigiri', 'Lavington',
    'Kilimani', 'Spring Valley', 'Ridgeways', 'Westlands',
    'Loresho', 'Parklands', 'Kileleshwa', 'CBD'
]

BUDGET_AREAS = [
    'Githurai', 'Mwihoko', 'Roysambu', 'Kasarani', 'Ruiru',
    'Thika Road', 'Kahawa', 'Zimmerman', 'Huruma', 'Mathare',
    'Soweto', 'Pipeline', 'Kayole', 'Komarock', 'Embakasi',
    'Utawala', 'Umoja', 'Donholm', 'Buruburu', 'Fedha',
    'Eastleigh', 'Dagoretti', 'Riruta', 'Kabete'
]

# More bedsitters and single rooms in budget areas
BUDGET_ROOM_TYPES = [0, 0, 0, 1, 1, 1, 2, 2, 3, 4]
MID_ROOM_TYPES =    [0, 0, 1, 1, 2, 2, 2, 3, 3, 4]
PREMIUM_ROOM_TYPES = [0, 1, 2, 2, 2, 3, 3, 3, 4, 4]

TITLES = {
    0: [
        'Bedsitter in {area}',
        'Self Contained Bedsitter in {area}',
        'Cozy Bedsitter in {area}',
        'Modern Bedsitter in {area}',
        'Spacious Bedsitter in {area}',
    ],
    1: [
        'Single Room in {area}',
        'Clean Single Room in {area}',
        'Affordable Single Room in {area}',
        'Single Room to Let in {area}',
        'Neat Single Room in {area}',
    ],
    2: [
        '1 Bedroom Apartment in {area}',
        'Self Contained 1BR in {area}',
        'Modern 1 Bedroom in {area}',
        'Spacious 1BR Flat in {area}',
        'Executive 1 Bedroom in {area}',
    ],
    3: [
        '2 Bedroom Apartment in {area}',
        'Spacious 2BR Flat in {area}',
        'Modern 2 Bedroom in {area}',
        '2BR Family Apartment in {area}',
        'Affordable 2 Bedroom in {area}',
    ],
    4: [
        '3 Bedroom House in {area}',
        'Spacious 3BR in {area}',
        '3 Bedroom Family Home in {area}',
        'Executive 3BR in {area}',
        'Modern 3 Bedroom in {area}',
    ]
}

DESCRIPTIONS = {
    0: [
        'A cozy bedsitter in {area}. Comes with a small kitchen area. Close to matatu stage and shopping.',
        'Clean and affordable bedsitter in {area}. Water included. Easy access to public transport.',
        'Self contained bedsitter in {area}. Ideal for a working professional or student.',
        'Neat bedsitter in a secure compound in {area}. Close to schools and markets.',
    ],
    1: [
        'A clean single room in {area}. Shared bathroom and kitchen. Very affordable.',
        'Single room to let in {area}. Shared facilities. Close to matatu stage.',
        'Affordable single room in a quiet compound in {area}. Water available.',
        'Neat single room in {area}. Shared kitchen and toilets. Good security.',
    ],
    2: [
        'Modern 1 bedroom apartment in {area}. Self contained with kitchen and bathroom inside. Close to amenities.',
        'Spacious 1 bedroom unit in {area}. En-suite bathroom, fitted kitchen. Easy matatu access.',
        'Well finished 1 bedroom apartment in {area}. Separate kitchen, bathroom and sitting area.',
        'Clean 1 bedroom flat in {area}. Self contained. Water and electricity available.',
    ],
    3: [
        'Comfortable 2 bedroom apartment in {area}. Master en-suite, fitted kitchen. Good neighborhood.',
        'Spacious 2 bedroom flat in {area}. Two bathrooms, large sitting room. Secure compound.',
        'Modern 2 bedroom apartment in {area}. Close to schools, shopping and public transport.',
        'Well maintained 2 bedroom house in {area}. Large compound with parking.',
    ],
    4: [
        'Beautiful 3 bedroom home in {area}. Master en-suite, spacious living area, fitted kitchen.',
        'Spacious 3 bedroom house in {area}. Large compound, parking, borehole water.',
        'Executive 3 bedroom apartment in {area}. All bedrooms en-suite. Modern finishes.',
        'Family 3 bedroom home in {area}. Quiet estate, good security, close to schools.',
    ]
}

with app.app_context():
    print("Clearing database...")
    Inquiry.query.delete()
    db.session.execute(db.text('DELETE FROM saved_listings'))
    db.session.execute(db.text('DELETE FROM listing_tags'))
    Listing.query.delete()
    Tag.query.delete()
    User.query.delete()
    db.session.commit()

    print("Creating tags...")
    tag_objects = {}
    for name in TAGS_LIST:
        tag = Tag(name=name)
        db.session.add(tag)
        tag_objects[name] = tag
    db.session.commit()

    print("Creating landlords...")
    landlord_names = [
        ('John Kamau', 'jkamau@test.com'),
        ('Grace Wanjiku', 'gwanjiku@test.com'),
        ('Peter Otieno', 'potieno@test.com'),
        ('Mary Njeri', 'mnjeri@test.com'),
        ('David Mwangi', 'dmwangi@test.com'),
        ('Sarah Achieng', 'sachieng@test.com'),
        ('James Kipchoge', 'jkipchoge@test.com'),
        ('Rose Wairimu', 'rwairimu@test.com'),
        ('Samuel Odhiambo', 'sodhiambo@test.com'),
        ('Agnes Mutua', 'amutua@test.com'),
        ('Charles Kariuki', 'ckariuki@test.com'),
        ('Beatrice Adhiambo', 'badhiambo@test.com'),
        ('Francis Kimani', 'fkimani@test.com'),
        ('Esther Nyambura', 'enyambura@test.com'),
        ('George Omondi', 'gomondi@test.com'),
        ('Leah Wangari', 'lwangari@test.com'),
        ('Patrick Njogu', 'pnjogu@test.com'),
        ('Mercy Auma', 'mauma@test.com'),
        ('Stephen Gitau', 'sgitau@test.com'),
        ('Tabitha Chebet', 'tchebet@test.com'),
    ]

    landlords = []
    for name, email in landlord_names:
        landlord = User(
            name=name,
            email=email,
            password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
            role='landlord'
        )
        db.session.add(landlord)
        landlords.append(landlord)
    db.session.commit()

    test_landlord = User(
        name='John Kamau Test',
        email='landlord@test.com',
        password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
        role='landlord'
    )
    test_tenant = User(
        name='Brian Ochieng',
        email='tenant@test.com',
        password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
        role='tenant'
    )
    tenant2 = User(
        name='Amina Hassan',
        email='tenant2@test.com',
        password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
        role='tenant'
    )
    db.session.add_all([test_landlord, test_tenant, tenant2])
    db.session.commit()
    landlords.append(test_landlord)

    print(f"Generating listings for {len(NEIGHBORHOODS)} neighborhoods...")
    all_listings = []

    for area in NEIGHBORHOODS:
        print(f"  → {area}...")

        if area in PREMIUM_AREAS:
            tier = 'premium'
            room_types = PREMIUM_ROOM_TYPES
        elif area in BUDGET_AREAS:
            tier = 'budget'
            room_types = BUDGET_ROOM_TYPES
        else:
            tier = 'mid'
            room_types = MID_ROOM_TYPES

        for i in range(100):
            room_type = random.choice(room_types)
            min_p, max_p = PRICE_RANGES[tier][room_type]
            price = random.randrange(min_p, max_p, 500)

            title = random.choice(TITLES[room_type]).format(area=area)
            description = random.choice(DESCRIPTIONS[room_type]).format(area=area)

            num_tags = random.randint(2, 5)
            selected_tags = random.sample(list(tag_objects.values()), num_tags)

            listing = Listing(
                title=title,
                description=description,
                price=float(price),
                bedrooms=room_type,
                neighborhood=area,
                address=f'{area}, Nairobi',
                user_id=random.choice(landlords).id,
                tags=selected_tags
            )
            db.session.add(listing)
            all_listings.append(listing)

        db.session.commit()

    print("Adding sample inquiries...")
    sample_listings = random.sample(all_listings, 5)
    for listing in sample_listings[:3]:
        inq = Inquiry(
            message='Hello, I am interested in this property. Is it still available?',
            user_id=test_tenant.id,
            listing_id=listing.id
        )
        db.session.add(inq)

    for listing in sample_listings[:4]:
        if listing not in test_tenant.saved:
            test_tenant.saved.append(listing)

    db.session.commit()

    total = len(NEIGHBORHOODS) * 100
    print(f"\n✅ Done! {total} listings across {len(NEIGHBORHOODS)} neighborhoods.")
    print(f"   Landlords: {len(landlords)}")
    print("\nTest Accounts:")
    print("  Landlord: landlord@test.com / password123")
    print("  Tenant:   tenant@test.com / password123")