import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

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
    </div>
  );
};

export default Profile;
