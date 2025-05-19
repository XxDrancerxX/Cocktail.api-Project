import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Favorites = () => {
    const [favoritesDrinks, setFavoritesDrinks] = useState([]);
    const [favoritesPlaces, setFavoritesPlaces] = useState([]);
    const [user, setUser] = useState({ name: "", email: "" });
    const navigate = useNavigate();
    const { store } = useGlobalReducer()

    {/* This part handles the whole user authentication and data fetching */ }
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setUser({ name: data.name, email: data.email });
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };


    const fetchFavoritesDrinks = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log("Token:", store.token);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setFavoritesDrinks(
                data.map((drink) => {
                    return {
                        id: drink.id,
                        drinkId: drink.drink_id,
                        drinkName: drink.drink_name,
                        drinkImage: drink.drink_image,
                        drinkGlass: drink.drink_glass || "N/A",
                        drinkCategory: drink.drink_category || "N/A",
                    };
                })
            );
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    const removeFavoriteDrink = async (drinkId) => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${drinkId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            setFavoritesDrinks(favoritesDrinks.filter(fav => fav.drinkId !== drinkId));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };
    const fetchFavoritesPlaces = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite-places`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("✅ Backend favorite places response:", data);

            setFavoritesPlaces(
                data.map((place) => {
                    return {
                        id: place.id,
                        placeId: place.place_id,
                        placeName: place.place_name,
                        placeImage: place.place_image
                    };

                })
            );
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };
    const removeFavoritePlace = async (placeId) => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite-places/${placeId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            setFavoritesPlaces(favoritesPlaces.filter(fav => fav.placeId !== placeId));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    }

    useEffect(() => {
        fetchFavoritesDrinks().then(favs => {
            localStorage.setItem("favorites", JSON.stringify(favs));
        });
        fetchFavoritesPlaces();
        fetchUserData();
    }, []);


    return (
        <div className="favorites-container">
            {/* Sidebar for User Info */}
            <div className="user-info">
                <h3>User: {user.name}</h3>
                <p>{user.email}</p>
            </div>


            {/* Favorites Drinks List */}
            <div className="favorites-content">
                <h2>My Favorite Cocktails</h2>
                {favoritesDrinks.length > 0 ? (
                    <div className="cocktail-list">
                        {favoritesDrinks.map((drink) => (
                            <div key={drink.drinkId} className="cocktail-card">
                                <h2 className="cocktail-title">{drink.drinkName}</h2>
                                <img className="cocktail-image" src={drink.drinkImage} alt={drink.drinkName} />
                                <p className="cocktail-glass"><strong>Glass:</strong> {drink.drinkGlass || "N/A"}</p>
                                <p className="cocktail-category"><strong>Category:</strong> {drink.drinkCategory || "N/A"}</p>

                                {/* Remove Favorite Button */}
                                <button
                                    className="remove-favorite-button"
                                    onClick={() => removeFavoriteDrink(drink.drinkId)}
                                >
                                    Remove Favorite
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-favorites">You haven't added any favorites drinks yet.</p>
                )}
                {/* This part is for the favorite places */}
                <h2>My Favorite Places</h2>

                {favoritesPlaces.length > 0 ? (
                    <div className="cocktail-list">
                        {favoritesPlaces.map((place) => (
                            <div key={place.placeId} className="cocktail-card">
                                <h2 className="cocktail-title">{place.placeName}</h2>
                                <img className="cocktail-image" src={place.placeImage} alt={place.placeName} />
                                <p className="cocktail-glass"><strong>Glass:</strong> {place.glass || "N/A"}</p>
                                <p className="cocktail-category"><strong>Category:</strong> {place.category || "N/A"}</p>

                                {/* Remove Favorite  place Button */}
                                <button
                                    className="remove-favorite-button"
                                    onClick={() => removeFavoritePlace(place.placeId)}
                                >
                                    Remove Favorite
                                </button>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-favorites">You haven't added any favorites places yet.</p>
                )}
            </div>
        </div>
    );
};
