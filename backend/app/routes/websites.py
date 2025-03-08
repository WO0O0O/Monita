from flask import Blueprint, jsonify, request, abort
from app.models import Website, Check
from app import db
from datetime import datetime

websites_bp = Blueprint('websites', __name__, url_prefix='/api/websites')

@websites_bp.route('', methods=['GET'])
def get_websites():
    """Get all monitored websites"""
    websites = Website.query.all()
    return jsonify([website.to_dict() for website in websites])

@websites_bp.route('', methods=['POST'])
def create_website():
    """Add a new website to monitor"""
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('name') or not data.get('url'):
        abort(400, description="Name and URL are required")
    
    # Create new website
    new_website = Website(
        name=data['name'],
        url=data['url'],
        check_interval_minutes=data.get('check_interval_minutes', 5),
        is_active=data.get('is_active', True)
    )
    
    db.session.add(new_website)
    db.session.commit()
    
    return jsonify(new_website.to_dict()), 201

@websites_bp.route('/<int:website_id>', methods=['GET'])
def get_website(website_id):
    """Get details of a specific website"""
    website = Website.query.get_or_404(website_id)
    return jsonify(website.to_dict())

@websites_bp.route('/<int:website_id>', methods=['PUT'])
def update_website(website_id):
    """Update website monitoring settings"""
    website = Website.query.get_or_404(website_id)
    data = request.get_json()
    
    if not data:
        abort(400, description="No data provided")
    
    # Update fields if provided
    if 'name' in data:
        website.name = data['name']
    if 'url' in data:
        website.url = data['url']
    if 'check_interval_minutes' in data:
        website.check_interval_minutes = data['check_interval_minutes']
    if 'is_active' in data:
        website.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify(website.to_dict())

@websites_bp.route('/<int:website_id>', methods=['DELETE'])
def delete_website(website_id):
    """Remove a website from monitoring"""
    website = Website.query.get_or_404(website_id)
    
    db.session.delete(website)
    db.session.commit()
    
    return '', 204

@websites_bp.route('/<int:website_id>/status', methods=['GET'])
def get_website_status(website_id):
    """Get current status and recent history"""
    website = Website.query.get_or_404(website_id)
    
    # Get the latest status
    latest_status = website.get_latest_status()
    
    # Get recent checks (last 10)
    recent_checks = Check.query.filter_by(website_id=website_id)\
        .order_by(Check.checked_at.desc())\
        .limit(10).all()
    
    return jsonify({
        'website': website.to_dict(),
        'latest_status': latest_status,
        'recent_checks': [check.to_dict() for check in recent_checks]
    })

@websites_bp.route('/<int:website_id>/checks', methods=['GET'])
def get_website_checks(website_id):
    """Get check history for a website"""
    Website.query.get_or_404(website_id)  # Check if website exists
    
    # Optional pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Get checks with pagination
    checks = Check.query.filter_by(website_id=website_id)\
        .order_by(Check.checked_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'checks': [check.to_dict() for check in checks.items],
        'pagination': {
            'total': checks.total,
            'pages': checks.pages,
            'page': page,
            'per_page': per_page,
            'next': checks.next_num,
            'prev': checks.prev_num
        }
    })
