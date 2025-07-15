import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/authpage");
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg ring-1 ring-gray-200 py-2 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center px-4 md:px-10">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <h1 className="text-xl font-bold text-orange-900 font-serif tracking-wider">
            SADN Learn
          </h1>
        </Link>

        {/* Hamburger Menu for small screens */}
        <button
          className="md:hidden flex items-center px-2 py-1 text-orange-900 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          {!token && location.pathname !== "/authpage" && (
            <Link to="/authpage">
              <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 text-gray-800 rounded-lg shadow hover:shadow-md hover:scale-105 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-orange-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.29.534 6.121 1.477M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Login</span>
              </button>
            </Link>
          )}

          {token && userName && (
            <>
              {userEmail === "mrkhare@mitaoe.ac.in" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-1 bg-orange-700 text-white px-3 py-1 rounded-lg shadow hover:bg-orange-800 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h18M3 12h18M3 17h18"
                    />
                  </svg>
                  Admin
                </button>
              )}

              <Link to="/profile">
                <button className="flex items-center h-8 w-8 bg-red-50 px-2 text-red-600 rounded-full shadow hover:bg-gray-300 hover:scale-105 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-orange-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.29.534 6.121 1.477M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center h-8 w-8 bg-red-50 px-2 text-red-600 rounded-full shadow hover:bg-red-100 hover:scale-105 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow rounded-b-lg">
          {!token && location.pathname !== "/authpage" && (
            <Link to="/authpage" onClick={() => setMenuOpen(false)}>
              <div className="block px-4 py-2 text-gray-800 bg-gray-100 rounded hover:bg-gray-200">
                Login
              </div>
            </Link>
          )}

          {token && userName && (
            <>
              {userEmail === "atharvjadhav215@gmail.com" && (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/admin");
                  }}
                  className="block w-full text-left px-4 py-2 bg-orange-100 text-orange-900 rounded hover:bg-orange-200"
                >
                  Admin
                </button>
              )}

              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                <div className="block px-4 py-2 text-gray-800 bg-gray-100 rounded hover:bg-gray-200">
                  Profile
                </div>
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
