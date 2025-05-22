import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { Link } from "react-router-dom"; 

export const Profile = () => {
  const { store } = useGlobalReducer();

  if (!store.token) return <Navigate to="/signin" />;

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-start text-center"
      style={{
        background: "linear-gradient(to right, #ffe0f1, #e0f7ff)",
        fontFamily: "'Orbitron', sans-serif",
        minHeight: "100vh",
        paddingTop: "100px"
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
        style={{
          color: "#555",
          fontSize: "1.2rem",
          fontFamily: "'Orbitron', sans-serif"
        }}
      >
        You are logged in successfully. Let’s explore!
      </p>

      <Link
        to="/MainPage"
        className="btn btn-glow mt-4"
        style={{
          background: "linear-gradient(to right, #FF00FF, #00FFFF)",
          color: "#fff",
          padding: "12px 24px",
          fontSize: "1.2rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "30px",
          boxShadow: "0 0 12px #FF00FF, 0 0 20px #00FFFF",
          transition: "transform 0.3s ease-in-out"
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        My Profile
      </Link>
    </div>
  );
};

export default Profile;
