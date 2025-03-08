import json
import requests
import time
import os
import sqlite3
from datetime import datetime

# Configuration
DATABASE_PATH = '/tmp/upmon.db'  # Lambda can only write to /tmp
API_ENDPOINT = os.environ.get('API_ENDPOINT', 'http://localhost:5000/api')

def connect_db():
    """Connect to the SQLite database"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def fetch_websites(conn):
    """Fetch all active websites from the database"""
    cur = conn.cursor()
    cur.execute("SELECT id, name, url FROM websites WHERE is_active = 1")
    return cur.fetchall()

def record_check(conn, website_id, status_code, response_time_ms, is_up, error_message=None):
    """Record a website check in the database"""
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO checks (website_id, status_code, response_time_ms, is_up, checked_at, error_message) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (website_id, status_code, response_time_ms, is_up, datetime.utcnow().isoformat(), error_message)
    )
    conn.commit()
    return cur.lastrowid

def check_website(website):
    """Check if a website is up"""
    start_time = time.time()
    is_up = False
    status_code = None
    error_message = None
    
    try:
        # Set a reasonable timeout
        response = requests.get(
            website['url'], 
            timeout=10,
            headers={'User-Agent': 'UpMon Lambda Website Checker/1.0'}
        )
        status_code = response.status_code
        # Consider 2xx and 3xx status codes as up
        is_up = 200 <= status_code < 400
        response_time_ms = int((time.time() - start_time) * 1000)
    except requests.exceptions.RequestException as e:
        response_time_ms = int((time.time() - start_time) * 1000)
        error_message = str(e)
    
    return {
        'website_id': website['id'],
        'status_code': status_code,
        'response_time_ms': response_time_ms,
        'is_up': is_up,
        'error_message': error_message
    }

def notify_status_change(website, check_result):
    """Notify the API about a status change"""
    try:
        response = requests.post(
            f"{API_ENDPOINT}/notifications",
            json={
                'website_id': website['id'],
                'website_name': website['name'],
                'is_up': check_result['is_up'],
                'status_code': check_result['status_code'],
                'error_message': check_result['error_message']
            }
        )
        return response.status_code == 200
    except:
        return False

def lambda_handler(event, context):
    """AWS Lambda handler function"""
    try:
        # Connect to the database
        conn = connect_db()
        
        # Fetch websites to check
        websites = fetch_websites(conn)
        
        results = []
        for website in websites:
            # Check website status
            check_result = check_website(website)
            
            # Record the check
            check_id = record_check(
                conn,
                check_result['website_id'],
                check_result['status_code'],
                check_result['response_time_ms'],
                check_result['is_up'],
                check_result['error_message']
            )
            
            # Add the result to our list
            results.append({
                'website_id': website['id'],
                'website_name': website['name'],
                'check_id': check_id,
                'is_up': check_result['is_up']
            })
            
            # TODO: In Phase 2, implement status change detection and notification
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f"Successfully checked {len(results)} websites",
                'results': results
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f"Error: {str(e)}"
            })
        }
