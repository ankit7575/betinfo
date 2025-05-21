import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page Not Found</h2>
        <p style={styles.message}>
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" style={styles.button}>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "480px",
    width: "100%",
  },
  code: {
    fontSize: "96px",
    fontWeight: "bold",
    color: "#4f46e5",
    margin: "0",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    margin: "10px 0",
    color: "#333",
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "25px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "background-color 0.3s",
  },
};

export default PageNotFound;
