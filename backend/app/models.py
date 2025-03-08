from app import db
from datetime import datetime

class Website(db.Model):
    """Model for websites to be monitored"""
    __tablename__ = 'websites'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    check_interval_minutes = db.Column(db.Integer, default=5)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship with checks
    checks = db.relationship('Check', back_populates='website', cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'url': self.url,
            'check_interval_minutes': self.check_interval_minutes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active,
            'latest_status': self.get_latest_status()
        }
    
    def get_latest_status(self):
        """Get the latest check status for this website"""
        latest_check = Check.query.filter_by(website_id=self.id).order_by(Check.checked_at.desc()).first()
        if not latest_check:
            return None
        return {
            'is_up': latest_check.is_up,
            'status_code': latest_check.status_code,
            'response_time_ms': latest_check.response_time_ms,
            'checked_at': latest_check.checked_at.isoformat() if latest_check.checked_at else None,
            'error_message': latest_check.error_message
        }


class Check(db.Model):
    """Model for individual website status checks"""
    __tablename__ = 'checks'
    
    id = db.Column(db.Integer, primary_key=True)
    website_id = db.Column(db.Integer, db.ForeignKey('websites.id'), nullable=False)
    status_code = db.Column(db.Integer, nullable=True)
    response_time_ms = db.Column(db.Integer, nullable=True)
    is_up = db.Column(db.Boolean, nullable=False)
    checked_at = db.Column(db.DateTime, default=datetime.utcnow)
    error_message = db.Column(db.Text, nullable=True)
    
    # Relationship with website
    website = db.relationship('Website', back_populates='checks')
    
    def to_dict(self):
        """Convert object to dictionary"""
        return {
            'id': self.id,
            'website_id': self.website_id,
            'status_code': self.status_code,
            'response_time_ms': self.response_time_ms,
            'is_up': self.is_up,
            'checked_at': self.checked_at.isoformat() if self.checked_at else None,
            'error_message': self.error_message
        }
