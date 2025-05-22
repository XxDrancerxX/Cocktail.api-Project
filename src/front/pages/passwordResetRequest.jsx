import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PasswordRequestReset = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!email) {
            setError("Please enter your email.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/password-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(json.error || "Something went wrong. Please try again.");
                return;
            }

            setSuccess("If you entered a valid email, you will receive a password reset link shortly.");

            setTimeout(() => {
                navigate("/signin", { replace: true });
            }, 3000);

        } catch (networkError) {
            console.error(networkError);
            setError("Network error. Please try again.");
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
            <div
                className="neon-form p-4"
                style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "16px",
                    boxShadow: "0 0 25px rgba(255, 0, 255, 0.3)",
                    maxWidth: "400px",
                    width: "100%",
                }}
            >
                <h4
                    className="text-center mb-4"
                    style={{
                        color: "#fff",
                        textShadow: "0 0 6px #FF00FF, 0 0 12px #FF00FF",
                        fontWeight: "bold",
                    }}
                >
                    Password Recovery
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            style={{
                                background: "#000",
                                color: "#FF00FF",
                                border: "2px solid #FF00FF",
                                boxShadow: "0 0 6px #FF00FF",
                                borderRadius: "8px",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn w-100"
                        style={{
                            background: "#FF00FF",
                            color: "#fff",
                            fontWeight: "bold",
                            boxShadow: "0 0 12px #FF00FF, 0 0 24px #FF00FF",
                            transition: "all 0.3s ease-in-out",
                            borderRadius: "8px",
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.boxShadow = "0 0 16px #FF00FF, 0 0 32px #FF00FF, 0 0 48px #FF00FF")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.boxShadow = "0 0 12px #FF00FF, 0 0 24px #FF00FF")
                        }
                    >
                        {loading ? "Sending..." : "Reset Password"}
                    </button>

                    {error && (
                        <div className="alert alert-danger mt-3 text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="mt-3 text-center"
                            style={{
                                color: "#00eaff",
                                textShadow: "0 0 6px #00eaff, 0 0 12px #00eaff",
                                fontWeight: "500",
                            }}
                        >
                            {success}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
