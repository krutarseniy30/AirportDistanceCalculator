from flask import Flask, request, jsonify, render_template
from geopy.distance import great_circle

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('index.html')

@app.route('/distance', methods=['GET', 'POST'])
def distance():
    data = request.get_json()
    start_point = tuple(data['start'])  # Получаем начальную точку
    end_point = tuple(data['end'])      # Получаем конечную точку
    
    dist = great_circle(start_point, end_point).kilometers
    result = {
        'distance': round(dist, 2),
    }
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
