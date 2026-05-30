from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.inquiry import Inquiry
from models.listing import Listing
from models.user import User

inquiries_bp = Blueprint('inquiries', __name__)

@inquiries_bp.route('', methods=['GET'])
@jwt_required()
def get_inquiries():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role == 'landlord':
        listing_ids = [l.id for l in user.listings]
        inquiries = Inquiry.query.filter(Inquiry.listing_id.in_(listing_ids)).all()
    else:
        inquiries = Inquiry.query.filter_by(user_id=user.id).all()

    return jsonify([i.to_dict() for i in inquiries]), 200


@inquiries_bp.route('', methods=['POST'])
@jwt_required()
def create_inquiry():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'tenant':
        return jsonify({'error': 'Only tenants can send inquiries'}), 403

    data = request.get_json()
    inquiry = Inquiry(
        message=data['message'],
        user_id=user.id,
        listing_id=data['listing_id']
    )
    db.session.add(inquiry)
    db.session.commit()
    return jsonify(inquiry.to_dict()), 201


@inquiries_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_inquiry(id):
    user_id = get_jwt_identity()
    inquiry = Inquiry.query.get_or_404(id)

    if str(inquiry.user_id) != str(user_id):
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(inquiry)
    db.session.commit()
    return jsonify({'message': 'Inquiry deleted'}), 200