import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  if (!store.token) return <Navigate to="/signin" />;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "SET_TOKEN", payload: null });
    navigate("/logout");
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-start text-center"
      style={{
        background: "linear-gradient(to right, #ffe0f1, #e0f7ff)",
        fontFamily: "'Orbitron', sans-serif",
        paddingTop: "80px", 
        paddingBottom: "2rem",
        minHeight: "100vh"
      }}
    >
      <h1
        className="mb-4"
        style={{
          color: "#000",
          fontSize: "3.5rem",
          fontWeight: "900",
          textShadow: "0 0 6px #FF00FF, 0 0 16px #FF00FF",
          fontFamily: "'Orbitron', sans-serif",
          textAlign: "center"
        }}
      >
        Welcome, {store.user?.name || "User"}!
      </h1>

      <p
        className="mb-5"
        style={{
          color: "#555",
          fontSize: "1.1rem",
          fontFamily: "'Orbitron', sans-serif"
        }}
      >
        You are logged in successfully. Let’s explore!
      </p>

      <button
        className="btn"
        onClick={() => navigate("/")}
        style={{
          background: "#00AFFF",
          borderColor: "#00AFFF",
          color: "#fff",
          fontWeight: "bold",
          boxShadow: "0 0 8px #00AFFF",
          borderRadius: "8px",
          padding: "0.6rem 1.2rem",
          fontFamily: "'Orbitron', sans-serif"
        }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Profile;
