from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.listing import Listing, Tag
from models.user import User

listings_bp = Blueprint('listings', __name__)

@listings_bp.route('', methods=['GET'])
def get_listings():
    neighborhood = request.args.get('neighborhood')
    bedrooms = request.args.get('bedrooms')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')

    query = Listing.query.filter_by(available=True)

    if neighborhood:
        query = query.filter_by(neighborhood=neighborhood)
    if bedrooms:
        query = query.filter_by(bedrooms=int(bedrooms))
    if min_price:
        query = query.filter(Listing.price >= float(min_price))
    if max_price:
        query = query.filter(Listing.price <= float(max_price))

    listings = query.all()
    return jsonify([l.to_dict() for l in listings]), 200


@listings_bp.route('/<int:id>', methods=['GET'])
def get_listing(id):
    listing = Listing.query.get_or_404(id)
    return jsonify(listing.to_dict()), 200


@listings_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'landlord':
        return jsonify({'error': 'Only landlords can post listings'}), 403

    data = request.get_json()

    listing = Listing(
        title=data['title'],
        description=data['description'],
        price=data['price'],
        bedrooms=data['bedrooms'],
        neighborhood=data['neighborhood'],
        address=data.get('address', ''),
        user_id=user.id
    )

    # Handle tags
    tag_names = data.get('tags', [])
    for name in tag_names:
        tag = Tag.query.filter_by(name=name).first()
        if not tag:
            tag = Tag(name=name)
            db.session.add(tag)
        listing.tags.append(tag)

    db.session.add(listing)
    db.session.commit()
    return jsonify(listing.to_dict()), 201


@listings_bp.route('/<int:id>', methods=['PATCH'])
@jwt_required()
def update_listing(id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(id)

    if str(listing.user_id) != str(user_id):
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()
    for field in ['title', 'description', 'price', 'bedrooms', 'neighborhood', 'address', 'available']:
        if field in data:
            setattr(listing, field, data[field])

    db.session.commit()
    return jsonify(listing.to_dict()), 200


@listings_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_listing(id):
    user_id = get_jwt_identity()
    listing = Listing.query.get_or_404(id)

    if str(listing.user_id) != str(user_id):
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(listing)
    db.session.commit()
    return jsonify({'message': 'Listing deleted'}), 200