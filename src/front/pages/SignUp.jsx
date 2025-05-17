import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fetchSignUp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await fetchSignUp.json();
      if (fetchSignUp.ok) {
        alert("Sign Up Successful!");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: ""
        });
        navigate("/signin");
      } else {
        alert("Sign Up failed: " + data.msg);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: ""
        });
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #ffe0f1, #e0f7ff)",
        fontFamily: "'Orbitron', sans-serif"
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="neon-form p-4"
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "16px",
          boxShadow: "0 0 25px rgba(255, 0, 255, 0.3)",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        <h4
          className="text-center mb-4"
          style={{
            color: "#fff",
            textShadow: "0 0 6px #FF00FF, 0 0 12px #FF00FF",
            fontWeight: "bold"
          }}
        >
          Sign Up
        </h4>

        {["name", "email", "password", "phone"].map((field, i) => (
          <div className="mb-3" key={i}>
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : field === "phone" ? "tel" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={
                field === "phone"
                  ? "Phone Number"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className="form-control"
              style={{
                background: "#000",
                border: "2px solid #FF00FF",
                color: "#FF00FF",
                boxShadow: "0 0 6px #FF00FF",
                borderRadius: "8px"
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          className="btn w-100 mt-3"
          style={{
            background: "#00AFFF",
            borderColor: "#00AFFF",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 0 12px #00AFFF, 0 0 24px #00AFFF",
            borderRadius: "8px"
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};
