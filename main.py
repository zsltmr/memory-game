from flask import Flask, render_template, redirect, url_for, request, jsonify, make_response
import pymongo
from flask_pymongo import PyMongo
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from flask_wtf.file import FileField, FileRequired
from wtforms.validators import DataRequired, NumberRange

app = Flask(__name__)

# Database
app.config['MONGO_URI'] = "mongodb+srv://zsolt-memory:zsolt-memory-sapp2@cluster0.2lxz8.mongodb.net/memoryscores?retryWrites=true&w=majority"
mongo = PyMongo(app)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/save", methods=['GET', 'POST'])
def save():
    req = request.get_json()
    print(req)
    if req["name"] != "":
        mongo.db.scores.insert({
            'user_name': req["name"],
            'user_time': req['time'],
        })
    print('data saved')
    return render_template("scoreboard.html")


@app.route("/scoreboard")
def show_board():
    return render_template("scoreboard.html")


if __name__ == '__main__':
    app.run(debug=True)