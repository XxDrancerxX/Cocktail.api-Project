import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ResetPassword = () => {
    // 1)We take the object from the URL and parse it to get the token
    const location = useLocation(); //==> it gives you an object describing the current URL your user is on and it contains information about the current URL, including the pathname, search, and hash.
    const queryParams = new URLSearchParams(location.search) //==>Parse the query string in the URL into a map-like object
    const token = queryParams.get("token") //==>either the token string or null
    const navigate = useNavigate(); //==> It allows you to programmatically navigate to different routes in your application. It is a hook that returns a function that can be used to navigate to a different route.

    // 2) We create a state to store the new password and confirm password and show an error message if the passwords do not match.
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); //==> We create a loading state to show a loading spinner when the user clicks the submit button and the API is being called.

    // 3) We create a function to handle the form submission in the form.   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        // 🔥 Bring payload back
        const payload = { token, new_password: newPassword };

        console.log("!!!!Payload going to server:", payload);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/reset-password`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );
            console.log("!!!!!Fetch URL was:", res);
            console.log("!!!!!!Response status:", res.status, res.statusText, res.url);

            // parse before checking ok
            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(json.error || "Something went wrong. Please try again.");
                return;
            }

            console.log("Server response:", json);
            alert("Password successfully changed");
            navigate("/signin", { replace: true });
        } catch (networkError) {
            console.error(networkError);
            setError(networkError.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                background: "linear-gradient(to right, #fce4ec, #e3f2fd)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Orbitron', sans-serif",
                padding: "30px",
            }}
        >
            {/* 100vh means “100% of the viewport’s height.” min-height ensures the container can grow taller if its content overflows. */}
            {!token ? (
                <p style={{ color: "red", marginTop: "0.5rem" }}>
                    Invalid link.
                    <a href="/password">Request a new reset email</a>
                </p>
            ) : (
                <>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            backgroundColor: "#1a1a1a",
                            borderRadius: "16px",
                            boxShadow: "0 0 25px rgba(0, 170, 255, 0.4)",
                            maxWidth: "400px",
                            width: "100%",
                            padding: "30px",
                        }}
                    >
                        <h4
                            className="text-center mb-4"
                            style={{
                                color: "#00AFFF",
                                textShadow: "0 0 6px #00AFFF, 0 0 12px #00AFFF",
                                fontWeight: "bold",
                            }}
                        >
                            🔒 Reset your password
                        </h4>

                        <div className="mb-3">
                            <input
                                className="form-control"
                                id="password"
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{
                                    background: "#000",
                                    color: "#00AFFF",
                                    border: "2px solid #00AFFF",
                                    boxShadow: "0 0 6px #00AFFF",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                className="form-control"
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{
                                    background: "#000",
                                    color: "#00AFFF",
                                    border: "2px solid #00AFFF",
                                    boxShadow: "0 0 6px #00AFFF",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn w-100"
                            style={{
                                background: "#00AFFF",
                                color: "#fff",
                                fontWeight: "bold",
                                boxShadow: "0 0 12px #00AFFF, 0 0 24px #00AFFF",
                                borderRadius: "8px",
                                transition: "all 0.3s ease-in-out",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.boxShadow =
                                    "0 0 16px #00AFFF, 0 0 32px #00AFFF, 0 0 48px #00AFFF")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.boxShadow = "0 0 12px #00AFFF, 0 0 24px #00AFFF")
                            }
                        >
                            {loading ? "Saving..." : "Save new password"}
                        </button>

                        {error && (
                            <div className="alert alert-danger mt-3 text-center">
                                {error}
                            </div>
                        )}
                    </form>
                </>
            )}
        </div>
    );
};
