import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// !!use encodeURIComponent() to encode the category name and to make it safe to use in a URL e.g "Seafood & Fish" becomes "Seafood%20%26%20Fish" not spaces and special characters.
// You don't need to import it, it's a built-in function in JavaScript.

export const FindSpots = () => {
  const [drinks, setDrinks] = useState([]); // it will hold the catalog of drinks.
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [favoriteDrinks, setFavoriteDrinks] = useState([]);


  // Function to toggle favorite drinks
  // This function checks if the drink is already in the favoriteDrinks array.
  // If it is, it removes it from the array. If it isn't, it adds it to the array.
  const toggleFavoriteDrink = (drink) => {
    const isFav = favoriteDrinks.some(f => f.idDrink === drink.idDrink);
    if (isFav) {
      setFavoriteDrinks(favoriteDrinks.filter(f => f.idDrink !== drink.idDrink));
    } else {
      setFavoriteDrinks([...favoriteDrinks, drink]);
    }
  };




  //1) function to load our Cocktails by category(fetching them from the api)
  // we use async/await to fetch the data
  const fetchCategories = async () => {
    setError(""); // clear any previous error message as soon as the user clicks again.
    setLoading(true) // set loading to true to show the loading spinner
    try {

      const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list") // Browsers assume no protocol means “load from my own server.” Always include https:// (or http://) when calling an external API.
      const data = await res.json()
      const cocktailsName = data.drinks.map(drink => drink.strCategory); // Since this is an array of objects, we use map to extract the name of the drinks from the data object

      if (!res.ok) { // check if the response is ok
        // if the response is not ok, we log the error and set the error state to display the error message.       
        console.log("!!>>>Error feching the data from endpoint", res.statusText);
        setError(`There was a problem wiht the server, try again. ${res.status}`)
        return // we  do "return" to stop the execution of the function early, so you DON'T accidentally call setCategories(...)
      }
      else {
        setCategories(cocktailsName)
      }
    }
    catch (err) {
      console.error("!!>>>Error loading categories", err)
      setError(`Server error: ${err.message}`);
    }
    finally {
      setLoading(false) // set loading to false since we are done loading. 

    }
  };


  //2) function to load the full data of the drinks by id. 
  //We use this to get the full data by id of the drinks when the user clicks on the drink and then we can use this data to display the details of the drink 
  // in  fetchDrinksFromCategories using the idDrink property of the drink object.
  const getFullDataFromDrinks = async (idDrink) => {

    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`)
      if (!res.ok) {
        throw new Error(`Lookup failed: ${res.status} ${res.statusText}`);
      }
      const data = await res.json()
      return data.drinks[0]

    }
    catch (err) {
      console.log(`Error in catch: ${err.message}`);
      return null
    }
  }


  //3) funtion to load the cocktails from each category
  const fetchDrinksFromCategories = async (category) => {
    setError(""); // clear any previous error messag  as soon as the user clicks again.
    setDrinks([]);  // clear previous results  
    setLoading(true)  // set loading to true since we are loading new data.
    try {
      const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`) // we use encodeURIComponent to encode the category name.

      if (!res.ok) {
        console.log("!!>>>Error feching the data from endpoint", res.statusText);
        setError(`There was a problem wiht the server, try again : ${res.statusText} ${res.status}`);
        setDrinks([]); // clear previous results        
        return // we  do "return" to stop the execution of the function early.
      }
      const data = await res.json()
      const basicList = data.drinks || [] // if drinks is undefined, we set it to an empty array.
      // for each drink, we get the full data by id using the getFullDataFromDrinks function.
      const list = await Promise.all( // we use Promise.all to wait for all the promises to resolve before setting the state.
        // we use map to iterate over the basicList and call the getFullDataFromDrinks function for each drink.
        // we use async/await to fetch the data        
        basicList.map(async (b) => {
          const full = await getFullDataFromDrinks(b.idDrink);
          return full || b;  //fallback to the basic data if lookup fails.
        })
      )

      setDrinks(list) // set the drinks state to the list of drinks.      
    }
    catch (err) {
      console.log("!!!>>Error in catch", err);
      setError(`Server error: ${err.message}`);
    }
    finally {
      setLoading(false)  // set loading to false since we are done loading.
    }
  }



  //4) useEffect to call the getCocktails function when the component mounts it means that the function will be called when the component is first rendered.
  // we use an empty dependency array to ensure that the function is only called once
  useEffect(() => {
    fetchCategories()
  }, []);



  return (
    // since categories is now a string[] we can use map to iterate over it and display the name of the drinks in a list.
    // we use the key prop to give each element a unique key, which helps React identify which items have changed, are added, or are removed.    
    <div
      className="page-wrapper"
      style={{
        position: "relative",
        minHeight: "100vh",   // ensures it’s at least the screen height
        background: "linear-gradient(to right, #ffe0f1, #e0f7ff)", // ✅ Neon pastel gradient
        padding: "2rem 1rem"
      }}
    >
      {loading && (
        // 2) This overlay is ABSOLUTE inside the wrapper  
        <div
          className="loader-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.8)",
            zIndex: 999
          }}
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      )}
      {/* CATEGORY BUTTONS */}
      <div className="d-flex flex-wrap gap-2 mb-4 mt-4 justify-content-center">
        {categories.map(item => (
          <button
            key={item}
            className={
              "btn btn-lg fw-bold rounded-pill " +
              (item === selectedCategory
                ? "text-white"
                : "text-dark border border-primary") +
              " px-4 py-2"
            }
            style={{
              background: item === selectedCategory ? "#FF00FF" : "transparent",
              borderColor: "#FF00FF",
              boxShadow: item === selectedCategory
                ? "0 0 10px #FF00FF, 0 0 20px #FF00FF"
                : "none",
              transition: "all 0.3s"
            }}
            onClick={() => {
              setSelectedCategory(item);
              fetchDrinksFromCategories(item);
            }}
          >
            {item}
          </button>

        ))}
      </div>
      {/* show any error messages here */}
      {!loading && error && drinks.length === 0 && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}
      {/* “No drinks” message */}
      {!loading && drinks.length === 0 && selectedCategory && (
        <p>No drinks found in {selectedCategory}.</p>
      )}
      {!loading && drinks.length > 0 && (
        <div id="container-find-spot" className="container">
          <div className="row gx-3 gy-4">
            {
              drinks.map(d => (
                <div
                  key={d.idDrink}
                  className="col-6 col-sm-4 col-md-4 col-lg-3 d-flex align-items-stretch"
                >
                  <div
                    className="card cocktail-find-spot  hover-glow-card "
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: "2px solidrgba(76, 0, 255, 0.14)",
                      borderRadius: "12px",
                      minHeight: "100%",
                      width: "100%",
                      maxWidth: "260px", // slightly wider than before
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 0 10px rgba(255, 0, 255, 0.1)",
                    }}
                  >
                    <img src={d.strDrinkThumb} className="card-img-top" alt={d.strDrink} />
                    <div className="card-body">
                      <h5
                        className="card-title text-center fw-bold"
                        style={{
                          background: "linear-gradient(to right, #a855f7, #60a5fa)", // soft violet to blue
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: "1.05rem",
                          fontFamily: "'Orbitron', sans-serif",
                          minHeight: "48px" // ensure consistent height
                        }}
                      >
                        {d.strDrink}
                      </h5>
                      <div className="d-flex justify-content-center mt-2">
                        <button
                          className="btn btn-link p-0"
                          onClick={() => toggleFavoriteDrink(d)}
                          style={{ alignSelf: "center" }}
                        >
                          <img
                            className="favorite-icon"
                            src={
                              favoriteDrinks.some(f => f.idDrink === d.idDrink)
                                ? "https://img.icons8.com/?size=48&id=LaLJUIEg4Miq&format=png" // Corazón lleno
                                : "https://img.icons8.com/?size=48&id=3294&format=png" // Corazón vacío
                            }
                            alt="Favorite Icon"
                            style={{ width: "24px", height: "24px" }}
                          />
                        </button>
                      </div>
                      <p className="card-text">{d.strInstructions}</p>
                      <ul className="ingredient-list">
                        {/* 3) we use Array.from to create an array of 15 elements and map over it to get the ingredients and measures.
                      this is how it works: Array.from(arrayLike, mapFn?, thisArg?): 1)arrayLike: something with a .length property and numeric keys (e.g. a string, a DOM NodeList, or even your own { length: 15 } object).
                      2) mapFn (optional): a function (element, index) ⇒ newValue that runs on each position to build the result.
                      3) thisArg (optional): what this should be inside your mapFn.
                       */}
                        {Array.from({ length: 15 }, (_, i) => i + 1) // create an array of 15 elements and for each slot, ignore the value (_) and use the index (i) to produce the number i+1.
                          //i + 1 returns numbers 1 through 15.
                          //This gives us a result which is an array of numbers from 1 to 15. [1,2,…,15].map
                          // We map over this array and for each number, we get the ingredient and measure from the drink object (d).
                          .map(num => ({
                            //You build a new object { ing, meas } for each slot.
                            ing: d[`strIngredient${num}`], // e.g. d["strIngredient1"]
                            measure: d[`strMeasure${num}`] // e.g. d["strMeasure1"]
                            // After this step you get an array like:
                            // [{ ing: "Tequila",   meas: "1 1/2 oz " },
                            // { ing: "Triple sec", meas: "1/2 oz " }]
                          }))
                          // filter out the empty ingredients and map over the array to get the ingredient and measure.
                          .filter(x => x.ing)
                          // this map  iterates the filtered array of { ing, meas }.
                          .map((x, index) => (
                            <li key={index}>
                              {/* >>conditional if x.measure is truthy, we trim() whitespace(Ensures you don’t end up with accidental double-spaces in your output.) and append a space.  */}
                              {/* >> Otherwise output an empty string. */}
                              {x.measure ? x.measure.trim() + " " : ""} - {x.ing}
                            </li>
                          ))
                        }
                      </ul>
                      <div className="d-flex gap-2 justify-content-center mt-3">
                        <Link to={`/spot-by-location/${encodeURIComponent(d.strDrink)}`}>
                          <button
                            className="btn"
                            style={{
                              background: "linear-gradient(90deg, #6366f1, #ec4899)",
                              color: "#fff",
                              fontWeight: "500",
                              border: "none",
                              borderRadius: "8px",
                              padding: "0.4rem 0.7rem", // 👈 smaller padding
                              minWidth: "100px" // 👈 narrower width than before
                            }}
                          >
                            Spots by Location
                          </button>
                        </Link>
                        <Link to={`/google-api/${encodeURIComponent(d.strDrink)}`}>
                          <button
                            className="btn"
                            style={{
                              background: "linear-gradient(90deg, #6366f1, #ec4899)",
                              color: "#fff",
                              fontWeight: "500",
                              border: "none",
                              borderRadius: "8px",
                              padding: "0.4rem 0.7rem", // 👈 smaller padding
                              minWidth: "100px" // 👈 narrower width than before
                            }}
                          >
                            Spots Nearby
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )
      }
    </div >
  );

}













