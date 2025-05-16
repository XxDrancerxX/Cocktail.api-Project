import React from "react";

export const Password = () => {
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
      {/* Form box */}
      <div
        className="p-4"
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

        {[
          { type: "text", placeholder: "User Name" },
          { type: "email", placeholder: "Email" },
          { type: "password", placeholder: "New Password" },
          { type: "tel", placeholder: "Confirm New Password" },
        ].map((input, i) => (
          <div className="mb-3" key={i}>
            <input
              type={input.type}
              placeholder={input.placeholder}
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
        ))}

        {/* Button */}
        <div className="text-center mt-4">
          <button
            className="btn"
            style={{
              background: "#FF00FF",
              color: "#fff",
              fontWeight: "bold",
              boxShadow: "0 0 12px #FF00FF, 0 0 24px #FF00FF",
              transition: "all 0.3s ease-in-out",
              borderRadius: "8px",
              padding: "10px 25px",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow =
                "0 0 16px #FF00FF, 0 0 32px #FF00FF, 0 0 48px #FF00FF")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow =
                "0 0 12px #FF00FF, 0 0 24px #FF00FF")
            }
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};
