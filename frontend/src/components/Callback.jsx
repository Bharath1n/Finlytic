// components/Callback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authgearClient } from "../authgear"; // Import from the new module

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authgearClient.finishAuthentication()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Authentication callback error:", error);
        // In a real app, show an error message to the user (e.g., redirect to /login with an error param)
      });
  }, [navigate]);

  return <p>Completing authentication... Please wait.</p>; // User-friendly message
};

export default Callback;