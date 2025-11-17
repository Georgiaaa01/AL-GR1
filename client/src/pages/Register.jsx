// client/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "../api/user.routes";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await registerUser(formData);

        if (response.success) {
            toast.success("Registration successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } else {
            toast.error(response.message || "Registration failed");
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
                        Create an account
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    autoComplete="name"
                                    className="block w-full rounded-lg border border-pink-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>
                        </div>

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
                                Register
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-pink-500 hover:text-pink-600"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
