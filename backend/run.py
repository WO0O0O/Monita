# Simplified version to ensure the Flask server starts correctly
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import datetime
import threading
import time
import requests
from concurrent.futures import ThreadPoolExecutor

# Create a basic Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
})

# Set up logging
app.logger.setLevel(logging.DEBUG)

# Create a test endpoint
@app.route('/api/test', methods=['GET'])
def test():
    app.logger.info('Test endpoint called!')
    return jsonify({'message': 'API is working!'})

# Simple in-memory storage for websites (not persistent - will reset when server restarts)
websites = []

# Storage for website check history
check_history = {}

# Function to check a website's status
def check_website(website):
    start_time = time.time()
    website_id = website['id']
    url = website['url']
    app.logger.info(f"Checking website {website['name']} ({url})")
    
    try:
        response = requests.get(url, timeout=10)
        end_time = time.time()
        response_time_ms = int((end_time - start_time) * 1000)
        status_code = response.status_code
        is_up = 200 <= status_code < 400
        status = 'up' if is_up else 'down'
        
        app.logger.info(f"Website {website['name']} is {status} - Status code: {status_code} - Response time: {response_time_ms}ms")
    except Exception as e:
        end_time = time.time()
        response_time_ms = int((end_time - start_time) * 1000)
        status_code = 0
        is_up = False
        status = 'down'
        app.logger.error(f"Error checking website {website['name']}: {str(e)}")
    
    timestamp = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    
    # Create check result
    check_result = {
        'website_id': website_id,
        'timestamp': timestamp,
        'status': status,
        'is_up': is_up,
        'response_time_ms': response_time_ms,
        'status_code': status_code
    }
    
    # Initialize history for this website if it doesn't exist
    if website_id not in check_history:
        check_history[website_id] = []
    
    # Add to history (limit to 100 entries per website)
    check_history[website_id].insert(0, check_result)  # Add at the beginning
    if len(check_history[website_id]) > 100:
        check_history[website_id] = check_history[website_id][:100]
    
    return check_result

# Function to check all websites
def check_all_websites():
    app.logger.info("Starting check of all websites")
    if not websites:
        app.logger.info("No websites to check")
        return

    # Use thread pool to check websites concurrently
    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(check_website, websites)
    
    app.logger.info("Finished checking all websites")

# Background thread to periodically check websites
def website_monitor_thread():
    app.logger.info("Starting website monitor thread")
    while True:
        try:
            check_all_websites()
        except Exception as e:
            app.logger.error(f"Error in website monitor thread: {str(e)}")
        
        # Sleep for 60 seconds (check every minute)
        time.sleep(60)

# Start monitoring thread when app starts
@app.before_first_request
def start_monitoring_thread():
    thread = threading.Thread(target=website_monitor_thread)
    thread.daemon = True  # Thread will exit when main thread exits
    thread.start()
    app.logger.info("Website monitoring thread started")

# Add a websites endpoint
@app.route('/api/websites', methods=['GET'])
def get_websites():
    app.logger.info('GET /api/websites called')
    # Return the websites from our simple in-memory storage
    return jsonify(websites)

@app.route('/api/websites/<int:website_id>', methods=['GET'])
def get_website(website_id):
    app.logger.info(f'GET /api/websites/{website_id} called')
    
    # Find the website with the matching ID in our in-memory storage
    for website in websites:
        if website['id'] == website_id:
            return jsonify(website)
    
    # If no website found with that ID, return a 404 error
    return jsonify({'error': 'Website not found'}), 404

@app.route('/api/websites', methods=['POST'])
def create_website():
    app.logger.info('POST /api/websites called')
    app.logger.info(f'Request data: {request.json}')
    
    # Create a new website with a unique ID (just use the next number in sequence)
    new_id = len(websites) + 1
    new_website = {
        'id': new_id,
        'name': request.json.get('name', ''),
        'url': request.json.get('url', ''),
        'check_interval_minutes': request.json.get('check_interval_minutes', 5),
        'is_active': request.json.get('is_active', True),
        'created_at': datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    }
    
    # Add the new website to our in-memory storage
    websites.append(new_website)
    
    app.logger.info(f'Added website: {new_website}')
    return jsonify(new_website), 201

# Add a website status endpoint
@app.route('/api/websites/<int:website_id>/status', methods=['GET'])
def get_website_status(website_id):
    app.logger.info(f'GET /api/websites/{website_id}/status called')
    
    # Find the website with matching ID
    website = None
    for w in websites:
        if w['id'] == website_id:
            website = w
            break
    
    if not website:
        return jsonify({'error': 'Website not found'}), 404
    
    # Check if we have history for this website
    if website_id in check_history and check_history[website_id]:
        latest_check = check_history[website_id][0]  # Most recent check
        history = check_history[website_id]
        
        return jsonify({
            'website_id': website_id,
            'status': latest_check['status'],
            'response_time_ms': latest_check['response_time_ms'],
            'status_code': latest_check['status_code'],
            'last_checked': latest_check['timestamp'],
            'history': history
        })
    else:
        # If no history yet, perform a check now
        check_result = check_website(website)
        
        return jsonify({
            'website_id': website_id,
            'status': check_result['status'],
            'response_time_ms': check_result['response_time_ms'],
            'status_code': check_result['status_code'],
            'last_checked': check_result['timestamp'],
            'history': [check_result]
        })

# Add dashboard stats endpoint
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_stats():
    app.logger.info('GET /api/dashboard called')
    
    total_websites = len(websites)
    websites_up = 0
    websites_down = 0
    response_times = []
    
    for website_id in check_history:
        if check_history[website_id]:
            latest_check = check_history[website_id][0]
            if latest_check['is_up']:
                websites_up += 1
            else:
                websites_down += 1
            response_times.append(latest_check['response_time_ms'])
    
    avg_response_time = sum(response_times) / len(response_times) if response_times else 0
    
    return jsonify({
        'total_websites': total_websites,
        'websites_up': websites_up,
        'websites_down': websites_down,
        'avg_response_time': avg_response_time,
        'last_updated': datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
    })

if __name__ == '__main__':
    print('Starting Flask development server on port 5001...')
    app.run(debug=True, host='127.0.0.1', port=5001)
