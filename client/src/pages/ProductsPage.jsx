// client/src/pages/ProductsPage.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProducts, deleteProduct } from '../api/product.routes';
import LoadingSpinner from '../components/LoadingSpinner';
import { addToCart, fetchCart } from "../api/cart.routes";
import { setCartState } from '../store/slices/cartSlice';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const user = useSelector((state) => state.user.user);
    const isAdmin = user?.role === 'admin';
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const { data } = await fetchProducts();
                if (data && Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setError('Failed to load products');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching products');
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    const handleEditClick = (productId) => {
        navigate(`/products/edit/${productId}`);
    };

    const handleDeleteClick = async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            setDeletingId(productId);
            const response = await deleteProduct(productId);

            if (response?.success) {
                setProducts(products.filter((p) => p.id !== productId));
                toast.success('Product deleted successfully');
            } else {
                toast.error(response?.message || 'Failed to delete product');
            }
        } catch (err) {
            toast.error(err.message || 'An error occurred while deleting the product');
        } finally {
            setDeletingId(null);
        }
    };

    const handleCreateClick = () => {
        navigate('/products/create');
    };

    const handleAddToCart = async (productId) => {
        if (!user) {
            toast.error("You need to be logged in to add products to cart.");
            return;
        }

        try {
            const response = await addToCart(productId, 1); // quantity = 1 by default

            if (response?.success) {
                toast.success("Product added to cart!");

                // reîncărcăm coșul și actualizăm Redux
                const cartResponse = await fetchCart();
                if (cartResponse?.data && Array.isArray(cartResponse.data)) {
                    dispatch(setCartState(cartResponse.data));
                }
            } else {
                toast.error(response?.message || "Could not add product to cart.");
            }
        } catch (err) {
            console.error("Error adding to cart:", err);
            toast.error("Error adding product to cart.");
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-pink-50 h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-rose-500 font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="bg-pink-50 h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-pink-600 font-semibold">No products available</p>
                    {isAdmin && (
                        <button
                            onClick={handleCreateClick}
                            className="mt-4 inline-flex items-center rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create First Product
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-pink-50 via-rose-100 to-purple-100 h-screen overflow-y-auto">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-pink-700">Products</h2>
                    {isAdmin && (
                        <button
                            onClick={handleCreateClick}
                            className="inline-flex items-center rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Product
                        </button>
                    )}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="relative">
                                <img
                                    alt={product.name}
                                    src={product.image || 'https://via.placeholder.com/300'}
                                    className="aspect-square w-full rounded-md bg-pink-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80 pointer-events-none"
                                />
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        <button
                                            type="button"
                                            className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-md shadow-lg transition-colors duration-200"
                                            onClick={() => handleEditClick(product.id)}
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-md shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => handleDeleteClick(product.id)}
                                            disabled={deletingId === product.id}
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-pink-800">
                                        {/* titlul simplu, fără overlay absolut */}
                                        {product.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-rose-500">{product.category}</p>
                                </div>
                                <p className="text-sm font-medium text-purple-700">${product.price}</p>
                            </div>

                            {/* Add to cart pentru user normal (nu admin) */}
                            {!isAdmin && (
                                <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="mt-2 w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md"
                                >
                                    Add to cart
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
