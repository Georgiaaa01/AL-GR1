// client/src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { loginUser } from "../api/auth.routes";
import { setToken } from "../store/slices/userSlice";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await loginUser(formData);

        if (response?.success) {
            dispatch(setToken(response.data));
            toast.success("Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } else {
            toast.error(response?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                    <img
                        alt="Your Company"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=f9a8d4&shade=500"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-pink-700">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-full bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-pink-500 hover:text-pink-600"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
