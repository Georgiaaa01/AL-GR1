// client/src/pages/HomePage.jsx
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
            <div className="max-w-4xl text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl px-8 py-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-pink-700 mb-4">
                    Welcome to Our Store 💖
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8">
                    Discover cute, stylish and modern products chosen just for you.
                </p>
                <Link
                    to="/products"
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition duration-200"
                >
                    View Products
                </Link>
            </div>
        </div>
    );
}
