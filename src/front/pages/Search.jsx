import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";


const handleSearch = (searchItem, setDrinks) => {
    if (!searchItem.trim()) {
        console.error("Search input is empty");
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchItem}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (data.drinks) {
                setDrinks(data.drinks);
            } else {
                setDrinks([]);
                console.error("No drinks found for this search");
            }
        })
        .catch(err => console.error("Fetch Error:", err));
};

export const Search = () => {
    const { store } = useGlobalReducer();
    const [search, setSearch] = useState("");
    const [drinks, setDrinks] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();



    // Load favorites from local storage on mount
    useEffect(() => {
        if (!store.token) return;

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${store.token}` }
        })
            .then(res => res.json())
            .then(data => {
                const transformed = data.map(f => ({
                    idDrink: f.drink_id,
                    strDrink: f.drink_name,
                    strDrinkThumb: f.drink_image,
                    strGlass: f.drink_glass,
                    strCategory: f.drink_category
                }));
                setFavorites(transformed);
            })
            .catch(err => {
                console.error("Error loading favorites from backend:", err);
                setFavorites([]);
            });
    }, [store.token]);




    // useEffect(() => {
    //     if (!store.token) return;
    //     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites`, {
    //         headers: { Authorization: `Bearer ${store.token}` }
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             // transform server payload to same shape as `drink` objects
    //             setFavorites(data.map(f => ({
    //                 idDrink: f.drink_id,
    //                 strDrink: f.drink_name,
    //                 strDrinkThumb: f.drink_image
    //             })));
    //         })
    //         .catch(console.error);
    // }, [store.token]);


    // const toggleFavorite = async (drink) => {
    //     let updatedFavorites;
    //     if (!store.token){
    //         alert("Please log in to add favorites");     
    //         return;   
    //     }
    //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorites/${drink}`, {

    //     } )
    //     if (favorites.some(fav => fav.idDrink === drink.idDrink)) {
    //         updatedFavorites = favorites.filter(fav => fav.idDrink !== drink.idDrink);
    //     } else {
    //         updatedFavorites = [...favorites, drink];
    //     }
    //     setFavorites(updatedFavorites);
    //     localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    // };

    const toggleFavorite = async (drink) => {
        if (!store?.token) {
            alert("Please log in to add favorites");
            return navigate("/signin");
        }

        const isFav = favorites.some(fav =>
            fav.idDrink === drink.idDrink || fav.drinkId === drink.idDrink
        );


        try {
            if (isFav) {
                // Eliminar del servidor
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/favorites/${drink.idDrink}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${store.token}`,
                        },
                    }
                );
                console.log("Token:", store.token);

                if (!res.ok) throw new Error("Failed to remove favorite");
                const updated = favorites.filter(f => f.idDrink !== drink.idDrink);
                setFavorites(updated);
                localStorage.setItem("favorites", JSON.stringify(updated));

            } else {
                // Agregar al servidor
                console.log("Sending to backend:", {
                    drinkId: drink.idDrink,
                    drinkName: drink.strDrink,
                    drinkImage: drink.strDrinkThumb,
                    drinkGlass: drink.strGlass,
                    drinkCategory: drink.strCategory
                });
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/favorites`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${store.token}`,
                        },
                        body: JSON.stringify({
                            drinkId: drink.idDrink,
                            drinkName: drink.strDrink,
                            drinkImage: drink.strDrinkThumb,
                            drinkGlass: drink.strGlass || "N/A",
                            drinkCategory: drink.strCategory || "N/A"
                        }),
                    }
                );
                console.log("Token:", store.token);
                if (!res.ok) throw new Error("Failed to add favorite");
                const updated = [...favorites, drink];
                setFavorites(updated);
                console.log("Saving to localStorage:", updated);
                localStorage.setItem("favorites", JSON.stringify(updated));
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };
    const toggleFavoritePlace = async (place) => {
    if (!store?.token) {
        alert("Please log in to save favorites");
        return;
    }

    const isFavorite = favoritePlaces.some(f => f.placeId === place.place_id);

    try {
        if (isFavorite) {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite-places/${place.place_id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${store.token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to remove place");

            const updated = favoritePlaces.filter(f => f.placeId !== place.place_id);
            setFavoritePlaces(updated);
        } else {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite-places`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${store.token}`,
                },
                body: JSON.stringify({
                    placeId: place.place_id,
                    placeName: place.name,
                    placeImage: place.photos?.[0] || "", // optional
                }),
            });
            if (!res.ok) throw new Error("Failed to add place");

            const updated = [...favoritePlaces, {
                placeId: place.place_id,
                placeName: place.name,
                placeImage: place.photos?.[0] || "",
            }];
            setFavoritePlaces(updated);
        }
    } catch (err) {
        console.error("Toggle error:", err);
    }
};




    return (
        <div className="search-container">
            <div className="search-bar">
                {/* <input
                    className="search-input"
                    placeholder="Search for a cocktail..."
                    onChange={(e) => setSearch(e.target.value)}
                    value={search} /> */}
                {/* <div className="search-page-container"> */}
                {/* Button Container */}
                {/*             <div className="button-container">
                <button className="logout-action-button" onClick={handleLogout}>
                    Logout
                </button>
            </div> */}
            </div>
            {/* Search Bar */}
            <div className="search-header">
                <input
                    className="search-input-field"
                    placeholder="Search for a cocktail..."
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                />
                <button onClick={() => handleSearch(search, setDrinks)} className="search-action-button">
                    Search
                </button>
            </div>

            {/* Display Results */}
            <div className="results-container">
                {drinks.length > 0 ? (
                    drinks.map((drink) => (
                        <div key={drink.idDrink} className="cocktail-card-container">
                            <h2 className="cocktail-title-text">{drink.strDrink}</h2>
                            <img className="cocktail-thumbnail" src={drink.strDrinkThumb} alt={drink.strDrink} />
                            <p className="cocktail-glass-text"><strong>Glass:</strong> {drink.strGlass}</p>
                            <p className="cocktail-category-text"><strong>Category:</strong> {drink.strCategory}</p>
                            <p><strong>Ingredients:</strong></p>
                            <ul className="cocktail-ingredients-list">
                                {[...Array(15).keys()].map((i) => {
                                    const ingredient = drink[`strIngredient${i + 1}`];
                                    const measure = drink[`strMeasure${i + 1}`];
                                    return (
                                        ingredient && (
                                            <li key={i} className="cocktail-ingredient-item">
                                                {`${measure || ""} ${ingredient}`.trim()}
                                            </li>
                                        )
                                    );
                                })}
                            </ul>
                            {/* <p className="cocktail-instructions"><strong>Instructions:</strong> {drink.strInstructions}</p> */}

                            {/* Favorite Button with Image */}
                            <div className="button-row">
                                {/* <button
                                    className={`favorite-button ${favorites.some(fav => fav.idDrink === drink.idDrink) ? "favorited" : ""}`}
                                    onClick={() => toggleFavorite(drink)}
                                >
                                </button> */}
                                <Link
                                    to={`/google-api/${encodeURIComponent(drink.strDrink)}`}  // turns your drink name into a URL-safe string                                
                                    className="btn btn-primary">
                                    Places to drink
                                </Link>

                                {/* new “Spots by Location” button */}
                                <Link
                                    to={`/spot-by-location/${encodeURIComponent(drink.strDrink)}`}
                                    className="btn btn-outline-secondary"
                                >
                                    Spots by Location
                                </Link>
                            </div>
                            <p className="cocktail-instructions-text"><strong>Instructions:</strong> {drink.strInstructions}</p>

                            <button
                                className="favorite-toggle-button"
                                onClick={() => toggleFavorite(drink)}
                            >
                                <img
                                    src={
                                        favorites.some(fav => fav.idDrink === drink.idDrink || fav.drinkId === drink.idDrink)
                                            ? "https://img.icons8.com/?size=48&id=LaLJUIEg4Miq&format=png"
                                            : "https://img.icons8.com/?size=48&id=3294&format=png"
                                    }
                                    alt="Favorite Icon"
                                    className="favorite-icon-image"
                                />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-results-message">No drinks found</p>
                )}

            </div>
        </div>
    );
};
