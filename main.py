from flask import Flask, render_template, redirect, url_for, request, jsonify, make_response
from flask_pymongo import PyMongo
from datetime import datetime
import os

app = Flask(__name__)

# Database
app.config['MONGO_URI'] = os.environ.get("Mongo-Scores")
mongo = PyMongo(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/save", methods=['GET', 'POST'])
def save():
    req = request.get_json()
    print(req)
    if req["name"] != "":
        now = datetime.now()
        dt_date = now.strftime("%d.%m.%Y")
        dt_time = now.strftime("%H:%M:%S")
        mongo.db.scores.insert({
            'user_name': req["name"],
            'user_time': req['time'],
            'game_date': dt_date,
            'game_time': dt_time
        })
    print('data saved')
    return render_template("scoreboard.html")


@app.route("/scoreboard")
def show_board():
    scores = mongo.db.scores.find().sort("user_time", 1)
    return render_template("scoreboard.html", scores=scores)


if __name__ == '__main__':
    app.run(debug=True)