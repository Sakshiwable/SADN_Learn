import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import AuthPage from "./pages/AuthPage";
import VerifyEmail from "./pages/VerifyEmail";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/authpage" />;
}

function AdminRoute({ children }) {
  const userEmail = localStorage.getItem("userEmail");
  return userEmail === "mrkhare@mitaoe.ac.in" ? children : <Navigate to="/" />;
}

function App() {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/authpage" element={<AuthPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin-only Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Admin />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
