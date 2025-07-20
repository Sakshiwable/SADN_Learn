import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");

    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/verify-email?token=${token}`)
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url; // Redirect handled by backend
        } else if (res.ok) {
          setMessage("Email verified. Redirecting...");
          setTimeout(() => navigate("/authpage"), 2000);
        } else {
          res.text().then(setMessage);
        }
      })
      .catch(() => setMessage("Error verifying email. Please try again."));
  }, [location, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{message}</h2>
    </div>
  );
}

export default VerifyEmail;
