from flask import Flask, request, jsonify
from flask_cors import CORS
from resume_analyzer import analyze_resume
import os

app = Flask(__name__)
# Enable CORS so Vercel can access this API
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    target_role = request.form.get('target_role', '')
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        file_bytes = file.read()
        # Call your existing logic from resume_analyzer.py
        report = analyze_resume(file.filename, file_bytes, target_role)
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
