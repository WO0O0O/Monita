# Simplified version to ensure the Flask server starts correctly
from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

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

# Add a websites endpoint
@app.route('/api/websites', methods=['GET'])
def get_websites():
    app.logger.info('GET /api/websites called')
    return jsonify([])

@app.route('/api/websites', methods=['POST'])
def create_website():
    app.logger.info('POST /api/websites called')
    app.logger.info(f'Request data: {request.json}')
    # Return a dummy response for now
    return jsonify({
        'id': 1,
        'name': request.json.get('name', ''),
        'url': request.json.get('url', ''),
        'check_interval_minutes': request.json.get('check_interval_minutes', 5),
        'is_active': request.json.get('is_active', True),
        'created_at': '2025-03-08T02:00:00Z'
    }), 201

if __name__ == '__main__':
    print('Starting Flask development server on port 5001...')
    app.run(debug=True, host='127.0.0.1', port=5001)
