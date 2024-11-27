from flask import Flask, render_template, request, jsonify
import json
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load FAQ data
try:
    with open("faq.json", encoding="utf-8") as f:
        faq_data = json.load(f)
except FileNotFoundError:
    print("Error: 'faq.json' file not found.")
    faq_data = []
except json.JSONDecodeError as e:
    print(f"Error in 'faq.json' formatting: {e}")
    faq_data = []

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/search', methods=['POST'])
def search():
    query = request.json.get("query", "").lower()
    if not query:
        return jsonify({"error": "Query is empty"}), 400

    results = [faq for faq in faq_data if query in faq['question'].lower()]
    return jsonify(results)

# **New route for fetching suggestions**
@app.route('/suggestions', methods=['GET'])
def get_suggestions():
    # Select a limited number of FAQs (e.g., first 5 entries)
    suggestions = [{"question": faq["question"]} for faq in faq_data[:5]]
    return jsonify(suggestions)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
