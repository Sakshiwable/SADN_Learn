import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import Navbar from "@/components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
    const [mode, setMode] = useState("login");
    const [isPasswordStrong, setIsPasswordStrong] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const isStrongPassword = (password) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === "login") {
            try {
                const res = await axios.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userRole", res.data.user.role);
                localStorage.setItem("userName", res.data.user.name);
                localStorage.setItem("userEmail", res.data.user.email);

                toast.success("Login successful");

                setTimeout(() => {
                    if (formData.email.toLowerCase() === "sakshiwable0907@gmail.com") {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                }, 1000);
            } catch (err) {
                const msg =
                    err.response?.data?.message || "Login failed. Please try again.";
                toast.error(msg);
            }
        } else if (mode === "signup") {
            try {
                if (formData.password !== formData.confirmPassword) {
                    toast.warn("Passwords do not match");
                    return;
                }

                if (!isStrongPassword(formData.password)) {
                    toast.error(
                        "Password must be at least 8 characters long and include letters, numbers, and special characters."
                    );
                    return;
                }

                const res = await axios.post("/auth/signup", {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                });

                toast.success(
                    res.data.message ||
                    "Signup successful. Please check your email to verify your account."
                );

                // Switch to login form
                setMode("login");
            } catch (error) {
                const msg =
                    error.response?.data?.message ||
                    "Signup failed. Please try again later.";
                toast.error(msg);
            }
        }
    };


    return (
        <div>
            <Navbar />
            <ToastContainer position="top-center" autoClose={2000} />

            <div className="min-h-screen bg-gradient-to-tr from-[#f9f9f8] via-[#f9f4ed] to-[#f5ebde] flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 font-sans">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-96 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white/40 backdrop-blur-xl shadow-black shadow-2xl rounded-3xl p-6 sm:p-8"
                >
                    {/* Toggle Buttons */}
                    <div className="flex justify-center gap-4 mb-6 sm:mb-8">
                        <button
                            onClick={() => setMode("login")}
                            className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${mode === "login"
                                ? "bg-orange-300 text-white shadow-md"
                                : "bg-white/60 text-gray-800"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`px-6 py-2 rounded-full font-semibold transition duration-300 ${mode === "signup"
                                ? "bg-orange-300 text-white shadow-md"
                                : "bg-white/60 text-gray-800"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-2xl sm:text-3xl font-bold text-center font-serif text-gray-800 mb-6"
                    >
                        {mode === "login" ? "Welcome Back" : "Create Account"}
                    </motion.h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {mode === "login" && (
                            <div className="flex-col flex gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={formData.email}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-transparent focus:ring-2 focus:ring-purple-400 transition bg-white text-gray-900 shadow-inner"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        value={formData.password}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-transparent focus:ring-2 focus:ring-purple-400 transition bg-white text-gray-900 shadow-inner"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {mode === "signup" && (
                            <div className="flex-col flex gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        value={formData.name}
                                        required
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 rounded-xl border-transparent focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={formData.email}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-xl border-transparent focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setIsPasswordStrong(isStrongPassword(e.target.value));
                                            }}
                                            required
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl border-transparent focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                                        />
                                        {!isPasswordStrong && formData.password.length > 0 && (
                                            <p className="text-sm text-red-600 mt-1">
                                                Password must be at least 8 characters, include a number, letter, and a special character.
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            onChange={handleChange}
                                            value={formData.confirmPassword}
                                            required
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 rounded-xl border-transparent focus:ring-2 focus:ring-purple-400 bg-white text-gray-900 shadow-inner"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-700 hover:to-orange-500"
                            >
                                {mode === "login" ? "Log In" : "Create Account"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;
