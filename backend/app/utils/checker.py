import requests
import time
from datetime import datetime
from app.models import Check, Website
from app import db

def check_website(website):
    """
    Check if a website is up and record the result.
    
    Args:
        website: Website model instance to check
        
    Returns:
        Check: The created Check instance
    """
    start_time = time.time()
    is_up = False
    status_code = None
    error_message = None
    
    try:
        # Set a reasonable timeout
        response = requests.get(
            website.url, 
            timeout=10,
            headers={'User-Agent': 'UpMon Website Checker/1.0'}
        )
        status_code = response.status_code
        # Consider 2xx and 3xx status codes as up
        is_up = 200 <= status_code < 400
        response_time_ms = int((time.time() - start_time) * 1000)
    except requests.exceptions.RequestException as e:
        response_time_ms = int((time.time() - start_time) * 1000)
        error_message = str(e)
    
    # Create a new check record
    check = Check(
        website_id=website.id,
        status_code=status_code,
        response_time_ms=response_time_ms,
        is_up=is_up,
        checked_at=datetime.utcnow(),
        error_message=error_message
    )
    
    # Save to database
    db.session.add(check)
    db.session.commit()
    
    return check

def check_all_websites():
    """
    Check all active websites and record their status.
    
    Returns:
        list: List of Check instances created
    """
    websites = Website.query.filter_by(is_active=True).all()
    checks = []
    
    for website in websites:
        check = check_website(website)
        checks.append(check)
    
    return checks
