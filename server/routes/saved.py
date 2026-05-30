from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.listing import Listing
from models.user import User

saved_bp = Blueprint('saved', __name__)

@saved_bp.route('', methods=['GET'])
@jwt_required()
def get_saved():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify([l.to_dict() for l in user.saved]), 200


@saved_bp.route('/<int:listing_id>', methods=['POST'])
@jwt_required()
def save_listing(listing_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    listing = Listing.query.get_or_404(listing_id)

    if listing in user.saved:
        return jsonify({'error': 'Already saved'}), 400

    user.saved.append(listing)
    db.session.commit()
    return jsonify({'message': 'Listing saved'}), 201


@saved_bp.route('/<int:listing_id>', methods=['DELETE'])
@jwt_required()
def unsave_listing(listing_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    listing = Listing.query.get_or_404(listing_id)

    if listing not in user.saved:
        return jsonify({'error': 'Not saved'}), 400

    user.saved.remove(listing)
    db.session.commit()
    return jsonify({'message': 'Removed from saved'}), 200