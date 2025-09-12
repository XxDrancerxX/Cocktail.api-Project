import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
//import 'bootstrap-icons/font/bootstrap-icons.css';

export const GoogleApi = () => {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [reviews, setReviews] = useState([]) // State to hold reviews of the selected place
  const [selectedReview, setSelectedReview] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [modalReviewText, setModalReviewText] = useState("");
  const [favoritePlaces, setFavoritePlaces] = useState([]);
  const { cocktail } = useParams();
  const { store } = useGlobalReducer();
  const navigate = useNavigate();



  const handleSearch = () => {
  setSelectedPlace(null);
  setError("");

  if (!navigator.geolocation) {
    setError("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const payload = { latitude, longitude, cocktail };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      console.log("/api/places status:", res.status, "payload:", payload, "data:", data);

      if (!res.ok) {
        const msg = data?.error || `HTTP ${res.status}`;
        const details = data?.details ? ` — ${data.details}` : "";
        setError(`${msg}${details}`);
        setPlaces([]);
        return;
      }

      if (data?.error) {
        const details = data?.details ? ` — ${data.details}` : "";
        setError(`${data.error}${details}`);
        setPlaces([]);
        return;
      }

      setError("");
      setPlaces(data?.places || []);
    } catch (err) {
      console.error("/api/places fetch error:", err);
      setError(err.message);
      setPlaces([]);
    }
  }, (geoErr) => {
    console.error("Geolocation error:", geoErr);
    setError("Unable to retrieve your location. Please try again later.");
  });
};

  const handleSelect = async (placeId) => { // Function to handle the selection of a place
    const payload = { place_id: placeId }; // Create a payload with the selected place ID
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Fixed header key
      body: JSON.stringify(payload), // Send the selected place ID to the backend
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/places/details`, options); // Fetch details of the selected place from the backend API
      console.log("==>> DATA SENT:", res);
      if (!res.ok) {
        console.log("!!!Error fetching place details:", res.statusText);
        setError("Failed to fetch place details. Please try again later.");
        return; // Exit the function if the response is not OK so that you don’t try to parse an empty or error body.
      }
      const details = await res.json(); // Parse the response JSON to get the place details
      setSelectedPlace(details); // Set the selected place details in the state// //update state so React re-renders your detail pane
      setSelectedReview(null); // Clear any previously selected review
      setReviews([]); // Clear the reviews state when a new place is selected
      console.log("▶️  Place details:", details); // Log the place details to the console   
    }
    catch (err) {
      console.log("!!!Error fetching place details:", err);
      setError(err.message); // Set the error state with the error message
    }
  };

  const showsReviews = (reviews) => { // Function to show reviews of the selected place
    if (!reviews || reviews.length === 0) { // Check if reviews are undefined or empty
      console.log("!!!No reviews found for this place or undefined reviews:", reviews);
      setReviews([]); // Clear the reviews state if no reviews are found    
      return; // Exit the function if no reviews are available //stops the function if something's wrong → no unnecessary code runs after it.
    }
    setReviews(reviews); // Set the reviews state with the reviews of the selected place    
  }

  const showMorePhotos = () => {
    setShowPhotos(!showPhotos); // Toggle the showPhotos state to show or hide photos
  }

  const toggleFavoritePlace = async (place) => {
    if (!store?.token) {
      alert("Please log in to add favorite places");
      return navigate("/signin"); // ⬅️ Este return es importante
    }

    const isFavorite = favoritePlaces.some(f => f.placeId === place.place_id);

    try {
      if (isFavorite) {
        // DELETE request
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/favorite-places/${place.place_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${store.token}`
            }
          }
        );
        if (!res.ok) throw new Error("Failed to remove favorite place");
        const updated = favoritePlaces.filter(p => p.placeId !== place.place_id);
        setFavoritePlaces(updated);
      } else {
        // POST request
        console.log("Saving photo_reference:", place.photos?.[0]?.photo_reference);
        let imageUrl = "https://via.placeholder.com/150";

        if (place.photo_url) {
          imageUrl = place.photo_url;
        } else if (place.photos?.[0]?.photo_reference) {
          imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;
        }

        console.log("📸 Final image URL to be saved:", imageUrl);
        console.log("🔐 Token:", store.token);


        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/favorite-places`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${store.token}`
            },
            body: JSON.stringify({
              placeId: place.place_id,
              placeName: place.name,
              placeImage: imageUrl,
              rating: place.rating,
              location: place.address
            })
          }
        );
        if (!res.ok) throw new Error("Failed to add favorite place");
        const updated = [...favoritePlaces, {
          placeId: place.place_id,
          placeName: place.name,
          placeImage: imageUrl
        }];
        console.log("Photoossss????1!!!!!!", place.photos?.[0]);
        console.log("!!!!Photo info from selectedPlace!!!!!:", place.photos?.[0]);
        if (!place.photos || !place.photos[0]) {
          console.warn("🚫 No photo found in place object", place);
        } else {
          console.log("✅ Photo reference found:", place.photos[0].photo_reference);
        }



        setFavoritePlaces(updated);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


  useEffect(() => {
    if (cocktail) {
      handleSearch(); // Call the handleSearch function to fetch places when the component mounts
    }
  }, [cocktail]); // useEffect hook to handle side effects in functional components


  useEffect(() => {
    if (!store.token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favorite-places`, {
      headers: {
        Authorization: `Bearer ${store.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(p => ({
          placeId: p.place_id,
          placeName: p.place_name,
          placeImage: p.place_image
        }));
        setFavoritePlaces(formatted);
      })
      .catch(console.error);
  }, [store.token]);



  return (
    <div className="container-fluid min-vh-100 d-flex flex-column googleapi-background">
      <div className="row px-md-5 flex-grow-1" style={{ overflow: "hidden", minHeight: "65vh" }}>
        {/* LEFT: Place details */}
        <div className="col-4 overflow-auto d-flex flex-column gap-2" style={{ maxHeight: "70vh" }}>
          {selectedPlace ? (
            <div className="card flex-grow-1 googleapi-detail-card">
              {selectedPlace.photos[0] && (
                <img
                  src={selectedPlace.photos[0]}
                  className="card-img-top"
                  alt={selectedPlace.name}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "contain",
                    backgroundColor: "#f8f9fa"
                  }}
                />
              )}
              <div className="text-wrapper p-2 overflow-auto" style={{ flexGrow: 1 }}>
                <h5>{selectedPlace.name}</h5>
                <p><strong className={selectedPlace.opening_hours?.open_now ? "text-success" : "text-danger"}>
                  {selectedPlace.opening_hours?.open_now ? "Open" : "Closed"}
                </strong></p>
                <p>{selectedPlace.formatted_address}</p>
                <p>{selectedPlace.formatted_phone_number}</p>
                <p><a href={selectedPlace.website}><strong>Go to the website</strong></a></p>
                {selectedPlace.opening_hours?.weekday_text && (
                  <div>
                    <strong>Opening hours:</strong>
                    <ul>
                      {selectedPlace.opening_hours.weekday_text.map((day, idx) => (
                        <li key={idx}>{day}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <a href="#" onClick={e => { e.preventDefault(); showsReviews(selectedPlace.reviews); }}>
                  <strong>See Reviews</strong>
                </a>
                <br />
                <a href="#" onClick={showMorePhotos}>
                  {showPhotos ? "Hide photos" : "See more photos"}
                </a>
              </div>
            </div>
          ) : <p></p>}
        </div>

        {/* CENTER: Photos */}
        <div className="col-4 d-flex flex-column gap-2" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {selectedPlace && !showPhotos && selectedPlace.photos?.length > 1 && (
            <div className="text-muted fst-italic m-auto text-center p-2">
              Click <strong>"See more photos"</strong> to view the gallery.
            </div>
          )}

          {!selectedPlace && (
            <div className="text-muted fst-italic m-auto text-center p-2">
              <strong>Click a place to see more details</strong>
            </div>
          )}

          {showPhotos && selectedPlace.photos && selectedPlace.photos.slice(1).map((photoUrl, idx) => (
            <img
              key={idx}
              src={photoUrl}
              alt={`Photo ${idx + 2}`}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa"
              }}
            />
          ))}

        </div>

        {/* RIGHT: List of places */}
        <div className="col-4 d-flex flex-column" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div className="flex-grow-1 overflow-auto">
            {error && <div className="alert alert-danger">{error}</div>}
            {places.length > 0 ? (
              <ul className="list-group">
                {places.map((place, index) => (
                  <li className="list-group-item googleapi-place-card">
                    <h5>{place.name}</h5>
                    <p>{place.address}</p>
                    <p><strong>Rating:</strong> {place.rating}<i className="bi bi-star-fill"></i></p>
                    <p><strong>Reviews:</strong> {place.user_ratings_total}</p>
                    <button
                      className="btn btn-neon"
                      onClick={() => handleSelect(place.place_id)}
                    >
                      More Info
                    </button>
                    <button
                      className="btn btn-link"
                      onClick={() => toggleFavoritePlace(place)}
                    >
                      <img
                        className="favorite-icon"
                        src={favoritePlaces.some(f => f.placeId === place.place_id)
                          ? "https://img.icons8.com/?size=48&id=LaLJUIEg4Miq&format=png"
                          : "https://img.icons8.com/?size=48&id=3294&format=png"}
                        alt="Favorite Icon"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p>No places found.</p>}
          </div>
        </div>
      </div>
      {/* FOOTER: Reviews */}
      {selectedPlace && <hr className="section-divider-1" />}
      <div className="row px-md-5"
        style={{
          maxHeight: "30vh",           // ✅ mantenemos la altura para el footer
          overflowY: "auto",           // ✅ permite scroll si las reseñas son muy altas
          paddingBottom: "0.5rem",
          marginBottom: "0.5rem",
          display: "flex",
          alignItems: "flex-start"
        }}
      >
        <div className="col-12 h-100">
          <div
            className="reviews-container"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              overflowX: "auto",
              gap: "1.5rem",
              padding: "1rem 2rem",
              alignItems: "stretch",
              justifyContent: "center"
            }}
          >
            {selectedPlace && reviews.length === 0 && (
              <div className="text-muted fst-italic m-auto">
                Please click on <strong>See Reviews</strong> above to see all the reviews.
              </div>
            )}


            {reviews.map((r, index) => (
              <div className="card googleapi-review-card">
                <div className="card-header">
                  <strong>Rating: {r.rating} ⭐</strong>
                </div>
                <div
                  className="card-body d-flex flex-column"
                  style={{ flexGrow: 1 }}
                >
                  <h5 className="card-title">{r.author_name}:</h5>
                  <p
                    className="card-text"
                    style={{
                      display: selectedReview === r ? "block" : "-webkit-box",
                      WebkitLineClamp: selectedReview === r ? "unset" : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: 0,
                      marginBottom: 0
                    }}
                  >
                    {r.text}
                  </p>

                  {r.text && r.text.length > 150 && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setModalReviewText(r.text);
                        setShowReviewModal(true);
                      }}
                    >
                      See full review
                    </a>
                  )}

                  <small className="text-muted d-block mt-2">
                    {r.relative_time_description || "No date available"}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {
        showReviewModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" onClick={() => setShowReviewModal(false)}>
            <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Full Review</h5>
                  <button type="button" className="close" onClick={() => setShowReviewModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>{modalReviewText}</p>
                </div>
              </div>
            </div>
          </div>
        )
      }


    </div >
  );
};










