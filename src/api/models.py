import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# app = Flask(__name__)
# CORS(app)
# jwt = JWTManager(app)

# **Database Configuration**
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"  
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


# db = SQLAlchemy(app)
db = SQLAlchemy()


# **User Model**
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    is_active = db.Column(db.Boolean, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
        }

# **Favorites Model**
class Favorite(db.Model):
    __tablename__ = "favorites"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    drink_id = db.Column(db.String(50), nullable=False)
    drink_name = db.Column(db.String(120), nullable=False)
    drink_image = db.Column(db.String(255), nullable=False)
    drink_glass = db.Column(db.String(120), nullable=True)
    drink_category = db.Column(db.String(120), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "drink_id": self.drink_id,
            "drink_name": self.drink_name,
            "drink_image": self.drink_image,
            "drink_glass": self.drink_glass,
            "drink_category": self.drink_category            
        }

# **Create Database Tables**
# with app.app_context():
#     db.create_all()

class FavoritePlaces(db.Model):
    __tablename__ = "favorite_places"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)  
    place_id = db.Column(db.String(50), nullable=False)
    place_name = db.Column(db.String(120), nullable=False)
    place_image = db.Column(db.String(1000), nullable=False)
    rating = db.Column(db.Float, nullable=True) 
    location = db.Column(db.String(255), nullable=True)  


    
    def serialize(self):
        return {
            "id": self.id,
            "place_id": self.place_id,
            "place_name": self.place_name,
            "place_image": self.place_image,
            "rating": self.rating,
            "location": self.location
        }  

# **User Registration**
# @app.route("/signup", methods=["POST"])
# def register():
#     data = request.json
#     if not all(key in data for key in ["name", "email", "password", "phone"]):
#         return jsonify({"message": "Missing required fields"}), 400

#     hashed_password = generate_password_hash(data["password"])
    
#     try:
#         user = User(name=data["name"], email=data["email"], password=hashed_password, phone=data["phone"])
#         db.session.add(user)
#         db.session.commit()
#         return jsonify({"message": "User registered successfully"}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": "Error registering user", "error": str(e)}), 500

# **User Login**
# @app.route("/login", methods=["POST"])
# def login():
#     data = request.json
#     if not all(key in data for key in ["email", "password"]):
#         return jsonify({"message": "Missing required fields"}), 400

#     user = User.query.filter_by(email=data["email"]).first()
#     if user and check_password_hash(user.password, data["password"]):
#         access_token = create_access_token(identity=str(user.id))
#         return jsonify({"token": access_token}), 200
#     return jsonify({"message": "Invalid credentials"}), 401

# **Get User Info**
# @app.route("/user", methods=["GET"])
# @jwt_required()
# def get_user():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)
#     if not user:
#         return jsonify({"message": "User not found"}), 404
#     return jsonify(user.serialize()), 200

# **Add Favorite**
# @app.route("/favorites", methods=["POST"])
# @jwt_required()
# def add_favorite():
#     user_id = get_jwt_identity()
#     data = request.json
#     if not all(key in data for key in ["drinkId", "drinkName", "drinkImage"]):
#         return jsonify({"message": "Missing required fields"}), 400

#     try:
#         favorite = Favorite(user_id=user_id, drink_id=data["drinkId"], drink_name=data["drinkName"], drink_image=data["drinkImage"])
#         db.session.add(favorite)
#         db.session.commit()
#         return jsonify({"message": "Favorite added"}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": "Error adding favorite", "error": str(e)}), 500

# # **Get Favorites**
# @app.route("/favorites", methods=["GET"])
# @jwt_required()
# def get_favorites():
#     user_id = get_jwt_identity()
#     favorites = Favorite.query.filter_by(user_id=user_id).all()
#     return jsonify([fav.serialize() for fav in favorites]), 200

# # **Delete Favorite**
# @app.route("/favorites/<drink_id>", methods=["DELETE"])
# @jwt_required()
# def delete_favorite(drink_id):
#     user_id = get_jwt_identity()
#     favorite = Favorite.query.filter_by(user_id=user_id, drink_id=drink_id).first()
#     if favorite:
#         try:
#             db.session.delete(favorite)
#             db.session.commit()
#             return jsonify({"message": "Favorite removed"}), 200
#         except Exception as e:
#             db.session.rollback()
#             return jsonify({"message": "Error deleting favorite", "error": str(e)}), 500
#     return jsonify({"message": "Favorite not found"}), 404

##>>> CRUD endpoints for our favaorite_places:
# @app.route("/favorite-places", methods=["GET"])
# @jwt_required()
# def get_favorite_places():
#     user_id = get_jwt_identity()
#     favorite_places = FavoritePlaces.query.filter_by(user_id=user_id).all()
#     return jsonify([fav.serialize() for fav in favorite_places]), 200

# @app.route("/favorite-places", methods=["POST"])
# @jwt_required()
# def add_favorite_place():
#     user_id = get_jwt_identity()
#     data = request.json
#     if not all(key in data for key in ["placeId", "placeName", "placeImage"]):
#         return jsonify({"message": "Missing required fields"}), 400

#     try:
#         favorite_place = FavoritePlaces(user_id=user_id, place_id=data["placeId"], place_name=data["placeName"], place_image=data["placeImage"])
#         db.session.add(favorite_place )
#         db.session.commit()
#         return jsonify({"message": "Favorite place added"}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({"message": "Error adding favorite", "error": str(e)}), 500
    
# @app.route("/favorite_places/<place_id>", methods=["DELETE"])
# @jwt_required()
# def delete_favorite_place(place_id):
#     user_id = get_jwt_identity()
#     favorite_place = FavoritePlaces.query.filter_by(user_id=user_id, place_id=place_id).first()
#     if favorite_place:
#         try:
#             db.session.delete(favorite_place)
#             db.session.commit()
#             return jsonify({"message": "Favorite removed"}), 200
#         except Exception as e:
#             db.session.rollback()
#             return jsonify({"message": "Error deleting favorite", "error": str(e)}), 500
#     return jsonify({"message": "Favorite not found"}), 404    

# if __name__ == "__main__":
#     app.run(debug=True)

